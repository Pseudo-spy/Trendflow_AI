from __future__ import annotations

import argparse
import json
from dataclasses import asdict, replace
from datetime import date
from pathlib import Path

from .config import OptimizationConfig
from .loader import load_supplier_options
from .optimizer import SupplierAllocationOptimizer
from .schemas import AllocationRequest
from .supabase_io import fetch_risk_predictions
from .visualize import save_allocation_charts


def _serialize(result):
    payload = asdict(result)
    payload["allocation"] = [
        {
            **asdict(line),
            "expected_delivery_date": line.expected_delivery_date.isoformat(),
        }
        for line in result.allocation
    ]

    for key in ("diagnostics", "kpis"):
        payload[key] = asdict(getattr(result, key))

    return payload


def _apply_supabase_risk(
    suppliers,
    risk_rows: list[dict],
):
    """
    Apply the latest P3 risk predictions from Supabase to the P4
    SupplierOption objects.

    Supabase mapping:
        delay_probability -> risk_score
        risk_level        -> risk_level
        delivery_risk     -> delivery_risk
        quality_risk      -> existing/default P4 quality risk

    SupplierOption is frozen, so new objects are created with replace().
    """
    risk_by_supplier: dict[str, dict] = {}

    for row in risk_rows:
        supplier_id = str(row.get("supplier_id", "")).strip()
        if not supplier_id:
            continue

        risk_by_supplier[supplier_id] = row

    updated_suppliers = []

    for supplier in suppliers:
        row = risk_by_supplier.get(supplier.supplier_id)

        if row is None:
            updated_suppliers.append(supplier)
            continue

        risk_score = float(
            row.get("delay_probability", supplier.risk_score)
        )
        risk_score = max(0.0, min(1.0, risk_score))

        risk_level = str(
            row.get("risk_level", supplier.risk_level)
        ).strip().upper()

        if risk_level not in {"LOW", "MEDIUM", "HIGH"}:
            risk_level = supplier.risk_level

        delivery_risk_raw = row.get("delivery_risk")
        if delivery_risk_raw is None:
            delivery_risk = risk_score
        else:
            delivery_risk = float(delivery_risk_raw)
            delivery_risk = max(0.0, min(1.0, delivery_risk))

        # The current Supabase risk_predictions table does not contain
        # quality_risk, so preserve the existing P4 value here.
        quality_risk = supplier.quality_risk

        updated_suppliers.append(
            replace(
                supplier,
                risk_score=risk_score,
                risk_level=risk_level,
                delivery_risk=delivery_risk,
                quality_risk=quality_risk,
            )
        )

    return updated_suppliers


def main() -> None:
    parser = argparse.ArgumentParser(
        description="TrendFlow P4 OR-Tools supplier allocation"
    )
    parser.add_argument("--material-id", default="MAT001")
    parser.add_argument("--quantity", type=int, default=30000)
    parser.add_argument("--required-date", default="2026-10-15")
    parser.add_argument("--plant-id", default="PLANT001")
    parser.add_argument("--priority", default="HIGH")
    parser.add_argument("--current-date", default=str(date.today()))
    parser.add_argument("--time-limit", type=float, default=15.0)
    parser.add_argument("--max-suppliers", type=int, default=None)
    parser.add_argument("--output-dir", default="reports/p4")
    args = parser.parse_args()

    root = Path(__file__).resolve().parents[1]

    contracts = root / "data/sample/supplier_contracts.csv"

    # Load P4 supplier/master/contract data locally.
    # Risk is intentionally NOT loaded from reports/risk_predictions.csv.
    # The latest P3 risk is now sourced from Supabase.
    suppliers = load_supplier_options(
        root / "data/sample/supplier_materials.csv",
        root / "data/sample/suppliers.csv",
        None,
        contracts if contracts.exists() else None,
        args.material_id,
    )

    # Read latest P3 supplier-risk snapshots from Supabase.
    risk_rows = fetch_risk_predictions(args.material_id)

    if not risk_rows:
        raise RuntimeError(
            "No supplier risk predictions were returned from Supabase."
        )

    suppliers = _apply_supabase_risk(
        suppliers,
        risk_rows,
    )

    print(
        f"Loaded {len(risk_rows)} latest supplier risk records from Supabase."
    )

    request = AllocationRequest(
        material_id=args.material_id,
        required_quantity=args.quantity,
        required_date=date.fromisoformat(args.required_date),
        plant_id=args.plant_id,
        priority=args.priority,
    )

    config = OptimizationConfig(
        solver_time_limit_seconds=args.time_limit,
        max_suppliers=args.max_suppliers,
        today=date.fromisoformat(args.current_date),
    )

    result = SupplierAllocationOptimizer(config).optimize(
        request,
        suppliers,
    )

    output_dir = root / args.output_dir
    output_dir.mkdir(parents=True, exist_ok=True)

    json_path = output_dir / "p4_optimization_result.json"
    json_path.write_text(
        json.dumps(_serialize(result), indent=2),
        encoding="utf-8",
    )

    if result.is_success:
        save_allocation_charts(result, output_dir)

    print(json.dumps(_serialize(result), indent=2))

    if not result.is_success:
        raise SystemExit(2)


if __name__ == "__main__":
    main()