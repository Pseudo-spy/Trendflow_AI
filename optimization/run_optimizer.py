from __future__ import annotations

import argparse
import json
from dataclasses import asdict
from datetime import date
from pathlib import Path

from .config import OptimizationConfig
from .loader import load_supplier_options
from .optimizer import SupplierAllocationOptimizer
from .schemas import AllocationRequest
from .visualize import save_allocation_charts


def _serialize(result):
    payload = asdict(result)
    payload["allocation"] = [
        {**asdict(line), "expected_delivery_date": line.expected_delivery_date.isoformat()}
        for line in result.allocation
    ]
    for k in ("diagnostics", "kpis"):
        payload[k] = asdict(getattr(result, k))
    return payload


def main() -> None:
    parser = argparse.ArgumentParser(description="TrendFlow P4 OR-Tools supplier allocation")
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
    risk = root / "reports/risk_predictions.csv"
    contracts = root / "data/sample/supplier_contracts.csv"
    suppliers = load_supplier_options(
        root / "data/sample/supplier_materials.csv",
        root / "data/sample/suppliers.csv",
        risk if risk.exists() else None,
        contracts if contracts.exists() else None,
        args.material_id,
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
    result = SupplierAllocationOptimizer(config).optimize(request, suppliers)

    output_dir = root / args.output_dir
    output_dir.mkdir(parents=True, exist_ok=True)
    json_path = output_dir / "p4_optimization_result.json"
    json_path.write_text(json.dumps(_serialize(result), indent=2), encoding="utf-8")
    if result.is_success:
        save_allocation_charts(result, output_dir)

    print(json.dumps(_serialize(result), indent=2))
    if not result.is_success:
        raise SystemExit(2)


if __name__ == "__main__":
    main()
