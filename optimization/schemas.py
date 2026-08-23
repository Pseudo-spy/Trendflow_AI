from __future__ import annotations

from dataclasses import dataclass, field
from datetime import date
from typing import List


@dataclass(frozen=True)
class SupplierMaterial:
    supplier_id: str
    material_id: str
    unit_price: float
    capacity: int
    lead_time_days: int
    quality_score: float
    otd_score: float
    min_allocation: int = 0
    max_allocation: int | None = None
    risk_score: float = 0.5

    def __post_init__(self) -> None:
        if not self.supplier_id or not self.material_id:
            raise ValueError("supplier_id and material_id are required")
        if self.unit_price < 0:
            raise ValueError("unit_price must be >= 0")
        if self.capacity < 0:
            raise ValueError("capacity must be >= 0")
        if self.lead_time_days < 0:
            raise ValueError("lead_time_days must be >= 0")
        if not 0 <= self.quality_score <= 100:
            raise ValueError("quality_score must be between 0 and 100")
        if not 0 <= self.otd_score <= 100:
            raise ValueError("otd_score must be between 0 and 100")
        if self.min_allocation < 0:
            raise ValueError("min_allocation must be >= 0")
        if self.max_allocation is not None and self.max_allocation < 0:
            raise ValueError("max_allocation must be >= 0")
        if self.max_allocation is not None and self.min_allocation > self.max_allocation:
            raise ValueError("min_allocation cannot exceed max_allocation")
        if not 0 <= self.risk_score <= 1:
            raise ValueError("risk_score must be between 0 and 1")


@dataclass(frozen=True)
class AllocationRequest:
    material_id: str
    required_quantity: int
    required_date: date
    plant_id: str
    priority: str = "NORMAL"

    def __post_init__(self) -> None:
        if not self.material_id:
            raise ValueError("material_id is required")
        if self.required_quantity <= 0:
            raise ValueError("required_quantity must be > 0")
        if not self.plant_id:
            raise ValueError("plant_id is required")
        if self.priority.upper() not in {"LOW", "MEDIUM", "NORMAL", "HIGH", "CRITICAL"}:
            raise ValueError("Unsupported priority")


@dataclass(frozen=True)
class OptimizationWeights:
    cost: float = 1.00
    delay: float = 1.50
    risk: float = 2.00
    quality: float = 0.50
    otd: float = 0.75

    def validate(self) -> None:
        for name, value in self.__dict__.items():
            if value < 0:
                raise ValueError(f"Weight {name} must be >= 0")
        if sum(self.__dict__.values()) <= 0:
            raise ValueError("At least one objective weight must be > 0")


@dataclass(frozen=True)
class AllocationLine:
    supplier_id: str
    material_id: str
    quantity: int
    percentage: float
    unit_price: float
    total_cost: float
    risk_score: float
    quality_score: float
    otd_score: float
    lead_time_days: int
    expected_delivery_date: date


@dataclass
class OptimizationResult:
    status: str
    material_id: str
    required_quantity: int
    total_allocated: int
    total_cost: float
    objective_value: float
    objective_bound: float
    solve_time_seconds: float
    allocation: List[AllocationLine] = field(default_factory=list)
    message: str = ""

    @property
    def is_feasible(self) -> bool:
        return self.status in {"OPTIMAL", "FEASIBLE"}
