from __future__ import annotations

from datetime import date, datetime, timedelta
from typing import Iterable, Sequence

from ortools.sat.python import cp_model

from .config import OptimizerConfig
from .constraints import add_supplier_constraints, add_total_quantity_constraint
from .objective import build_unit_penalties
from .schemas import AllocationLine, AllocationRequest, OptimizationResult, SupplierMaterial


class SupplierAllocationOptimizer:
    """Constraint-aware PR1 procurement allocator built on OR-Tools CP-SAT."""

    def __init__(self, config: OptimizerConfig | None = None) -> None:
        self.config = config or OptimizerConfig()
        self.config.validate()

    @staticmethod
    def _validate_supplier_set(suppliers: Sequence[SupplierMaterial], request: AllocationRequest) -> None:
        if not suppliers:
            raise ValueError("At least one supplier is required")
        relevant = [s for s in suppliers if s.material_id == request.material_id]
        if not relevant:
            raise ValueError(f"No suppliers available for material {request.material_id}")
        ids = [s.supplier_id for s in relevant]
        if len(ids) != len(set(ids)):
            raise ValueError("Duplicate supplier_id values are not allowed")
        usable_capacity = 0
        for s in relevant:
            max_alloc = s.capacity if s.max_allocation is None else min(s.capacity, s.max_allocation)
            usable_capacity += max_alloc
        if usable_capacity < request.required_quantity:
            raise ValueError(
                f"Insufficient supplier capacity: required={request.required_quantity}, available={usable_capacity}"
            )

    def optimize(
        self,
        request: AllocationRequest,
        suppliers: Sequence[SupplierMaterial],
        current_date: date | None = None,
    ) -> OptimizationResult:
        current_date = current_date or date.today()
        relevant = [s for s in suppliers if s.material_id == request.material_id]
        self._validate_supplier_set(relevant, request)

        model = cp_model.CpModel()
        allocation_vars = {
            s.supplier_id: model.new_int_var(0, max(s.capacity, s.max_allocation or 0), f"alloc_{s.supplier_id}")
            for s in relevant
        }
        used_vars = {
            s.supplier_id: model.new_bool_var(f"used_{s.supplier_id}")
            for s in relevant
        }

        add_supplier_constraints(
            model=model,
            allocation_vars=allocation_vars,
            used_vars=used_vars,
            suppliers=list(relevant),
            request=request,
            current_date=current_date,
            enforce_delivery_deadline=self.config.enforce_delivery_deadline,
        )
        add_total_quantity_constraint(model, allocation_vars, request.required_quantity)

        penalties = build_unit_penalties(
            suppliers=list(relevant),
            required_date=request.required_date,
            current_date=current_date,
            weights=self.config.weights,
            scale=self.config.objective_scale,
        )
        model.minimize(sum(penalties[s.supplier_id] * allocation_vars[s.supplier_id] for s in relevant))

        solver = cp_model.CpSolver()
        solver.parameters.max_time_in_seconds = self.config.max_solver_time_seconds
        solver.parameters.num_search_workers = self.config.num_workers
        solver.parameters.random_seed = 42

        started = datetime.now()
        status_code = solver.solve(model)
        elapsed = (datetime.now() - started).total_seconds()
        status_name = solver.status_name(status_code)

        if status_code not in (cp_model.OPTIMAL, cp_model.FEASIBLE):
            return OptimizationResult(
                status=status_name,
                material_id=request.material_id,
                required_quantity=request.required_quantity,
                total_allocated=0,
                total_cost=0.0,
                objective_value=0.0,
                objective_bound=0.0,
                solve_time_seconds=elapsed,
                message="No feasible allocation found for the supplied constraints.",
            )

        total_allocated = sum(int(solver.value(v)) for v in allocation_vars.values())
        lines: list[AllocationLine] = []
        total_cost = 0.0
        for s in relevant:
            qty = int(solver.value(allocation_vars[s.supplier_id]))
            if qty <= 0:
                continue
            line_cost = qty * s.unit_price
            total_cost += line_cost
            delivery = current_date + timedelta(days=s.lead_time_days)
            lines.append(
                AllocationLine(
                    supplier_id=s.supplier_id,
                    material_id=s.material_id,
                    quantity=qty,
                    percentage=(qty / request.required_quantity) * 100.0,
                    unit_price=s.unit_price,
                    total_cost=line_cost,
                    risk_score=s.risk_score,
                    quality_score=s.quality_score,
                    otd_score=s.otd_score,
                    lead_time_days=s.lead_time_days,
                    expected_delivery_date=delivery,
                )
            )

        return OptimizationResult(
            status=status_name,
            material_id=request.material_id,
            required_quantity=request.required_quantity,
            total_allocated=total_allocated,
            total_cost=total_cost,
            objective_value=float(solver.objective_value),
            objective_bound=float(solver.best_objective_bound),
            solve_time_seconds=elapsed,
            allocation=sorted(lines, key=lambda x: (-x.quantity, x.supplier_id)),
            message="Optimization completed successfully.",
        )


if __name__ == "__main__":
    from pathlib import Path
    from .loader import load_supplier_materials

    root = Path(__file__).resolve().parents[1]
    supplier_csv = root / "data" / "sample" / "supplier_materials.csv"
    suppliers_csv = root / "data" / "sample" / "suppliers.csv"
    suppliers = load_supplier_materials(supplier_csv, suppliers_csv)
    request = AllocationRequest(
        material_id="MAT001",
        required_quantity=30_000,
        required_date=date(2026, 10, 15),
        plant_id="PLANT001",
        priority="HIGH",
    )
    result = SupplierAllocationOptimizer().optimize(request, suppliers, current_date=date(2026, 8, 23))
    print(result)
