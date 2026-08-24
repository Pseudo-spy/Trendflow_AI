from __future__ import annotations

from datetime import date, timedelta
from time import perf_counter

from ortools.sat.python import cp_model

from .config import OptimizationConfig
from .constraints import filter_feasible_suppliers, validate_capacity_and_moq, add_allocation_constraints
from .objective import build_objective_terms
from .schemas import (
    AllocationLine,
    AllocationRequest,
    OptimizationDiagnostics,
    OptimizationKpis,
    OptimizationResult,
    SupplierDiagnostic,
    SupplierOption,
)


class SupplierAllocationOptimizer:
    """P4 PR1 supplier allocator using OR-Tools CP-SAT."""

    MODEL_VERSION = "p4-cpsat-v2"

    def __init__(self, config: OptimizationConfig | None = None) -> None:
        self.config = config or OptimizationConfig()

    def optimize(
        self,
        request: AllocationRequest,
        suppliers: list[SupplierOption],
        current_date: date | None = None,
    ) -> OptimizationResult:
        current_date = current_date or self.config.today or date.today()
        options = [s for s in suppliers if s.material_id == request.material_id]
        if not options:
            return self._failure(request, "NO_SUPPLIERS", "No supplier options found for the requested material.")

        feasibility = filter_feasible_suppliers(options, request, current_date, self.config)
        diagnostics = OptimizationDiagnostics(
            excluded_suppliers=[SupplierDiagnostic(supplier_id=s.supplier_id, reason=reason) for s, reason in feasibility.excluded]
        )
        if not feasibility.feasible:
            return self._failure(request, "INFEASIBLE", "No supplier passed the configured hard constraints.", diagnostics)

        capacity_ok, reason = validate_capacity_and_moq(feasibility.feasible, request.required_quantity)
        if not capacity_ok and not self.config.allow_partial_coverage:
            return self._failure(request, "INFEASIBLE", reason or "Insufficient feasible capacity.", diagnostics)

        terms = build_objective_terms(feasibility.feasible, self.config.weights)
        objective_breakdown = {sid: term.breakdown for sid, term in terms.items()}
        diagnostics = OptimizationDiagnostics(
            excluded_suppliers=diagnostics.excluded_suppliers,
            objective_breakdown=objective_breakdown,
        )

        model = cp_model.CpModel()
        allocation_vars = {
            s.supplier_id: model.NewIntVar(0, s.effective_max_allocation, f"qty_{s.supplier_id}")
            for s in feasibility.feasible
        }
        active_vars = {
            s.supplier_id: model.NewBoolVar(f"active_{s.supplier_id}")
            for s in feasibility.feasible
        }
        add_allocation_constraints(model, allocation_vars, active_vars, feasibility.feasible, request, self.config)

        scale = self.config.objective_scale
        model.Minimize(
            sum(
                int(round(terms[s.supplier_id].score * scale)) * allocation_vars[s.supplier_id]
                for s in feasibility.feasible
            )
        )

        solver = cp_model.CpSolver()
        solver.parameters.max_time_in_seconds = self.config.solver_time_limit_seconds
        solver.parameters.num_search_workers = self.config.num_search_workers
        solver.parameters.random_seed = self.config.random_seed
        solver.parameters.log_search_progress = False

        started = perf_counter()
        status_code = solver.Solve(model)
        elapsed = perf_counter() - started
        status = solver.StatusName(status_code)

        if status_code not in (cp_model.OPTIMAL, cp_model.FEASIBLE):
            return OptimizationResult(
                status=status,
                material_id=request.material_id,
                plant_id=request.plant_id,
                priority=request.priority.upper(),
                required_quantity=request.required_quantity,
                total_allocated=0,
                total_cost=0.0,
                objective_value=float(solver.ObjectiveValue()),
                objective_bound=float(solver.BestObjectiveBound()),
                solve_time_seconds=round(elapsed, 6),
                allocation=[],
                kpis=OptimizationKpis(),
                diagnostics=diagnostics,
                message="No feasible allocation found under the current constraints.",
                model_version=self.MODEL_VERSION,
            )

        allocation: list[AllocationLine] = []
        for supplier in feasibility.feasible:
            qty = int(solver.Value(allocation_vars[supplier.supplier_id]))
            if qty <= 0:
                continue
            allocation.append(
                AllocationLine(
                    supplier_id=supplier.supplier_id,
                    supplier_name=supplier.supplier_name,
                    material_id=supplier.material_id,
                    quantity=qty,
                    percentage=round(100.0 * qty / request.required_quantity, 4),
                    unit_price=supplier.unit_price,
                    total_cost=round(qty * supplier.unit_price, 2),
                    risk_score=round(supplier.risk_score, 6),
                    risk_level=supplier.risk_level,
                    delivery_risk=round(supplier.delivery_risk, 6),
                    quality_risk=round(supplier.quality_risk, 6),
                    quality_score=supplier.quality_score,
                    otd_score=supplier.otd_score,
                    lead_time_days=supplier.lead_time_days,
                    expected_delivery_date=current_date + timedelta(days=supplier.lead_time_days),
                )
            )

        total_allocated = sum(line.quantity for line in allocation)
        total_cost = sum(line.total_cost for line in allocation)
        kpis = self._compute_kpis(feasibility.feasible, allocation, total_allocated, total_cost)
        message = (
            "Optimization completed successfully."
            if status_code == cp_model.OPTIMAL
            else "A feasible allocation was found within the time limit; optimality was not proven."
        )
        return OptimizationResult(
            status=status,
            material_id=request.material_id,
            plant_id=request.plant_id,
            priority=request.priority.upper(),
            required_quantity=request.required_quantity,
            total_allocated=total_allocated,
            total_cost=round(total_cost, 2),
            objective_value=float(solver.ObjectiveValue()) / scale,
            objective_bound=float(solver.BestObjectiveBound()) / scale,
            solve_time_seconds=round(elapsed, 6),
            allocation=allocation,
            kpis=kpis,
            diagnostics=diagnostics,
            message=message,
            model_version=self.MODEL_VERSION,
        )

    @staticmethod
    def _compute_kpis(
        feasible: list[SupplierOption],
        allocation: list[AllocationLine],
        total_allocated: int,
        total_cost: float,
    ) -> OptimizationKpis:
        if total_allocated <= 0:
            return OptimizationKpis()
        weighted = lambda attr: sum(getattr(line, attr) * line.quantity for line in allocation) / total_allocated
        hhi = sum((line.quantity / total_allocated) ** 2 for line in allocation)
        cheapest = min(s.unit_price for s in feasible)
        avg_cost = total_cost / total_allocated
        high_risk_share = sum(line.quantity for line in allocation if line.risk_level == "HIGH") / total_allocated
        return OptimizationKpis(
            avg_unit_cost=round(avg_cost, 4),
            weighted_avg_risk_score=round(weighted("risk_score"), 6),
            weighted_delivery_risk=round(weighted("delivery_risk"), 6),
            weighted_quality_risk=round(weighted("quality_risk"), 6),
            weighted_lead_time_days=round(weighted("lead_time_days"), 4),
            weighted_quality_score=round(weighted("quality_score"), 4),
            weighted_otd_score=round(weighted("otd_score"), 4),
            suppliers_used=len(allocation),
            allocation_concentration_hhi=round(hhi, 6),
            cheapest_available_price=round(cheapest, 4),
            premium_over_cheapest_pct=round(100.0 * (avg_cost - cheapest) / cheapest, 4) if cheapest else 0.0,
            high_risk_share=round(high_risk_share, 6),
        )

    @staticmethod
    def _failure(
        request: AllocationRequest,
        status: str,
        message: str,
        diagnostics: OptimizationDiagnostics | None = None,
    ) -> OptimizationResult:
        return OptimizationResult(
            status=status,
            material_id=request.material_id,
            plant_id=request.plant_id,
            priority=request.priority.upper(),
            required_quantity=request.required_quantity,
            total_allocated=0,
            total_cost=0.0,
            objective_value=0.0,
            objective_bound=None,
            solve_time_seconds=0.0,
            allocation=[],
            kpis=OptimizationKpis(),
            diagnostics=diagnostics or OptimizationDiagnostics(infeasibility_reason=message),
            message=message,
            model_version=SupplierAllocationOptimizer.MODEL_VERSION,
        )


def optimize_allocation(
    request: AllocationRequest,
    suppliers: list[SupplierOption],
    config: OptimizationConfig | None = None,
) -> OptimizationResult:
    """Functional entry point for P1/backend callers."""
    return SupplierAllocationOptimizer(config).optimize(request, suppliers)
