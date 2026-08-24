"""
fetch_data.py
Fetches demand_history and products directly from Supabase.
"""

from supabase_client import fetch_demand_history, fetch_products
import pandas as pd

def get_full_dataset() -> tuple[pd.DataFrame, pd.DataFrame]:
    print("Fetching demand_history from Supabase...")
    df_demand = fetch_demand_history()
    print(f"Fetched {len(df_demand)} demand_history rows across {df_demand['sku'].nunique()} unique SKUs.")
    
    print("Fetching products from Supabase...")
    df_products = fetch_products()
    print(f"Fetched {len(df_products)} products rows.")
    
    return df_demand, df_products

if __name__ == "__main__":
    df_demand, df_products = get_full_dataset()
    print("\n--- Demand History Sample ---")
    print(df_demand.head())
    print("\n--- Products Sample ---")
    print(df_products.head())

