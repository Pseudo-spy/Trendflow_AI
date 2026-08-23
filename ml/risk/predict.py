from __future__ import annotations

import argparse
from pathlib import Path

import pandas as pd

from .model import load_model
from .schemas import RISK_FEATURES, RiskThresholds


def risk_label(probability: float, thresholds: RiskThresholds | None = None) -> str:
    thresholds = thresholds or RiskThresholds()
    thresholds.validate()
    if probability >= thresholds.high:
        return "HIGH"
    if probability >= thresholds.medium:
        return "MEDIUM"
    return "LOW"


def predict_risk(model_path: str | Path, feature_df: pd.DataFrame) -> pd.DataFrame:
    missing = set(RISK_FEATURES) - set(feature_df.columns)
    if missing:
        raise ValueError(f"Missing risk features: {sorted(missing)}")
    model = load_model(model_path)
    probabilities = model.predict_proba(feature_df[list(RISK_FEATURES)])[:, 1]
    result = feature_df.copy()
    result["delay_probability"] = probabilities
    result["risk_level"] = [risk_label(float(p)) for p in probabilities]
    return result


def main() -> None:
    parser = argparse.ArgumentParser(description="Predict supplier risk")
    parser.add_argument("--model", default="models/supplier_risk.joblib")
    parser.add_argument("--input", required=True)
    parser.add_argument("--output", default="reports/risk_predictions.csv")
    args = parser.parse_args()

    df = pd.read_csv(args.input)
    result = predict_risk(args.model, df)
    Path(args.output).parent.mkdir(parents=True, exist_ok=True)
    result.to_csv(args.output, index=False)
    print(result.to_string(index=False))


if __name__ == "__main__":
    main()
