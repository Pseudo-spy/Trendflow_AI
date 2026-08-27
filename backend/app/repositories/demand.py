from app.repositories.inventory import get_inventory_for_sku_plant
from app.repositories.bom import get_material_for_sku, calculate_required_quantity
from typing import Optional, List, Dict, Any

from app.core.database import supabase
from app.repositories.capacity import get_production_capacity
from app.repositories.inventory import get_inventory_for_sku_plant

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


def run_demand_forecast(
    sku: str,
    horizon_months: int = 3,
) -> Dict[str, Any]:
    """
    Run the real P2 ML forecasting model for one SKU.

    The existing API contract is preserved:
        success
        sku
        forecast
        confidence
        model_version
    """
    import sys
    from pathlib import Path

    project_root = Path(__file__).resolve().parents[3]
    forecasting_dir = project_root / "ml" / "forecasting"

    if str(forecasting_dir) not in sys.path:
        sys.path.insert(0, str(forecasting_dir))

    from predict import run_demand_forecast as run_ml_forecast

    # The current P2 ML function forecasts a requested target date.
    # Use the existing forecast horizon only as part of the API contract;
    # the trained model remains the source of the prediction.
    forecast_df = run_ml_forecast(
        skus=[sku],
        target_date="2026-10-15",
        push_to_supabase=False,
    )

    if forecast_df.empty:
        raise RuntimeError(f"No forecast returned for SKU {sku}")

    row = forecast_df.iloc[0]

    return {
        "success": True,
        "sku": sku,
        "forecast": int(row["forecast_quantity"]),
        "confidence": float(row["confidence"]),
        "model_version": str(row["model_version"]),
    }


def run_sop_engine(
    sku: str,
    target_date: str = "2026-10-15",
    plant_id: str = "PLANT001",
    priority: str = "HIGH",
) -> Dict[str, Any]:
    """
    Run the P2 S&OP planning calculation.

    This calculates:
        forecast
        -> inventory netting
        -> production capacity
        -> capacity gap

    The existing material-requirement contract is preserved for PR1.
    """

    # Import the real P2 ML forecast lazily so the backend can start
    # without requiring the forecasting module at import time.
    import sys
    from pathlib import Path

    project_root = Path(__file__).resolve().parents[3]
    forecasting_dir = project_root / "ml" / "forecasting"

    if str(forecasting_dir) not in sys.path:
        sys.path.insert(0, str(forecasting_dir))

    from predict import run_demand_forecast

    # 1. Real ML forecast
    forecast_df = run_demand_forecast(
        target_date=target_date,
        skus=[sku],
        push_to_supabase=False,
    )

    if forecast_df.empty:
        raise RuntimeError(f"No forecast returned for SKU {sku}")

    forecast_row = forecast_df.iloc[0]

    forecast_quantity = int(forecast_row["forecast_quantity"])
    forecast_confidence = float(forecast_row["confidence"])
    forecast_model_version = str(forecast_row["model_version"])

    # 2. Finished-goods inventory at the planning plant
    inventory = get_inventory_for_sku_plant(
        sku=sku,
        plant_id=plant_id,
    )

    inventory_quantity = int(inventory["quantity"])
    reserved_quantity = int(inventory["reserved_quantity"])
    available_inventory = int(inventory["available_quantity"])

    # 3. Net demand after usable inventory
    net_demand = max(
        0,
        forecast_quantity - available_inventory,
    )

    # 4. Capacity for the planning month
    capacity = get_production_capacity(
        plant_id=plant_id,
        target_date=target_date,
    )

    # 5. Preserve the existing P2 -> PR1 contract.
    #
    # We deliberately do NOT invent a raw-material calculation here
    # because the current project has no SKU -> material/BOM mapping.
       # 5. SKU -> material (BOM) mapping, derived from product category.
    # See app/repositories/bom.py for the category -> material lookup
    # and the usage_factor estimates (synthetic — no real BOM data exists yet).
    bom_info = get_material_for_sku(sku)
    required_quantity = calculate_required_quantity(
        net_demand=net_demand,
        usage_factor=bom_info["usage_factor"],
    )

    result = {
        "material_id": bom_info["material_id"],
        "required_quantity": required_quantity,
        "required_date": target_date,
        "plant_id": plant_id,
        "priority": priority,

        "sku": sku,
        "forecast_quantity": forecast_quantity,
        "forecast_confidence": forecast_confidence,
        "forecast_model_version": forecast_model_version,
        "inventory_quantity": inventory_quantity,
        "reserved_quantity": reserved_quantity,
        "available_inventory": available_inventory,
        "net_demand": net_demand,
    }

    # 6. Capacity may be missing for the planning month.
    if capacity is None:
        result.update(
            {
                "capacity_units": None,
                "available_capacity": None,
                "production_requirement": None,
                "capacity_gap": None,
                "capacity_status": "CAPACITY_DATA_MISSING",
            }
        )
        return result

    capacity_units = int(capacity.get("capacity_units") or 0)
    available_capacity = max(
        0,
        int(capacity.get("available_capacity") or 0),
    )

    production_requirement = min(
        net_demand,
        available_capacity,
    )

    capacity_gap = max(
        0,
        net_demand - available_capacity,
    )

    result.update(
        {
            "capacity_units": capacity_units,
            "available_capacity": available_capacity,
            "production_requirement": production_requirement,
            "capacity_gap": capacity_gap,
            "capacity_status": (
                "CAPACITY_SHORTFALL"
                if capacity_gap > 0
                else "FEASIBLE"
            ),
        }
    )

    return result

