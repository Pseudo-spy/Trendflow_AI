from __future__ import annotations

from dataclasses import dataclass
from typing import Sequence

RISK_FEATURES: tuple[str, ...] = (
    "on_time_delivery_rate",
    "average_delay_days",
    "delay_std_days",
    "quality_score",
    "disruption_count_90d",
    "lead_time_days",
    "recent_otd_trend",
)


@dataclass(frozen=True)
class RiskThresholds:
    medium: float = 0.33
    high: float = 0.67

    def validate(self) -> None:
        if not 0 <= self.medium < self.high <= 1:
            raise ValueError("Thresholds must satisfy 0 <= medium < high <= 1")
