from __future__ import annotations

from pathlib import Path

import pandas as pd

from .schemas import RISK_FEATURES

REQUIRED_COLUMNS = set(RISK_FEATURES) | {"supplier_id", "observation_date", "delay_flag"}


def load_performance_data(path: str | Path) -> pd.DataFrame:
    path = Path(path)
    if not path.exists():
        raise FileNotFoundError(path)
    df = pd.read_csv(path)
    missing = REQUIRED_COLUMNS - set(df.columns)
    if missing:
        raise ValueError(f"Missing columns in risk dataset: {sorted(missing)}")
    df["observation_date"] = pd.to_datetime(df["observation_date"], errors="coerce")
    if df["observation_date"].isna().any():
        raise ValueError("Invalid observation_date values found")
    for col in RISK_FEATURES:
        df[col] = pd.to_numeric(df[col], errors="coerce")
    if df[list(RISK_FEATURES)].isna().any().any():
        raise ValueError("Missing/non-numeric risk feature values found")
    df["delay_flag"] = pd.to_numeric(df["delay_flag"], errors="raise").astype(int)
    if not df["delay_flag"].isin([0, 1]).all():
        raise ValueError("delay_flag must be 0 or 1")
    return df.sort_values("observation_date").reset_index(drop=True)


def time_split(df: pd.DataFrame, test_ratio: float = 0.2) -> tuple[pd.DataFrame, pd.DataFrame]:
    if not 0 < test_ratio < 0.5:
        raise ValueError("test_ratio must be between 0 and 0.5")
    cut = max(1, int(len(df) * (1 - test_ratio)))
    train = df.iloc[:cut].copy()
    test = df.iloc[cut:].copy()
    if train.empty or test.empty:
        raise ValueError("Not enough rows for a time-based split")
    return train, test
