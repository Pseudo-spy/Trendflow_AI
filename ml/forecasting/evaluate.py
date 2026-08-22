"""
evaluate.py
Compare actual vs predicted demand and calculate MAE, RMSE, MAPE.
"""
 
import numpy as np
import pandas as pd
from sklearn.metrics import mean_absolute_error, mean_squared_error
 
 
def calculate_mae(actual: pd.Series, predicted: pd.Series) -> float:
    return float(mean_absolute_error(actual, predicted))
 
 
def calculate_rmse(actual: pd.Series, predicted: pd.Series) -> float:
    return float(mean_squared_error(actual, predicted) ** 0.5)
 
 
def calculate_mape(actual: pd.Series, predicted: pd.Series) -> float:
    actual = np.array(actual, dtype=float)
    predicted = np.array(predicted, dtype=float)
    mask = actual != 0
    return float(np.mean(np.abs((actual[mask] - predicted[mask]) / actual[mask])) * 100)
 
 
def evaluate_forecast(
    actual_df: pd.DataFrame,
    predicted_df: pd.DataFrame,
    actual_col: str = "quantity_sold",
    predicted_col: str = "forecast_quantity",
    key: str = "sku",
) -> dict:
    """
    actual_df: columns [key, actual_col]      e.g. demand_history-style
    predicted_df: columns [key, predicted_col] e.g. predict.py output
    """
    merged = actual_df.merge(predicted_df, on=key)
    return {
        "mae": calculate_mae(merged[actual_col], merged[predicted_col]),
        "rmse": calculate_rmse(merged[actual_col], merged[predicted_col]),
        "mape": calculate_mape(merged[actual_col], merged[predicted_col]),
    }
 
 
if __name__ == "__main__":
    # Example Day-1 run — replace with real actual vs forecast data
    actual_df = pd.DataFrame({"sku": ["TW001", "TW002"], "quantity_sold": [120, 80]})
    predicted_df = pd.DataFrame({"sku": ["TW001", "TW002"], "forecast_quantity": [115, 85]})
    print(evaluate_forecast(actual_df, predicted_df))
 