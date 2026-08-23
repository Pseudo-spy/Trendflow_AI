"""
predict.py
Generate demand forecasts from the trained Moving Average baseline.

Output aligned with backend/app/models/schemas.py -> DemandForecastItem
(sku, forecast_date, forecast_quantity, confidence, model_version)
"""

import os
import joblib
import pandas as pd

MODEL_VERSION = "v1.0-baseline"

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
DEFAULT_MODEL_PATH = os.path.join(SCRIPT_DIR, "artifacts", "forecasting_model.pkl")
DEFAULT_OUTPUT_PATH = os.path.join(SCRIPT_DIR, "artifacts", "forecast_output.csv")


def load_model(path: str = DEFAULT_MODEL_PATH) -> dict:
    """
    Load the trained baseline model saved by train.py.
    """
    return joblib.load(path)


def generate_forecast(model: dict, skus: list, forecast_date: str) -> pd.DataFrame:
    """
    Generate a forecast for each SKU for a single target forecast_date.
    Matches the DemandForecastItem schema so backend/app/repositories/demand.py
    can eventually call this instead of returning a hardcoded value.
    """
    rows = []
    for sku in skus:
        baseline = model["sku_baseline"].get(sku)
        if baseline is None:
            continue
        rows.append({
            "sku": sku,
            "forecast_date": forecast_date,
            "forecast_quantity": int(round(baseline)),
            "confidence": None,
            "model_version": MODEL_VERSION,
        })

    return pd.DataFrame(rows)


if __name__ == "__main__":
    model = load_model()
    skus = list(model["sku_baseline"].keys())
    forecast_df = generate_forecast(model, skus, forecast_date="2026-10-01")
    print(forecast_df)
    forecast_df.to_csv(DEFAULT_OUTPUT_PATH, index=False)