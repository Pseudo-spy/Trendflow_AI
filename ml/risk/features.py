from __future__ import annotations
from pathlib import Path
from typing import Iterable
import pandas as pd

PERFORMANCE_FEATURES = [
    "on_time_delivery_rate",
    "average_delay_days",
    "delay_std_days",
    "quality_score",
    "disruption_count_90d",
    "lead_time_days",
    "recent_otd_trend",
]
CONTRACT_FEATURES = []
ALL_FEATURES = PERFORMANCE_FEATURES + CONTRACT_FEATURES

def _require_columns(df: pd.DataFrame, columns: Iterable[str], name: str) -> None:
    missing = [c for c in columns if c not in df.columns]
    if missing:
        raise ValueError(f"{name} is missing required columns: {missing}")

def load_performance_csv(path: str | Path) -> pd.DataFrame:
    df = pd.read_csv(path, parse_dates=["observation_date"])
    _require_columns(df, ["supplier_id", "observation_date", *PERFORMANCE_FEATURES, "delay_flag"], "performance CSV")
    if df.empty:
        raise ValueError("performance CSV is empty")
    return df

def load_contracts_csv(path: str | Path) -> pd.DataFrame:
    df = pd.read_csv(path)
    _require_columns(df, ["supplier_id", *CONTRACT_FEATURES], "contract CSV")
    if df["supplier_id"].duplicated().any():
        raise ValueError("contract CSV must contain one active contract record per supplier")
    return df

def merge_performance_and_contracts(performance: pd.DataFrame, contracts: pd.DataFrame) -> pd.DataFrame:
    if contracts is None or contracts.empty:
        return performance.copy()

    merged = performance.merge(
        contracts,
        on="supplier_id",
        how="left",
        validate="many_to_one",
    )

    # Fill any suppliers missing a contract record so downstream logic sees
    # a consistent, non-null contract state.
    if "contract_active" in merged.columns:
        merged["contract_active"] = (
            merged["contract_active"].fillna(0).astype(int)
        )

    return merged

def clean_features(df: pd.DataFrame) -> pd.DataFrame:
    out = df.copy()
    for col in ALL_FEATURES:
        out[col] = pd.to_numeric(out[col], errors="coerce")
    if out[ALL_FEATURES].isna().any().any():
        bad = out[ALL_FEATURES].isna().sum()
        bad = bad[bad > 0].to_dict()
        raise ValueError(f"Feature data contains missing/non-numeric values: {bad}")
    return out

def make_quality_risk_flag(df: pd.DataFrame, threshold: float = 90.0) -> pd.Series:
    return (df["quality_score"] < threshold).astype(int)

def latest_supplier_snapshot(df: pd.DataFrame) -> pd.DataFrame:
    ordered = df.sort_values(["supplier_id", "observation_date"])
    return ordered.groupby("supplier_id", as_index=False).tail(1).copy()
