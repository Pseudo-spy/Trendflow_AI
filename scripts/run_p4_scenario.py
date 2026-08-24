from __future__ import annotations

import json
from dataclasses import asdict
from datetime import date
from pathlib import Path

from pathlib import Path
import sys

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from optimization.config import OptimizationConfig
from optimization.loader import load_supplier_options
from optimization.optimizer import SupplierAllocationOptimizer
from optimization.schemas import AllocationRequest
from optimization.scenarios import supplier_disruption
from optimization.visualize import save_allocation_charts, save_scenario_comparison

ROOT = Path(__file__).resolve().parents[1]


def run() -> None:
    suppliers = load_supplier_options(
        ROOT / "data/sample/supplier_materials.csv",
        ROOT / "data/sample/suppliers.csv",
        ROOT / "reports/risk_predictions.csv" if (ROOT / "reports/risk_predictions.csv").exists() else None,
        ROOT / "data/sample/supplier_contracts.csv" if (ROOT / "data/sample/supplier_contracts.csv").exists() else None,
        "MAT001",
    )
    request = AllocationRequest("MAT001", 30000, date(2026, 10, 15), "PLANT001", "HIGH")
    config = OptimizationConfig(today=date(2026, 8, 23))
    optimizer = SupplierAllocationOptimizer(config)

    baseline = optimizer.optimize(request, suppliers)
    disrupted_suppliers = supplier_disruption(suppliers, "SUP001", capacity_multiplier=0.50, risk_delta=0.20, lead_time_delta_days=7)
    scenario = optimizer.optimize(request, disrupted_suppliers)

    out = ROOT / "reports/p4"
    out.mkdir(parents=True, exist_ok=True)
    if baseline.is_success:
        save_allocation_charts(baseline, out)
    if baseline.is_success and scenario.is_success:
        save_scenario_comparison(baseline, scenario, out / "scenario_comparison.png", "SUP001 disruption")

    payload = {
        "baseline": asdict(baseline),
        "scenario": asdict(scenario),
    }
    print(json.dumps(payload, indent=2, default=str))


if __name__ == "__main__":
    run()
