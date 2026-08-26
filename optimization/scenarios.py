from __future__ import annotations

from dataclasses import replace

from .schemas import SupplierOption


def supplier_disruption(
    options: list[SupplierOption],
    supplier_id: str,
    *,
    capacity_multiplier: float = 0.5,
    risk_delta: float = 0.15,
    lead_time_delta_days: int = 7,
) -> list[SupplierOption]:
    if not 0 < capacity_multiplier <= 1:
        raise ValueError("capacity_multiplier must be in (0, 1]")
    if not 0 <= risk_delta <= 1:
        raise ValueError("risk_delta must be in [0, 1]")
    if lead_time_delta_days < 0:
        raise ValueError("lead_time_delta_days must be >= 0")
    found = False
    result: list[SupplierOption] = []
    for option in options:
        if option.supplier_id != supplier_id:
            result.append(option)
            continue
        found = True
        new_capacity = int(option.capacity * capacity_multiplier)
        new_max = min(option.max_allocation, new_capacity)
        new_risk = min(1.0, option.risk_score + risk_delta)
        new_delivery = min(1.0, option.delivery_risk + risk_delta)
        level = "HIGH" if new_risk >= 0.67 else "MEDIUM" if new_risk >= 0.34 else "LOW"
        result.append(replace(option, capacity=new_capacity, max_allocation=new_max, risk_score=new_risk, delivery_risk=new_delivery, risk_level=level, lead_time_days=option.lead_time_days + lead_time_delta_days))
    if not found:
        raise KeyError(f"Unknown supplier_id: {supplier_id}")
    return result


def capacity_cut(options: list[SupplierOption], supplier_id: str, reduction: float = 0.30) -> list[SupplierOption]:
    if not 0 <= reduction < 1:
        raise ValueError("reduction must be in [0, 1)")
    return supplier_disruption(options, supplier_id, capacity_multiplier=1 - reduction, risk_delta=0.0, lead_time_delta_days=0)


def lead_time_shock(options: list[SupplierOption], supplier_id: str, extra_days: int = 10) -> list[SupplierOption]:
    return supplier_disruption(options, supplier_id, capacity_multiplier=1.0, risk_delta=0.0, lead_time_delta_days=extra_days)


def demand_spike(request, multiplier: float = 1.20):
    if multiplier <= 0:
        raise ValueError("multiplier must be > 0")
    return replace(request, required_quantity=int(round(request.required_quantity * multiplier)))
