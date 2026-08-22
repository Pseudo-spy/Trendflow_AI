"""
predict.py
Generate demand forecasts from the trained Moving Average baseline.
"""
 
import joblib
import pandas as pd
 
 
def load_model(path: str = "artifacts/forecasting_model.pkl") -> dict:
    """
    Load the trained baseline model saved by train.py.
    """
    return joblib.load(path)
 
 
def generate_forecast(model: dict, skus: list, periods: int = 1) -> pd.DataFrame:
    """
    Generate a flat forecast for each SKU using the moving average
    baseline. Day-1 baseline repeats the average across `periods`;
    it does not yet account for trend or seasonality.
    """
    rows = []
    for sku in skus:
        baseline = model["sku_baseline"].get(sku)
        if baseline is None:
            continue
        for period in range(1, periods + 1):
            rows.append({
                "sku": sku,
                "period": period,
                "forecast_quantity": round(baseline, 2),
            })
 
    return pd.DataFrame(rows)
 
 
if __name__ == "__main__":
    model = load_model()
    skus = list(model["sku_baseline"].keys())
    forecast_df = generate_forecast(model, skus, periods=1)
    print(forecast_df)
    forecast_df.to_csv("artifacts/forecast_output.csv", index=False)
 