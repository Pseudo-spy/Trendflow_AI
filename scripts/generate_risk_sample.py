from __future__ import annotations

from pathlib import Path

import numpy as np
import pandas as pd


def generate(path: str = "data/sample/supplier_performance.csv", rows_per_supplier: int = 100) -> None:
    rng = np.random.default_rng(42)
    suppliers = {
        "SUP001": {"otd": 94, "quality": 95, "lead": 12, "risk": 0.15},
        "SUP002": {"otd": 82, "quality": 88, "lead": 20, "risk": 0.45},
        "SUP003": {"otd": 76, "quality": 80, "lead": 30, "risk": 0.80},
        "SUP004": {"otd": 96, "quality": 97, "lead": 10, "risk": 0.10},
        "SUP005": {"otd": 89, "quality": 91, "lead": 16, "risk": 0.35},
    }
    dates = pd.date_range(end="2026-08-23", periods=rows_per_supplier, freq="7D")
    rows = []
    for supplier_id, base in suppliers.items():
        for d in dates:
            otd = float(np.clip(rng.normal(base["otd"], 3.0), 55, 100))
            quality = float(np.clip(rng.normal(base["quality"], 2.5), 60, 100))
            lead = int(max(1, round(rng.normal(base["lead"], 2.0))))
            avg_delay = float(max(0, (100 - otd) / 12 + rng.normal(0.8, 0.5)))
            delay_std = float(max(0.1, avg_delay * rng.uniform(0.3, 1.0)))
            disruptions = int(rng.poisson(base["risk"] * 1.5))
            trend = float(np.clip(rng.normal((otd - 85) / 15, 0.08), -1, 1))
            logit = (
                -2.6
                + 0.07 * avg_delay
                + 0.07 * (100 - otd)
                + 0.025 * (100 - quality)
                + 0.55 * disruptions
                + 0.035 * lead
                - 0.35 * trend
                + rng.normal(0, 0.65)
            )
            probability = 1 / (1 + np.exp(-logit))
            delay_flag = int(rng.random() < probability)
            rows.append(
                {
                    "supplier_id": supplier_id,
                    "observation_date": d.date().isoformat(),
                    "on_time_delivery_rate": round(otd, 2),
                    "average_delay_days": round(avg_delay, 2),
                    "delay_std_days": round(delay_std, 2),
                    "quality_score": round(quality, 2),
                    "disruption_count_90d": disruptions,
                    "lead_time_days": lead,
                    "recent_otd_trend": round(trend, 4),
                    "delay_flag": delay_flag,
                }
            )
    out = Path(path)
    out.parent.mkdir(parents=True, exist_ok=True)
    pd.DataFrame(rows).to_csv(out, index=False)
    print(f"Generated {len(rows)} rows -> {out}")


if __name__ == "__main__":
    generate()
