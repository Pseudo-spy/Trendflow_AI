from __future__ import annotations

from dataclasses import dataclass, field
from datetime import date
from typing import Literal

RiskLevel = Literal["LOW", "MEDIUM", "HIGH"]


@dataclass(frozen=True)
class AllocationRequest:
    material_id: str
    required_quantity: int
    required_date: date
    plant_id: str
    priority: str = "MEDIUM"

    def __post_init__(self) -> None:
        if not self.material_id.strip():
            raise ValueError("material_id cannot be empty")
        if self.required_quantity <= 0:
            raise ValueError("required_quantity must be > 0")
        if not self.plant_id.strip():
            raise ValueError("plant_id cannot be empty")
        if self.priority.upper() not in {"LOW", "MEDIUM", "HIGH", "URGENT"}:
            raise ValueError("priority must be LOW, MEDIUM, HIGH, or URGENT")


@dataclass(frozen=True)
class SupplierOption:
    supplier_id: str
    supplier_name: str
    material_id: str
    unit_price: float
    capacity: int
    lead_time_days: int
    quality_score: float
    otd_score: float
    min_allocation: int
    max_allocation: int
    risk_score: float
    risk_level: RiskLevel
    delivery_risk: float
    quality_risk: float
    approved: bool = True

    def __post_init__(self) -> None:
        if self.unit_price < 0:
            raise ValueError("unit_price cannot be negative")
        if self.capacity < 0:
            raise ValueError("capacity cannot be negative")
        if self.min_allocation < 0 or self.max_allocation < 0:
            raise ValueError("allocation bounds cannot be negative")
        if self.max_allocation > self.capacity:
            raise ValueError("max_allocation cannot exceed capacity")
        if self.min_allocation > self.max_allocation:
            raise ValueError("min_allocation cannot exceed max_allocation")
        if self.lead_time_days < 0:
            raise ValueError("lead_time_days cannot be negative")
        for name, value in {
            "risk_score": self.risk_score,
            "delivery_risk": self.delivery_risk,
            "quality_risk": self.quality_risk,
        }.items():
            if not 0 <= value <= 1:
                raise ValueError(f"{name} must be in [0, 1]")
        if not 0 <= self.quality_score <= 100 or not 0 <= self.otd_score <= 100:
            raise ValueError("quality_score and otd_score must be in [0, 100]")


    @property
    def effective_max_allocation(self) -> int:
        return min(self.capacity, self.max_allocation)




@dataclass(frozen=True)
class AllocationLine:
    supplier_id: str
    supplier_name: str
    material_id: str
    quantity: int
    percentage: float
    unit_price: float
    total_cost: float
    risk_score: float
    risk_level: RiskLevel
    delivery_risk: float
    quality_risk: float
    quality_score: float
    otd_score: float
    lead_time_days: int
    expected_delivery_date: date


@dataclass(frozen=True)
class OptimizationKpis:
    avg_unit_cost: float = 0.0
    weighted_avg_risk_score: float = 0.0
    weighted_delivery_risk: float = 0.0
    weighted_quality_risk: float = 0.0
    weighted_lead_time_days: float = 0.0
    weighted_quality_score: float = 0.0
    weighted_otd_score: float = 0.0
    suppliers_used: int = 0
    allocation_concentration_hhi: float = 0.0
    cheapest_available_price: float = 0.0
    premium_over_cheapest_pct: float = 0.0
    high_risk_share: float = 0.0


@dataclass(frozen=True)
class SupplierDiagnostic:
    supplier_id: str
    reason: str


@dataclass(frozen=True)
class OptimizationDiagnostics:
    excluded_suppliers: list[SupplierDiagnostic] = field(default_factory=list)
    objective_breakdown: dict[str, dict[str, float]] = field(default_factory=dict)
    infeasibility_reason: str | None = None


@dataclass(frozen=True)
class OptimizationResult:
    status: str
    material_id: str
    plant_id: str
    priority: str
    required_quantity: int
    total_allocated: int
    total_cost: float
    objective_value: float
    objective_bound: float | None
    solve_time_seconds: float
    allocation: list[AllocationLine] = field(default_factory=list)
    kpis: OptimizationKpis = OptimizationKpis()
    diagnostics: OptimizationDiagnostics = OptimizationDiagnostics()
    message: str = ""
    model_version: str = "p4-cpsat-v2"
    solver_name: str = "OR-Tools CP-SAT"

    @property
    def is_success(self) -> bool:
        return self.status in {"OPTIMAL", "FEASIBLE"}

    @property
    def is_feasible(self) -> bool:
        """Backward-compatible feasibility flag for existing team callers/tests."""
        return self.status in {"OPTIMAL", "FEASIBLE"}

    @property
    def is_optimal(self) -> bool:
        return self.status == "OPTIMAL"
