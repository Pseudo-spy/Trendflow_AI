from __future__ import annotations

from datetime import date
from typing import Dict, List

from .schemas import OptimizationWeights, SupplierMaterial


def _normalise(value: float, minimum: float, maximum: float) -> float:
    if maximum <= minimum:
        return 0.0
    return (value - minimum) / (maximum - minimum)


def build_unit_penalties(
    suppliers: List[SupplierMaterial],
    required_date: date,
    current_date: date,
    weights: OptimizationWeights,
    scale: int,
) -> Dict[str, int]:
    weights.validate()
    if not suppliers:
        return {}

    prices = [s.unit_price for s in suppliers]
    lead_times = [s.lead_time_days for s in suppliers]
    max_price = max(prices)
    min_price = min(prices)
    max_lead = max(lead_times)
    min_lead = min(lead_times)
    days_available = max(0, (required_date - current_date).days)
    penalties: Dict[str, int] = {}

    for s in suppliers:
        cost_penalty = _normalise(s.unit_price, min_price, max_price)
        late_days = max(0, s.lead_time_days - days_available)
        delay_penalty = late_days / max(1, max_lead)
        quality_penalty = 1.0 - (s.quality_score / 100.0)
        otd_penalty = 1.0 - (s.otd_score / 100.0)
        lead_penalty = _normalise(s.lead_time_days, min_lead, max_lead)

        score = (
            weights.cost * cost_penalty
            + weights.delay * (delay_penalty + 0.25 * lead_penalty)
            + weights.risk * s.risk_score
            + weights.quality * quality_penalty
            + weights.otd * otd_penalty
        )
        # Adding a tiny price tie-breaker helps make equal-score solutions stable.
        score += 1e-6 * s.unit_price
        penalties[s.supplier_id] = max(0, int(round(score * scale)))
    return penalties
