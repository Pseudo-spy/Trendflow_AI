from __future__ import annotations

from dataclasses import dataclass

from .schemas import OptimizationWeights


@dataclass(frozen=True)
class OptimizerConfig:
    objective_scale: int = 10_000
    max_solver_time_seconds: float = 10.0
    num_workers: int = 8
    enforce_delivery_deadline: bool = False
    weights: OptimizationWeights = OptimizationWeights()

    def validate(self) -> None:
        if self.objective_scale <= 0:
            raise ValueError("objective_scale must be > 0")
        if self.max_solver_time_seconds <= 0:
            raise ValueError("max_solver_time_seconds must be > 0")
        if self.num_workers <= 0:
            raise ValueError("num_workers must be > 0")
        self.weights.validate()
