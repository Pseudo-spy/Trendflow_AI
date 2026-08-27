"""
bom.py — SKU -> Material (BOM) mapping for P2 S&OP -> PR1 material requirements.

Replaces the hardcoded MAT001 / 30000 legacy contract values in
backend/app/repositories/demand.py's run_sop_engine().

There is no dedicated BOM table in Supabase yet (data/sample/products.csv
is empty). This module derives the mapping from the `products` table's
`category` column, which IS populated in Supabase, using a category ->
material + usage_factor lookup.

The usage_factor values are synthetic engineering estimates (fabric
meters needed per unit produced), not a real textile spec — consistent
with the project guide's "synthetic data permitted" allowance. They
should be reviewed/adjusted by the team if a real BOM becomes available.

Drop this into: backend/app/repositories/bom.py
"""

from typing import Optional, Dict, Any
from app.core.database import supabase


# --- Category -> Material mapping -------------------------------------
# Based on suppliers.csv / suppliers.py known materials:
#   MAT001 = 100% Organic Cotton Fabric
#   MAT002 = Indigo Denim Twill 12oz
#   MAT003 = Polyester Fleece 300gsm
CATEGORY_TO_MATERIAL: Dict[str, str] = {
    "Denim": "MAT002",
    "Hoodies": "MAT003",
    "Jackets": "MAT003",
    "Shirts": "MAT001",
    "T-Shirts": "MAT001",
    "Trousers": "MAT001",
    "Dresses": "MAT001",
    "Kurtas": "MAT001",
}

# Fabric meters required per unit produced, by category.
# Synthetic estimates — see module docstring.
CATEGORY_USAGE_FACTOR: Dict[str, float] = {
    "T-Shirts": 1.2,
    "Shirts": 1.8,
    "Trousers": 1.6,
    "Denim": 1.5,
    "Dresses": 2.2,
    "Kurtas": 2.0,
    "Hoodies": 2.5,
    "Jackets": 2.8,
}

# Fallback if a SKU's category is missing/unknown — cotton is the most
# common base fabric across the catalog, and 1.5m/unit is a safe middle
# estimate.
DEFAULT_MATERIAL_ID = "MAT001"
DEFAULT_USAGE_FACTOR = 1.5


def get_sku_category(sku: str) -> Optional[str]:
    """Looks up a SKU's category from the products table."""
    try:
        res = supabase.table("products").select("category").eq("sku", sku.strip()).execute()
        if res.data:
            return res.data[0].get("category")
    except Exception as e:
        print(f"Database query error (products/category for {sku}): {e}")
    return None


def get_material_for_sku(sku: str) -> Dict[str, Any]:
    """
    Returns the material_id and usage_factor (fabric meters per unit)
    for a given SKU, derived from its product category.

    Falls back to DEFAULT_MATERIAL_ID / DEFAULT_USAGE_FACTOR if the SKU
    or its category can't be found (e.g. not yet in the products table).
    """
    category = get_sku_category(sku)

    if category is None:
        return {
            "material_id": DEFAULT_MATERIAL_ID,
            "usage_factor": DEFAULT_USAGE_FACTOR,
            "category": None,
            "used_fallback": True,
        }

    material_id = CATEGORY_TO_MATERIAL.get(category, DEFAULT_MATERIAL_ID)
    usage_factor = CATEGORY_USAGE_FACTOR.get(category, DEFAULT_USAGE_FACTOR)

    return {
        "material_id": material_id,
        "usage_factor": usage_factor,
        "category": category,
        "used_fallback": category not in CATEGORY_TO_MATERIAL,
    }


def calculate_required_quantity(net_demand: float, usage_factor: float) -> float:
    """
    required_quantity = net_demand (units to produce) x usage_factor
    (fabric meters per unit).
    """
    return round(net_demand * usage_factor, 2)