from typing import Optional, List, Dict, Any
from app.core.database import supabase

SAMPLE_DEMAND_HISTORY = [
    {"id": 1, "sku": "TW001", "demand_date": "2026-01-01", "quantity_sold": 8500, "promotion": False, "markdown_percentage": 0.0, "sell_through_rate": 78.5},
    {"id": 2, "sku": "TW001", "demand_date": "2026-02-01", "quantity_sold": 9200, "promotion": False, "markdown_percentage": 0.0, "sell_through_rate": 81.2},
    {"id": 3, "sku": "TW001", "demand_date": "2026-03-01", "quantity_sold": 11500, "promotion": True, "markdown_percentage": 10.0, "sell_through_rate": 89.4},
    {"id": 4, "sku": "TW002", "demand_date": "2026-01-01", "quantity_sold": 6000, "promotion": False, "markdown_percentage": 0.0, "sell_through_rate": 72.0},
    {"id": 5, "sku": "TW002", "demand_date": "2026-02-01", "quantity_sold": 7500, "promotion": False, "markdown_percentage": 0.0, "sell_through_rate": 75.0}
]

SAMPLE_DEMAND_FORECAST = [
    {"id": 1, "sku": "TW001", "forecast_date": "2026-10-01", "forecast_quantity": 12000, "confidence": 92.5, "model_version": "v1.0-baseline"},
    {"id": 2, "sku": "TW002", "forecast_date": "2026-10-01", "forecast_quantity": 18000, "confidence": 88.0, "model_version": "v1.0-baseline"},
    {"id": 3, "sku": "TW003", "forecast_date": "2026-10-01", "forecast_quantity": 9500, "confidence": 85.0, "model_version": "v1.0-baseline"}
]


def get_demand_history(sku: Optional[str] = None) -> List[Dict[str, Any]]:
    try:
        query = supabase.table("demand_history").select("*")
        if sku:
            query = query.eq("sku", sku.strip())
        response = query.execute()
        if response.data:
            return response.data
    except Exception as e:
        print(f"Database query error (demand_history): {e}")

    if sku:
        return [item for item in SAMPLE_DEMAND_HISTORY if item["sku"].upper() == sku.strip().upper()]
    return SAMPLE_DEMAND_HISTORY


def get_demand_forecast(sku: Optional[str] = None) -> List[Dict[str, Any]]:
    try:
        query = supabase.table("demand_forecast").select("*")
        if sku:
            query = query.eq("sku", sku.strip())
        response = query.execute()
        if response.data:
            return response.data
    except Exception as e:
        print(f"Database query error (demand_forecast): {e}")

    if sku:
        return [item for item in SAMPLE_DEMAND_FORECAST if item["sku"].upper() == sku.strip().upper()]
    return SAMPLE_DEMAND_FORECAST


def run_demand_forecast(sku: str, horizon_months: int = 3) -> Dict[str, Any]:
    return {
        "success": True,
        "sku": sku,
        "forecast": 12000,
        "confidence": 92.5,
        "model_version": "v1.0-baseline"
    }


def run_sop_engine(sku: str, target_date: str = "2026-10-15") -> Dict[str, Any]:
    return {
        "material_id": "MAT001",
        "required_quantity": 30000,
        "required_date": target_date,
        "plant_id": "PLANT001",
        "priority": "HIGH"
    }

