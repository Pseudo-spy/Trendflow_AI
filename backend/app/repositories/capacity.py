from __future__ import annotations

from datetime import date
from typing import Any, Dict, Optional

from app.core.database import supabase


def get_production_capacity(
    plant_id: str,
    target_date: str,
) -> Optional[Dict[str, Any]]:
    """
    Return the monthly production-capacity record for a planning date.

    Example:
        target_date = 2026-10-15
        lookup date = 2026-10-01
    """
    target = date.fromisoformat(target_date)
    capacity_date = target.replace(day=1).isoformat()

    response = (
        supabase.table("production_capacity")
        .select("*")
        .eq("plant_id", plant_id.strip())
        .eq("capacity_date", capacity_date)
        .limit(1)
        .execute()
    )

    if not response.data:
        return None

    return response.data[0]