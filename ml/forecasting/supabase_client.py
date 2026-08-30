"""
supabase_client.py
Supabase connection and data fetching helpers for the P2 Demand Forecasting module.
"""

import os
from typing import Optional
import pandas as pd
from dotenv import load_dotenv
from supabase import Client, create_client

# Load .env from this folder, root, or backend
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
load_dotenv(os.path.join(BASE_DIR, ".env"))
load_dotenv(os.path.join(BASE_DIR, "..", "..", ".env"))
load_dotenv(os.path.join(BASE_DIR, "..", "..", "backend", ".env"))

SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_SERVICE_ROLE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
SUPABASE_ANON_KEY = os.environ.get("SUPABASE_ANON_KEY")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY")


def get_client() -> Client:
    """
    Returns an authenticated Supabase client.
    Prefers SUPABASE_SERVICE_ROLE_KEY to bypass RLS for data science / backend operations.
    """
    if not SUPABASE_URL:
        raise RuntimeError("SUPABASE_URL not found in environment/.env")

    key = SUPABASE_SERVICE_ROLE_KEY or SUPABASE_ANON_KEY or SUPABASE_KEY
    if not key:
        raise RuntimeError("Neither SUPABASE_SERVICE_ROLE_KEY, SUPABASE_ANON_KEY, nor SUPABASE_KEY found in .env")

    return create_client(SUPABASE_URL, key)


def fetch_demand_history(limit: int = 5000) -> pd.DataFrame:
    """
    Fetch demand_history table from Supabase.
    Columns: id, sku, demand_date, quantity_sold, promotion, markdown_percentage, sell_through_rate
    """
    client = get_client()
    res = client.table("demand_history").select("*").limit(limit).execute()
    df = pd.DataFrame(res.data)
    if not df.empty and "demand_date" in df.columns:
        df["demand_date"] = pd.to_datetime(df["demand_date"])
        df["quantity_sold"] = pd.to_numeric(df["quantity_sold"], errors="coerce")
        df["markdown_percentage"] = pd.to_numeric(df.get("markdown_percentage", 0), errors="coerce").fillna(0.0)
        df["sell_through_rate"] = pd.to_numeric(df.get("sell_through_rate", 70.0), errors="coerce").fillna(70.0)
        df["promotion"] = df.get("promotion", False).astype(bool)
    return df


def fetch_products() -> pd.DataFrame:
    """
    Fetch products master table from Supabase.
    Columns: id, sku, product_name, category, season, selling_price, production_cost
    """
    client = get_client()
    res = client.table("products").select("*").limit(1000).execute()
    df = pd.DataFrame(res.data)
    if not df.empty:
        df["selling_price"] = pd.to_numeric(df.get("selling_price", 0), errors="coerce").fillna(0.0)
        df["production_cost"] = pd.to_numeric(df.get("production_cost", 0), errors="coerce").fillna(0.0)
    return df


def save_forecast_to_supabase(forecast_df: pd.DataFrame) -> dict:
    """
    Saves or upserts forecast records into demand_forecast table.
    Columns: sku, forecast_date, forecast_quantity, confidence, model_version
    """
    client = get_client()
    records = forecast_df.to_dict(orient="records")

    # Ensure serializable types
    clean_records = []
    for r in records:
        clean_records.append({
            "sku": str(r["sku"]),
            "forecast_date": str(r["forecast_date"]),
            "forecast_quantity": int(r["forecast_quantity"]),
            "confidence": float(r["confidence"]) if r.get("confidence") is not None else None,
            "model_version": str(r["model_version"]),
        })

    res = client.table("demand_forecast").upsert(clean_records).execute()
    return res.data