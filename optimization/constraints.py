from __future__ import annotations

from datetime import date

from ortools.sat.python import cp_model

from .schemas import AllocationRequest, SupplierMaterial


def add_supplier_constraints(
    model: cp_model.CpModel,
    allocation_vars: dict[str, cp_model.IntVar],
    used_vars: dict[str, cp_model.IntVar],
    suppliers: list[SupplierMaterial],
    request: AllocationRequest,
    current_date: date,
    enforce_delivery_deadline: bool,
) -> None:
    for supplier in suppliers:
        x = allocation_vars[supplier.supplier_id]
        used = used_vars[supplier.supplier_id]

        effective_max = supplier.capacity
        if supplier.max_allocation is not None:
            effective_max = min(effective_max, supplier.max_allocation)

        model.add(x <= effective_max * used)
        model.add(x >= supplier.min_allocation * used)

        days_available = max(0, (request.required_date - current_date).days)
        if enforce_delivery_deadline and supplier.lead_time_days > days_available:
            model.add(x == 0)


def add_total_quantity_constraint(
    model: cp_model.CpModel,
    allocation_vars: dict[str, cp_model.IntVar],
    required_quantity: int,
) -> None:
    model.add(sum(allocation_vars.values()) == required_quantity)
