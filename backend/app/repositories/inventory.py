from __future__ import annotations

from typing import Optional, List, Dict, Any

from app.core.database import supabase


def get_all_inventory(sku: Optional[str] = None) -> List[Dict[str, Any]]:
    try:
        query = supabase.table("inventory").select("*")

        if sku:
            query = query.eq("sku", sku.strip())

        response = query.execute()
        return response.data or []

    except Exception as e:
        print(f"Database query error (inventory): {e}")
        return []


def get_inventory_for_sku_plant(
    sku: str,
    plant_id: str,
) -> Dict[str, Any]:
    """
    Return inventory for one SKU at one plant.

    available_quantity = quantity - reserved_quantity
    """

    response = (
        supabase.table("inventory")
        .select("*")
        .eq("sku", sku.strip())
        .eq("location", plant_id.strip())
        .limit(1)
        .execute()
    )

    if not response.data:
        return {
            "sku": sku,
            "location": plant_id,
            "quantity": 0,
            "reserved_quantity": 0,
            "available_quantity": 0,
        }

    row = response.data[0]

    quantity = int(row.get("quantity") or 0)
    reserved_quantity = int(row.get("reserved_quantity") or 0)

    return {
        **row,
        "quantity": quantity,
        "reserved_quantity": reserved_quantity,
        "available_quantity": max(
            0,
            quantity - reserved_quantity,
        ),
    }