"""
run_pipeline.py
Automated end-to-end execution for P2 Demand Forecasting:
1. Fetch latest demand_history and products from Supabase
2. Build tabular features (seasonality, promotions, markdowns, category, price, lag)
3. Train Random Forest model and save artifact to artifacts/forecasting_model.pkl
4. Evaluate model performance (MAE, RMSE, MAPE)
5. Generate demand forecasts for all 100 SKUs for planning horizon (e.g. 2026-10-15)
6. Push/upsert forecasts to Supabase demand_forecast table
7. Export local forecast summary to artifacts/forecast_output.csv
"""

import os
import pandas as pd

from supabase_client import fetch_demand_history, fetch_products, save_forecast_to_supabase
from train import build_features, train_forecasting_model, save_model, DEFAULT_MODEL_PATH
from predict import run_demand_forecast, DEFAULT_OUTPUT_PATH
from evaluate import calculate_mae, calculate_rmse, calculate_mape


def execute_full_pipeline(
    target_forecast_date: str = "2026-10-15",
    push_to_db: bool = True
) -> dict:
    print("\n=======================================================")
    print("      TRENDWEAR AI: P2 DEMAND FORECASTING PIPELINE     ")
    print("=======================================================\n")
    
    # Step 1: Fetch from Supabase
    print("[1/6] Fetching data from Supabase...")
    df_demand = fetch_demand_history()
    df_products = fetch_products()
    print(f"      -> Retrieved {len(df_demand)} demand rows across {df_demand['sku'].nunique()} historical SKUs.")
    print(f"      -> Retrieved {len(df_products)} total product master rows.")

    # Step 2: Feature Engineering
    print("\n[2/6] Engineering ML features (seasonality, promotions, markdowns, lag, price)...")
    df_features = build_features(df_demand, df_products)
    print(f"      -> Feature matrix constructed with {df_features.shape[1]} columns.")

    # Step 3: Model Training
    print("\n[3/6] Training Random Forest Regressor & Cold-Start Estimator...")
    model_bundle = train_forecasting_model(df_features, df_products)
    save_model(model_bundle, DEFAULT_MODEL_PATH)

    # Step 4: Model Evaluation
    metrics = model_bundle.get("metrics", {})
    print("\n[4/6] Validation Metrics Summary:")
    print(f"      -> MAE:  {metrics.get('mae', 0):.2f} units")
    print(f"      -> RMSE: {metrics.get('rmse', 0):.2f} units")
    print(f"      -> MAPE: {metrics.get('mape', 0):.2f}%")

    # Step 5: Forecast Generation
    print(f"\n[5/6] Generating forecast for all {len(df_products)} SKUs for date {target_forecast_date}...")
    df_forecast = run_demand_forecast(
        target_date=target_forecast_date,
        push_to_supabase=False,
        model_path=DEFAULT_MODEL_PATH
    )
    
    # Save local CSV artifact
    os.makedirs(os.path.dirname(DEFAULT_OUTPUT_PATH), exist_ok=True)
    df_forecast.to_csv(DEFAULT_OUTPUT_PATH, index=False)
    print(f"      -> Saved local forecast artifact to: {DEFAULT_OUTPUT_PATH}")

    # Step 6: Push to Supabase
    if push_to_db:
        print(f"\n[6/6] Pushing {len(df_forecast)} forecast rows to Supabase `demand_forecast` table...")
        save_forecast_to_supabase(df_forecast)
        print("      -> Supabase `demand_forecast` table successfully updated!")
    else:
        print("\n[6/6] Skipping Supabase push (push_to_db=False).")

    print("\n=======================================================")
    print("      PIPELINE COMPLETED SUCCESSFULLY (DAY-2 DONE)     ")
    print("=======================================================\n")

    return {
        "status": "success",
        "total_skus_forecasted": len(df_forecast),
        "target_date": target_forecast_date,
        "metrics": metrics,
        "sample_forecast": df_forecast.head(5).to_dict(orient="records")
    }


if __name__ == "__main__":
    result = execute_full_pipeline(target_forecast_date="2026-10-15", push_to_db=True)