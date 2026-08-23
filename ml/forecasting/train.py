"""
train.py
Train a simple Moving Average baseline demand forecasting model.

Day-1 scope only: baseline model, no XGBoost/LSTM/Prophet,
no feature engineering, no inventory/capacity logic.
"""

import os
import joblib
import pandas as pd

DEFAULT_WINDOW = 4  # number of most recent periods to average per SKU

# Path to this script's folder, so data/model paths work no matter
# which directory you run the script FROM.
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
DEFAULT_DATA_PATH = os.path.join(SCRIPT_DIR, "..", "..", "data", "sample", "demand_history.csv")
DEFAULT_MODEL_PATH = os.path.join(SCRIPT_DIR, "artifacts", "forecasting_model.pkl")


def load_demand_data(path: str) -> pd.DataFrame:
    """
    Load historical demand data from CSV.
    Expected columns: sku, demand_date, quantity_sold
    (matches database/schema.sql -> demand_history table)
    """
    return pd.read_csv(path, parse_dates=["demand_date"])


def prepare_demand_data(df: pd.DataFrame) -> pd.DataFrame:
    """
    Clean and sort demand data per SKU, ready for baseline training.
    """
    df = df.dropna(subset=["sku", "demand_date", "quantity_sold"])
    df = df.sort_values(["sku", "demand_date"]).reset_index(drop=True)
    return df


def train_model(df: pd.DataFrame, window: int = DEFAULT_WINDOW) -> dict:
    """
    Train a per-SKU Moving Average baseline.

    The "model" is the average of the last `window` demand values
    per SKU. This keeps Day-1 simple and can be swapped for a real
    scikit-learn estimator later without changing predict.py's
    interface.
    """
    model = {"window": window, "sku_baseline": {}}

    for sku, group in df.groupby("sku"):
        recent = group.tail(window)["quantity_sold"]
        model["sku_baseline"][sku] = float(recent.mean())

    return model


def save_model(model: dict, path: str = DEFAULT_MODEL_PATH) -> None:
    """
    Persist the trained baseline to disk so predict.py can load it.
    """
    os.makedirs(os.path.dirname(path) or ".", exist_ok=True)
    joblib.dump(model, path)
    print(f"Model saved to {path}")


if __name__ == "__main__":
    raw = load_demand_data(DEFAULT_DATA_PATH)
    clean = prepare_demand_data(raw)
    model = train_model(clean)
    save_model(model)