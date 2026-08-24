"""
forecast.py
Direct alias for predict.py - standard interface for Demand Forecasting.
Provides `run_demand_forecast()` for FastAPI backend integration.
"""

from predict import run_demand_forecast, load_model, predict_sku_demand, MODEL_VERSION

if __name__ == "__main__":
    df = run_demand_forecast()
    print("Forecast execution completed.")
    print(df.head())

