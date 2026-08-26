"""
Orchestrates a baseline optimization run against a "what-if" scenario run,
using the real components already built by the team:

    optimization.loader     -> loads real supplier/material/contract/risk data
    optimization.optimizer  -> the actual OR-Tools CP-SAT solver
    optimization.scenarios  -> the documented perturbation functions
        (demand_spike, capacity_cut, supplier_disruption, lead_time_shock)

This module does not reimplement any decision logic. It calls the existing,
already-tested pieces twice (once unperturbed, once perturbed) and reports
the factual difference between the two results. Nothing here invents a
number that didn't come out of the real optimizer.
"""
from __future__ import annotations

from dataclasses import dataclass, field
from datetime import date
from pathlib import Path
from typing import Literal

from .config import OptimizationConfig
from .loader import load_supplier_options
from .optimizer import SupplierAllocationOptimizer
from .schemas import AllocationRequest, OptimizationResult, SupplierOption
from .scenarios import capacity_cut, demand_spike, lead_time_shock, supplier_disruption

ScenarioType = Literal[
    "demand_spike", "capacity_reduction", "supplier_disruption", "lead_time_shock"
]


@dataclass(frozen=True)
class AllocationDelta:
    supplier_id: str
    baseline_quantity: int
    scenario_quantity: int

    @property
    def change(self) -> int:
        return self.scenario_quantity - self.baseline_quantity


@dataclass(frozen=True)
class ScenarioComparison:
    scenario_type: ScenarioType
    parameters: dict
    baseline: OptimizationResult
    scenario: OptimizationResult
    allocation_deltas: list[AllocationDelta] = field(default_factory=list)

    @property
    def feasibility_changed(self) -> bool:
        return self.baseline.is_success != self.scenario.is_success

    @property
    def cost_delta(self) -> float:
        return self.scenario.total_cost - self.baseline.total_cost

    @property
    def cost_delta_pct(self) -> float | None:
        if self.baseline.total_cost == 0:
            return None
        return (self.cost_delta / self.baseline.total_cost) * 100

    @property
    def risk_delta(self) -> float:
        return (
            self.scenario.kpis.weighted_avg_risk_score
            - self.baseline.kpis.weighted_avg_risk_score
        )

    def summary(self) -> str:
        """A short, factual, non-interpretive summary. Every number here
        comes directly from the two OptimizationResult objects."""
        lines = [f"Scenario: {self.scenario_type} ({self.parameters})"]
        if self.feasibility_changed:
            lines.append(
                f"Feasibility changed: baseline={self.baseline.status}, "
                f"scenario={self.scenario.status}"
            )
        else:
            lines.append(f"Feasibility unchanged: both runs are {self.scenario.status}")

        lines.append(
            f"Cost: {self.baseline.total_cost:,.2f} -> {self.scenario.total_cost:,.2f} "
            f"({self.cost_delta:+,.2f}"
            + (f", {self.cost_delta_pct:+.1f}%)" if self.cost_delta_pct is not None else ")")
        )
        lines.append(
            f"Weighted risk score: {self.baseline.kpis.weighted_avg_risk_score:.3f} -> "
            f"{self.scenario.kpis.weighted_avg_risk_score:.3f} ({self.risk_delta:+.3f})"
        )
        for d in self.allocation_deltas:
            if d.change != 0:
                lines.append(
                    f"  {d.supplier_id}: {d.baseline_quantity:,} -> "
                    f"{d.scenario_quantity:,} ({d.change:+,})"
                )
        return "\n".join(lines)


def _load_baseline_suppliers(
    data_dir: str | Path,
    reports_dir: str | Path,
    material_id: str,
) -> list[SupplierOption]:
    data_dir = Path(data_dir)
    reports_dir = Path(reports_dir)
    return load_supplier_options(
        supplier_materials_csv=data_dir / "supplier_materials.csv",
        suppliers_csv=data_dir / "suppliers.csv",
        risk_predictions_csv=reports_dir / "risk_predictions.csv",
        supplier_contracts_csv=data_dir / "supplier_contracts.csv",
        material_id=material_id,
    )


def _apply_scenario(
    scenario_type: ScenarioType,
    suppliers: list[SupplierOption],
    request: AllocationRequest,
    target_supplier_id: str | None,
    magnitude: float,
) -> tuple[list[SupplierOption], AllocationRequest]:
    """Returns the perturbed (suppliers, request) pair for the scenario type."""
    if scenario_type == "demand_spike":
        return suppliers, demand_spike(request, multiplier=1 + magnitude)

    if target_supplier_id is None:
        raise ValueError(f"{scenario_type} requires target_supplier_id")

    if scenario_type == "capacity_reduction":
        return capacity_cut(suppliers, target_supplier_id, reduction=magnitude), request
    if scenario_type == "supplier_disruption":
        return (
            supplier_disruption(suppliers, target_supplier_id, capacity_multiplier=1 - magnitude),
            request,
        )
    if scenario_type == "lead_time_shock":
        return lead_time_shock(suppliers, target_supplier_id, extra_days=int(magnitude)), request

    raise ValueError(f"Unknown scenario_type: {scenario_type}")


def run_scenario(
    scenario_type: ScenarioType,
    material_id: str,
    required_quantity: int,
    required_date: date,
    plant_id: str,
    priority: str = "HIGH",
    target_supplier_id: str | None = None,
    magnitude: float = 0.3,
    data_dir: str | Path = "data/sample",
    reports_dir: str | Path = "reports",
    current_date: date | None = None,
    config: OptimizationConfig | None = None,
) -> ScenarioComparison:
    """
    Runs a real baseline optimization, then re-runs it under the requested
    what-if perturbation, using the team's actual optimizer and scenario
    functions. Returns both full results plus a computed delta.
    """
    suppliers = _load_baseline_suppliers(data_dir, reports_dir, material_id)
    request = AllocationRequest(material_id, required_quantity, required_date, plant_id, priority)

    optimizer = SupplierAllocationOptimizer(config)
    baseline = optimizer.optimize(request, suppliers, current_date=current_date)

    scenario_suppliers, scenario_request = _apply_scenario(
        scenario_type, suppliers, request, target_supplier_id, magnitude
    )
    scenario_result = optimizer.optimize(scenario_request, scenario_suppliers, current_date=current_date)

    baseline_qty = {a.supplier_id: a.quantity for a in baseline.allocation}
    scenario_qty = {a.supplier_id: a.quantity for a in scenario_result.allocation}
    all_ids = sorted(set(baseline_qty) | set(scenario_qty))
    deltas = [
        AllocationDelta(sid, baseline_qty.get(sid, 0), scenario_qty.get(sid, 0))
        for sid in all_ids
    ]

    return ScenarioComparison(
        scenario_type=scenario_type,
        parameters={"target_supplier_id": target_supplier_id, "magnitude": magnitude},
        baseline=baseline,
        scenario=scenario_result,
        allocation_deltas=deltas,
    )


if __name__ == "__main__":
    for scenario_type, kwargs in [
        ("supplier_disruption", dict(target_supplier_id="SUP001", magnitude=0.7)),
        ("capacity_reduction", dict(target_supplier_id="SUP001", magnitude=0.5)),
        ("lead_time_shock", dict(target_supplier_id="SUP001", magnitude=10)),
        ("lead_time_shock", dict(target_supplier_id="SUP001", magnitude=15)),
        ("demand_spike", dict(magnitude=0.2)),
    ]:
        print("=" * 70)
        comparison = run_scenario(
            scenario_type=scenario_type,
            material_id="MAT001",
            required_quantity=30_000,
            required_date=date(2026, 10, 15),
            plant_id="PLANT001",
            priority="HIGH",
            current_date=date(2026, 8, 23),
            **kwargs,
        )
        print(comparison.summary())
        print()