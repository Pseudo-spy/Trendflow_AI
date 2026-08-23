from typing import Optional
from fastapi import APIRouter, Query
from app.repositories.inventory import get_all_inventory

router = APIRouter(
    prefix="/api/inventory",
    tags=["Inventory"]
)


@router.get("/")
def list_inventory(sku: Optional[str] = Query(None, description="Filter inventory by SKU")):
    items = get_all_inventory(sku)
    return {
        "success": True,
        "count": len(items),
        "data": items
    }

