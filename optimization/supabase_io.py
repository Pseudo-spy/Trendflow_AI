from __future__ import annotations

import os
from datetime import datetime, timezone
from typing import Any

from .schemas import AllocationRequest, OptimizationResult


class SupabaseConfigurationError(RuntimeError):
    pass


def _client():
    try:
        from supabase import create_client
    except ImportError as exc:
        raise SupabaseConfigurationError("Install supabase-py to enable P4 Supabase integration.") from exc
    url = os.getenv("SUPABASE_URL")
    key = os.getenv("SUPABASE_SERVICE_ROLE_KEY") or os.getenv("SUPABASE_SECRET_KEY")
    if not url or not key:
        raise SupabaseConfigurationError("SUPABASE_URL and a server-side Supabase key are required.")
    return create_client(url, key)


def fetch_risk_predictions(material_id: str | None = None) -> list[dict[str, Any]]:
    client = _client()
    query = client.table("risk_predictions").select("*")
    response = query.execute()
    rows = response.data or []
    if material_id is None:
        return rows
    return [row for row in rows if row.get("material_id") in (None, material_id)]


def write_procurement_plan(request: AllocationRequest, result: OptimizationResult) -> dict[str, Any]:
    client = _client()
    payload = {
        "material_id": result.material_id,
        "plant_id": result.plant_id,
        "required_quantity": result.required_quantity,
        "total_allocated": result.total_allocated,
        "total_cost": result.total_cost,
        "status": result.status,
        "required_date": request.required_date.isoformat(),
        "priority": request.priority.upper(),
        "model_version": result.model_version,
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    return client.table("procurement_plans").insert(payload).execute().data or {}


def write_supplier_allocations(result: OptimizationResult) -> list[dict[str, Any]]:
    client = _client()
    rows = [
        {
            "supplier_id": line.supplier_id,
            "material_id": line.material_id,
            "quantity": line.quantity,
            "percentage": line.percentage,
            "unit_price": line.unit_price,
            "total_cost": line.total_cost,
            "risk_score": line.risk_score,
            "expected_delivery_date": line.expected_delivery_date.isoformat(),
            "model_version": result.model_version,
        }
        for line in result.allocation
    ]
    return client.table("supplier_allocations").insert(rows).execute().data or []
