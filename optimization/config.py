from __future__ import annotations

from dataclasses import dataclass
from datetime import date


@dataclass(frozen=True)
class ObjectiveWeights:
    """Relative weights for the P4 business objective."""

    cost: float = 0.45
    supplier_risk: float = 0.22
    delivery_risk: float = 0.12
    lead_time: float = 0.09
    quality: float = 0.07
    otd: float = 0.05

    def __post_init__(self) -> None:
        values = (self.cost, self.supplier_risk, self.delivery_risk, self.lead_time, self.quality, self.otd)
        if any(v < 0 for v in values):
            raise ValueError("Objective weights must be non-negative.")
        if sum(values) <= 0:
            raise ValueError("At least one objective weight must be positive.")

    @property
    def normalized(self) -> "ObjectiveWeights":
        total = self.cost + self.supplier_risk + self.delivery_risk + self.lead_time + self.quality + self.otd
        return ObjectiveWeights(
            cost=self.cost / total,
            supplier_risk=self.supplier_risk / total,
            delivery_risk=self.delivery_risk / total,
            lead_time=self.lead_time / total,
            quality=self.quality / total,
            otd=self.otd / total,
        )


@dataclass(frozen=True)
class OptimizationConfig:
    """Hard constraints, solver settings and objective policy."""

    weights: ObjectiveWeights = ObjectiveWeights()
    enforce_required_date: bool = True
    enforce_contract_lead_time: bool = True
    enforce_contract_quality: bool = False
    enforce_contract_otd: bool = False
    enforce_approved_supplier: bool = True
    require_full_allocation: bool = True
    allow_partial_coverage: bool = False
    max_suppliers: int | None = None
    high_risk_allocation_cap: float = 1.0
    solver_time_limit_seconds: float = 15.0
    num_search_workers: int = 8
    random_seed: int = 42
    objective_scale: int = 1_000_000
    today: date | None = None
    model_version: str = "p4-cpsat-v2"

    def __post_init__(self) -> None:
        if not 0 < self.high_risk_allocation_cap <= 1:
            raise ValueError("high_risk_allocation_cap must be in (0, 1].")
        if self.solver_time_limit_seconds <= 0:
            raise ValueError("solver_time_limit_seconds must be > 0.")
        if self.num_search_workers <= 0:
            raise ValueError("num_search_workers must be > 0.")
        if self.objective_scale <= 0:
            raise ValueError("objective_scale must be > 0.")
        if self.max_suppliers is not None and self.max_suppliers <= 0:
            raise ValueError("max_suppliers must be > 0 when provided.")
