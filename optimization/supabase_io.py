from __future__ import annotations

import os
from datetime import datetime, timezone
from typing import Any

from dotenv import load_dotenv

from .schemas import AllocationRequest, OptimizationResult

load_dotenv()


class SupabaseConfigurationError(RuntimeError):
    pass


def _client():
    try:
        from supabase import create_client
    except ImportError as exc:
        raise SupabaseConfigurationError(
            "Install supabase-py to enable P4 Supabase integration."
        ) from exc

    url = os.getenv("SUPABASE_URL")
    key = (
        os.getenv("SUPABASE_SERVICE_ROLE_KEY")
        or os.getenv("SUPABASE_SECRET_KEY")
        or os.getenv("SUPABASE_KEY")
    )

    if not url or not key:
        raise SupabaseConfigurationError(
            "SUPABASE_URL and a server-side Supabase key are required."
        )

    return create_client(url, key)


def fetch_risk_predictions(
    material_id: str | None = None,
) -> list[dict[str, Any]]:
    """
    Return the latest P3 risk prediction for each supplier.

    P3 writes historical rows to risk_predictions. The newest
    p3-risk-v2 row for each supplier is treated as the source of
    truth for P4.
    """
    client = _client()

    response = (
        client
        .table("risk_predictions")
        .select("*")
        .order("id", desc=True)
        .execute()
    )

    rows = response.data or []

    p3_rows = [
        row
        for row in rows
        if row.get("model_version") == "p3-risk-v2"
    ]

    source_rows = p3_rows or rows

    latest_by_supplier: dict[str, dict[str, Any]] = {}

    for row in source_rows:
        supplier_id = str(row["supplier_id"])

        if supplier_id not in latest_by_supplier:
            latest_by_supplier[supplier_id] = row

    result = list(latest_by_supplier.values())

    if material_id is None:
        return result

    return [
        row
        for row in result
        if row.get("material_id") in (None, material_id)
    ]


def write_procurement_plan(
    request: AllocationRequest,
    result: OptimizationResult,
) -> dict[str, Any]:
    """
    Insert a procurement plan using the live Supabase schema.

    Live schema:
        id
        material_id
        total_required
        total_allocated
        total_cost
        status
        created_at
    """
    client = _client()

    status = (
        "OPTIMIZED"
        if result.is_success
        else result.status
    )

    payload = {
        "material_id": result.material_id,
        "total_required": result.required_quantity,
        "total_allocated": result.total_allocated,
        "total_cost": result.total_cost,
        "status": status,
        "created_at": datetime.now(timezone.utc).isoformat(),
    }

    response = (
        client
        .table("procurement_plans")
        .insert(payload)
        .execute()
    )

    rows = response.data or []

    if not rows:
        raise RuntimeError(
            "Supabase did not return the inserted procurement plan."
        )

    return rows[0]


def write_supplier_allocations(
    result: OptimizationResult,
    procurement_plan_id: int,
) -> list[dict[str, Any]]:
    """
    Insert supplier allocation rows linked to a procurement plan.

    Live schema:
        id
        procurement_plan_id
        supplier_id
        quantity
        unit_price
        total_cost
        risk_score
        expected_delivery_date
    """
    client = _client()

    rows = [
        {
            "procurement_plan_id": int(procurement_plan_id),
            "supplier_id": line.supplier_id,
            "quantity": line.quantity,
            "unit_price": line.unit_price,
            "total_cost": line.total_cost,
            "risk_score": line.risk_score,
            "expected_delivery_date": (
                line.expected_delivery_date.isoformat()
            ),
        }
        for line in result.allocation
    ]

    if not rows:
        return []

    response = (
        client
        .table("supplier_allocations")
        .insert(rows)
        .execute()
    )

    return response.data or []


def write_optimization_result(
    request: AllocationRequest,
    result: OptimizationResult,
) -> dict[str, Any]:
    """
    Persist a complete P4 optimization result.

    1. Insert procurement_plans row.
    2. Read its generated ID.
    3. Insert supplier_allocations linked to that ID.
    """
    plan = write_procurement_plan(request, result)

    plan_id = plan.get("id")

    if plan_id is None:
        raise RuntimeError(
            "Inserted procurement plan did not return an id."
        )

    allocations = write_supplier_allocations(
        result,
        int(plan_id),
    )

    return {
        "procurement_plan": plan,
        "supplier_allocations": allocations,
    }