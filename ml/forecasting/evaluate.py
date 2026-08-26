"""
evaluate.py
Evaluation module for Demand Forecasting.
Calculates:
- Mean Absolute Error (MAE)
- Root Mean Squared Error (RMSE)
- Mean Absolute Percentage Error (MAPE)
- Category-level and Season-level error breakdowns
"""

import os
import joblib
import numpy as np
import pandas as pd
from sklearn.metrics import mean_absolute_error, mean_squared_error

from supabase_client import fetch_demand_history, fetch_products
from train import build_features, DEFAULT_MODEL_PATH


def calculate_mae(actual: pd.Series, predicted: pd.Series) -> float:
    return float(mean_absolute_error(actual, predicted))


def calculate_rmse(actual: pd.Series, predicted: pd.Series) -> float:
    return float(np.sqrt(mean_squared_error(actual, predicted)))


def calculate_mape(actual: pd.Series, predicted: pd.Series) -> float:
    y_true = np.array(actual, dtype=float)
    y_pred = np.array(predicted, dtype=float)
    # Avoid zero division
    mask = y_true > 0
    if not np.any(mask):
        return 0.0
    return float(np.mean(np.abs((y_true[mask] - y_pred[mask]) / y_true[mask])) * 100)


def evaluate_model_on_holdout(model_path: str = DEFAULT_MODEL_PATH) -> dict:
    """
    Evaluates the trained model against the latest 2 months of Supabase demand history.
    """
    from predict import load_model
    model_bundle = load_model(model_path)

    model = model_bundle["model"]
    feature_cols = model_bundle["feature_cols"]
    cat_to_code = model_bundle["cat_to_code"]
    season_to_code = model_bundle["season_to_code"]

    df_demand = fetch_demand_history()
    df_products = fetch_products()
    df_features = build_features(df_demand, df_products)

    # Use holdout set (last 2 months)
    max_date = df_features["demand_date"].max()
    cutoff_date = max_date - pd.DateOffset(months=2)
    holdout = df_features[df_features["demand_date"] >= cutoff_date].copy()

    if holdout.empty:
        holdout = df_features.tail(200).copy()

    holdout["cat_code"] = holdout["category"].map(lambda x: cat_to_code.get(x, 0))
    holdout["season_code"] = holdout["season"].map(lambda x: season_to_code.get(x, 0))

    X_test = holdout[feature_cols]
    y_true = holdout["quantity_sold"]
    y_pred = np.maximum(0, model.predict(X_test))

    holdout["predicted_quantity"] = y_pred

    overall_mae = calculate_mae(y_true, y_pred)
    overall_rmse = calculate_rmse(y_true, y_pred)
    overall_mape = calculate_mape(y_true, y_pred)

    print("==================================================")
    print("      TRENDWEAR AI DEMAND FORECAST EVALUATION     ")
    print("==================================================")
    print(f"Holdout Records Evaluated: {len(holdout)}")
    print(f"Overall MAE:               {overall_mae:.2f} units")
    print(f"Overall RMSE:              {overall_rmse:.2f} units")
    print(f"Overall MAPE:              {overall_mape:.2f} %")
    print("--------------------------------------------------")
    print("\n--- Error Breakdown by Product Category ---")
    cat_rows = []
    for cat, group in holdout.groupby("category"):
        c_mae = calculate_mae(group["quantity_sold"], group["predicted_quantity"])
        c_mape = calculate_mape(group["quantity_sold"], group["predicted_quantity"])
        cat_rows.append({"Category": cat, "Count": len(group), "MAE": round(c_mae, 1), "MAPE (%)": round(c_mape, 2)})
    df_cat = pd.DataFrame(cat_rows)
    print(df_cat.to_string(index=False))

    return {
        "mae": overall_mae,
        "rmse": overall_rmse,
        "mape": overall_mape,
        "category_metrics": df_cat.to_dict(orient="records"),
    }


if __name__ == "__main__":
    evaluate_model_on_holdout()

 