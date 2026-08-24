"""
train.py
Train an explainable Machine Learning Demand Forecasting model for TrendWear AI.
Features:
- Seasonality (month, quarter, cyclical sine/cosine)
- Promotion & Markdown elasticity
- Product Category, Season & Price Tier signals
- Historical Lag & Rolling Sell-through signals
- Cold-Start Category Fallback for new SKUs
- Holdout Evaluation (MAE, RMSE, MAPE)
- Persistence of trained model artifact to artifacts/forecasting_model.pkl
"""

import os
import math
import joblib
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error

from supabase_client import fetch_demand_history, fetch_products

MODEL_VERSION = "v2.0-ml-randomforest"
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
DEFAULT_MODEL_PATH = os.path.join(SCRIPT_DIR, "artifacts", "forecasting_model.pkl")
LOCAL_DEMAND_CSV = os.path.join(SCRIPT_DIR, "..", "..", "data", "sample", "demand_history.csv")
LOCAL_PRODUCTS_CSV = os.path.join(SCRIPT_DIR, "..", "..", "data", "sample", "products.csv")


def load_dataset(use_supabase: bool = True) -> tuple[pd.DataFrame, pd.DataFrame]:
    """
    Load demand_history and products from Supabase, falling back to local CSVs if needed.
    """
    df_demand = None
    df_products = None
    
    if use_supabase:
        try:
            df_demand = fetch_demand_history()
            df_products = fetch_products()
            print(f"Loaded from Supabase: {len(df_demand)} demand rows, {len(df_products)} product rows.")
        except Exception as e:
            print(f"Supabase fetch failed ({e}). Falling back to local data files...")
            df_demand = None
            df_products = None

    if df_demand is None or df_demand.empty:
        if os.path.exists(LOCAL_DEMAND_CSV):
            df_demand = pd.read_csv(LOCAL_DEMAND_CSV, parse_dates=["demand_date"])
        else:
            raise RuntimeError(f"No demand data available from Supabase or {LOCAL_DEMAND_CSV}")
            
    if df_products is None or df_products.empty:
        if os.path.exists(LOCAL_PRODUCTS_CSV):
            df_products = pd.read_csv(LOCAL_PRODUCTS_CSV)
        else:
            # Generate minimal products dataframe from unique SKUs if missing
            unique_skus = df_demand["sku"].unique()
            df_products = pd.DataFrame({
                "sku": unique_skus,
                "product_name": [f"Product {s}" for s in unique_skus],
                "category": "Shirts",
                "season": "SS26",
                "selling_price": 1500.0,
                "production_cost": 700.0
            })

    return df_demand, df_products


def build_features(df_demand: pd.DataFrame, df_products: pd.DataFrame) -> pd.DataFrame:
    """
    Combines demand history with product metadata and builds tabular features for ML.
    """
    # Clean & sort
    df = df_demand.copy()
    df["demand_date"] = pd.to_datetime(df["demand_date"])
    df = df.sort_values(["sku", "demand_date"]).reset_index(drop=True)
    
    # Merge product metadata
    df = df.merge(df_products[["sku", "category", "season", "selling_price", "production_cost"]], on="sku", how="left")
    df["category"] = df["category"].fillna("General")
    df["season"] = df["season"].fillna("SS26")
    df["selling_price"] = df["selling_price"].fillna(1500.0)
    df["production_cost"] = df["production_cost"].fillna(700.0)
    df["margin"] = df["selling_price"] - df["production_cost"]

    # Date / Seasonality features
    df["month"] = df["demand_date"].dt.month
    df["quarter"] = df["demand_date"].dt.quarter
    df["sin_month"] = np.sin(2 * np.pi * df["month"] / 12.0)
    df["cos_month"] = np.cos(2 * np.pi * df["month"] / 12.0)
    
    # Promotion & Markdown
    df["promotion_flag"] = df["promotion"].astype(int)
    df["markdown_pct"] = df["markdown_percentage"].fillna(0.0)
    df["sell_through"] = df["sell_through_rate"].fillna(70.0)

    # Lag & Rolling features per SKU
    df["lag_1"] = df.groupby("sku")["quantity_sold"].shift(1)
    df["lag_2"] = df.groupby("sku")["quantity_sold"].shift(2)
    df["rolling_mean_3"] = df.groupby("sku")["quantity_sold"].shift(1).rolling(3, min_periods=1).mean()
    df["rolling_std_3"] = df.groupby("sku")["quantity_sold"].shift(1).rolling(3, min_periods=1).std().fillna(0.0)

    # Fill initial lag nulls with SKU group mean or overall mean
    sku_means = df.groupby("sku")["quantity_sold"].transform("mean")
    overall_mean = df["quantity_sold"].mean()
    df["lag_1"] = df["lag_1"].fillna(sku_means).fillna(overall_mean)
    df["lag_2"] = df["lag_2"].fillna(sku_means).fillna(overall_mean)
    df["rolling_mean_3"] = df["rolling_mean_3"].fillna(sku_means).fillna(overall_mean)

    return df


def train_forecasting_model(df_features: pd.DataFrame, df_products: pd.DataFrame) -> dict:
    """
    Train Random Forest regressor with holdout validation and prepare category cold-start baselines.
    """
    # Categorical encoding for category and season
    categories = sorted(df_products["category"].unique().tolist())
    seasons = sorted(df_products["season"].unique().tolist())
    
    cat_to_code = {c: i for i, c in enumerate(categories)}
    season_to_code = {s: i for i, s in enumerate(seasons)}

    df_encoded = df_features.copy()
    df_encoded["cat_code"] = df_encoded["category"].map(lambda x: cat_to_code.get(x, 0))
    df_encoded["season_code"] = df_encoded["season"].map(lambda x: season_to_code.get(x, 0))

    feature_cols = [
        "cat_code",
        "season_code",
        "selling_price",
        "production_cost",
        "margin",
        "month",
        "quarter",
        "sin_month",
        "cos_month",
        "promotion_flag",
        "markdown_pct",
        "sell_through",
        "lag_1",
        "lag_2",
        "rolling_mean_3",
        "rolling_std_3"
    ]

    target_col = "quantity_sold"

    # Time-based holdout split: last 2 recorded months as validation set
    max_date = df_encoded["demand_date"].max()
    cutoff_date = max_date - pd.DateOffset(months=2)

    train_df = df_encoded[df_encoded["demand_date"] < cutoff_date]
    val_df = df_encoded[df_encoded["demand_date"] >= cutoff_date]

    # Fallback to 80/20 split if time split is too small
    if len(train_df) < 100 or len(val_df) < 50:
        msk = np.random.rand(len(df_encoded)) < 0.8
        train_df = df_encoded[msk]
        val_df = df_encoded[~msk]

    X_train, y_train = train_df[feature_cols], train_df[target_col]
    X_val, y_val = val_df[feature_cols], val_df[target_col]

    print(f"Training set: {len(X_train)} rows | Validation set: {len(X_val)} rows")

    # Train Random Forest Regressor
    model = RandomForestRegressor(
        n_estimators=150,
        max_depth=12,
        min_samples_split=4,
        min_samples_leaf=2,
        random_state=42,
        n_jobs=-1
    )
    model.fit(X_train, y_train)

    # Evaluate on validation holdout
    val_preds = model.predict(X_val)
    val_preds = np.maximum(0, val_preds)
    
    mae = float(mean_absolute_error(y_val, val_preds))
    rmse = float(np.sqrt(mean_squared_error(y_val, val_preds)))
    mape = float(np.mean(np.abs((y_val - val_preds) / np.maximum(1, y_val))) * 100)

    print(f"\n--- Validation Metrics ---")
    print(f"MAE:  {mae:.2f} units")
    print(f"RMSE: {rmse:.2f} units")
    print(f"MAPE: {mape:.2f}%")

    # Fit final model on full dataset for highest deployment accuracy
    final_model = RandomForestRegressor(
        n_estimators=150,
        max_depth=12,
        min_samples_split=4,
        min_samples_leaf=2,
        random_state=42,
        n_jobs=-1
    )
    final_model.fit(df_encoded[feature_cols], df_encoded[target_col])

    # Pre-calculate category & season statistics for cold-start SKUs
    category_summary = df_encoded.groupby("category")[target_col].agg(["mean", "median", "std"]).to_dict(orient="index")
    season_summary = df_encoded.groupby("season")[target_col].agg(["mean", "median"]).to_dict(orient="index")
    overall_mean = float(df_encoded[target_col].mean())

    # Build latest known lag and rolling stats per SKU
    latest_sku_stats = {}
    for sku, group in df_encoded.groupby("sku"):
        recent = group.sort_values("demand_date").tail(3)
        latest_qty = float(recent.iloc[-1]["quantity_sold"])
        lag2_qty = float(recent.iloc[-2]["quantity_sold"]) if len(recent) > 1 else latest_qty
        r_mean = float(recent["quantity_sold"].mean())
        r_std = float(recent["quantity_sold"].std()) if len(recent) > 1 and not np.isnan(recent["quantity_sold"].std()) else 0.0
        st_rate = float(recent.iloc[-1]["sell_through_rate"])
        
        latest_sku_stats[sku] = {
            "lag_1": latest_qty,
            "lag_2": lag2_qty,
            "rolling_mean_3": r_mean,
            "rolling_std_3": r_std,
            "sell_through": st_rate
        }

    # Model artifact bundle
    model_bundle = {
        "model": final_model,
        "feature_cols": feature_cols,
        "cat_to_code": cat_to_code,
        "season_to_code": season_to_code,
        "categories": categories,
        "seasons": seasons,
        "category_summary": category_summary,
        "season_summary": season_summary,
        "overall_mean": overall_mean,
        "latest_sku_stats": latest_sku_stats,
        "metrics": {
            "mae": mae,
            "rmse": rmse,
            "mape": mape
        },
        "model_version": MODEL_VERSION
    }

    return model_bundle


def save_model(model_bundle: dict, path: str = DEFAULT_MODEL_PATH) -> None:
    """
    Save the model bundle to disk.
    """
    os.makedirs(os.path.dirname(path) or ".", exist_ok=True)
    joblib.dump(model_bundle, path)
    print(f"\nTrained model bundle saved successfully to {path}")


if __name__ == "__main__":
    df_demand, df_products = load_dataset(use_supabase=True)
    df_features = build_features(df_demand, df_products)
    model_bundle = train_forecasting_model(df_features, df_products)
    save_model(model_bundle)