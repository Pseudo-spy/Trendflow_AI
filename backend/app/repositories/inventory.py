from typing import Optional, List, Dict, Any
from app.core.database import supabase


def get_all_inventory(sku: Optional[str] = None) -> List[Dict[str, Any]]:
    try:
        query = supabase.table("inventory").select("*")
        if sku:
            query = query.eq("sku", sku.strip())
        response = query.execute()
        if response.data:
            return response.data
    except Exception as e:
        print(f"Database query error (inventory): {e}")

    return []

