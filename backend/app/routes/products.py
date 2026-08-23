from fastapi import APIRouter, HTTPException

from app.repositories.products import (
    get_all_products,
    get_product_by_sku
)


router = APIRouter(
    prefix="/api/products",
    tags=["Products"]
)


@router.get("/")
def get_products():
    products = get_all_products()

    return {
        "success": True,
        "count": len(products),
        "data": products
    }


@router.get("/{sku}")
def get_product(sku: str):
    products = get_product_by_sku(sku)

    if not products:
        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )

    return {
        "success": True,
        "data": products[0]
    }