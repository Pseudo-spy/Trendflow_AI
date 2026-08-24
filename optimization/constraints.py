from __future__ import annotations

from dataclasses import dataclass
from datetime import date, timedelta

from ortools.sat.python import cp_model

from .config import OptimizationConfig
from .schemas import AllocationRequest, SupplierOption


@dataclass(frozen=True)
class FeasibilityResult:
    feasible: list[SupplierOption]
    excluded: list[tuple[SupplierOption, str]]


def supplier_deadline(option: SupplierOption, current_date: date) -> date:
    return current_date + timedelta(days=option.contract_lead_time_days)


def filter_feasible_suppliers(
    suppliers: list[SupplierOption],
    request: AllocationRequest,
    current_date: date,
    config: OptimizationConfig,
) -> FeasibilityResult:
    feasible: list[SupplierOption] = []
    excluded: list[tuple[SupplierOption, str]] = []

    for supplier in suppliers:
        if config.enforce_approved_supplier and (not supplier.approved or not supplier.contract_active):
            excluded.append((supplier, "supplier is not approved/contract is inactive"))
            continue
        if config.enforce_required_date and supplier_deadline(supplier, current_date) > request.required_date:
            excluded.append((supplier, "contract/lead-time deadline misses required_date"))
            continue
        if config.enforce_contract_otd and supplier.contract_otd_target is not None:
            if supplier.otd_score / 100.0 + 1e-9 < supplier.contract_otd_target:
                excluded.append((supplier, "historical OTD is below the contractual OTD target"))
                continue
        if config.enforce_contract_quality and supplier.contract_quality_target is not None:
            if supplier.quality_score + 1e-9 < supplier.contract_quality_target:
                excluded.append((supplier, "historical quality is below the contractual quality target"))
                continue
        if supplier.effective_max_allocation <= 0:
            excluded.append((supplier, "effective maximum allocation is zero"))
            continue
        feasible.append(supplier)

    return FeasibilityResult(feasible=feasible, excluded=excluded)


def validate_capacity_and_moq(
    suppliers: list[SupplierOption], required_quantity: int
) -> tuple[bool, str | None]:
    total_upper = sum(s.effective_max_allocation for s in suppliers)
    if total_upper < required_quantity:
        return False, f"feasible suppliers can cover only {total_upper} of {required_quantity} units"

    total_moq = sum(s.min_allocation for s in suppliers)
    if total_moq > required_quantity:
        # This lower bound is conservative: not every supplier has to be activated.
        # It is only a warning-level check, so do not declare infeasible here.
        pass
    return True, None


def add_allocation_constraints(
    model: cp_model.CpModel,
    allocation_vars: dict[str, cp_model.IntVar],
    active_vars: dict[str, cp_model.IntVar],
    options: list[SupplierOption],
    request: AllocationRequest,
    config: OptimizationConfig,
) -> None:
    for option in options:
        x = allocation_vars[option.supplier_id]
        y = active_vars[option.supplier_id]
        upper = option.effective_max_allocation
        lower = option.min_allocation
        model.Add(x <= upper * y)
        model.Add(x >= lower * y)

    total = sum(allocation_vars.values())
    if config.require_full_allocation and not config.allow_partial_coverage:
        model.Add(total == request.required_quantity)
    else:
        model.Add(total <= request.required_quantity)

    if config.max_suppliers is not None:
        model.Add(sum(active_vars.values()) <= config.max_suppliers)

    high_risk = sum(
        allocation_vars[o.supplier_id]
        for o in options
        if o.risk_level == "HIGH"
    )
    cap = int(round(request.required_quantity * config.high_risk_allocation_cap))
    model.Add(high_risk <= cap)

    # Contract-approved supplier hard rule is encoded by filtering, but we also keep
    # a defensive assertion here so future callers cannot accidentally bypass it.
    for option in options:
        if config.enforce_approved_supplier and (not option.approved or not option.contract_active):
            model.Add(allocation_vars[option.supplier_id] == 0)
