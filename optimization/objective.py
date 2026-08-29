from __future__ import annotations

from dataclasses import dataclass

from .config import ObjectiveWeights
from .schemas import SupplierOption


@dataclass(frozen=True)
class ObjectiveTerm:
    score: float
    breakdown: dict[str, float]


def _minmax(value: float, low: float, high: float) -> float:
    if high <= low:
        return 0.0
    return (value - low) / (high - low)


def build_objective_terms(
    suppliers: list[SupplierOption], weights: ObjectiveWeights
) -> dict[str, ObjectiveTerm]:
    if not suppliers:
        raise ValueError("No suppliers available for objective construction")

    prices = [s.unit_price for s in suppliers]
    leads = [s.lead_time_days for s in suppliers]
    quality = [s.quality_score for s in suppliers]
    otd = [s.otd_score for s in suppliers]
    pmin, pmax = min(prices), max(prices)
    lmin, lmax = min(leads), max(leads)
    qmin, qmax = min(quality), max(quality)
    omin, omax = min(otd), max(otd)
    w = weights.normalized

    terms: dict[str, ObjectiveTerm] = {}
    for supplier in suppliers:
        cost_component = _minmax(supplier.unit_price, pmin, pmax)
        risk_component = supplier.risk_score
        delivery_component = supplier.delivery_risk
        lead_component = _minmax(supplier.lead_time_days, lmin, lmax)
        quality_component = 1.0 - _minmax(supplier.quality_score, qmin, qmax)
        otd_component = 1.0 - _minmax(supplier.otd_score, omin, omax)
        contract_penalty = 0.0

        score = (
            w.cost * cost_component
            + w.supplier_risk * risk_component
            + w.delivery_risk * delivery_component
            + w.lead_time * lead_component
            + w.quality * quality_component
            + w.otd * otd_component
            + contract_penalty
        )
        terms[supplier.supplier_id] = ObjectiveTerm(
            score=score,
            breakdown={
                "base_price": supplier.unit_price,
                "cost_component": cost_component,
                "risk_component": risk_component,
                "delivery_risk_component": delivery_component,
                "lead_time_component": lead_component,
                "quality_penalty_component": quality_component,
                "otd_penalty_component": otd_component,
                "contract_penalty_component": contract_penalty,
                "effective_objective_score": score,
            },
        )
    return terms


def estimate_fallback_risk(supplier: SupplierOption) -> float:
    """Transparent fallback if a caller constructs a supplier without ML risk."""
    return max(0.0, min(1.0, 1.0 - supplier.otd_score / 100.0))
