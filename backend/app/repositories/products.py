from app.core.database import supabase

# Sample fallback data for Day 1
SAMPLE_PRODUCTS = [
    {
        "id": 1,
        "sku": "TW001",
        "product_name": "Classic Cotton Shirt",
        "category": "Shirts",
        "season": "SS26",
        "selling_price": 1499.0,
        "production_cost": 650.0
    },
    {
        "id": 2,
        "sku": "TW002",
        "product_name": "Slim Denim Jeans",
        "category": "Denim",
        "season": "SS26",
        "selling_price": 2499.0,
        "production_cost": 1100.0
    },
    {
        "id": 3,
        "sku": "TW003",
        "product_name": "Relaxed Hoodie",
        "category": "Hoodies",
        "season": "AW26",
        "selling_price": 2999.0,
        "production_cost": 1400.0
    },
    {
        "id": 4,
        "sku": "TW004",
        "product_name": "Formal Trousers",
        "category": "Trousers",
        "season": "AW26",
        "selling_price": 2199.0,
        "production_cost": 950.0
    },
    {
        "id": 5,
        "sku": "TW005",
        "product_name": "Printed Summer Dress",
        "category": "Dresses",
        "season": "SS26",
        "selling_price": 2799.0,
        "production_cost": 1200.0
    }
]


def get_all_products():
    try:
        response = (
            supabase
            .table("products")
            .select("*")
            .execute()
        )
        if response.data:
            return response.data
    except Exception as e:
        print(f"Database query error (products): {e}")

    return SAMPLE_PRODUCTS


def get_product_by_sku(sku: str):
    sku = sku.strip()
    try:
        response = (
            supabase
            .table("products")
            .select("*")
            .eq("sku", sku)
            .execute()
        )
        if response.data:
            return response.data
    except Exception as e:
        print(f"Database query error (product {sku}): {e}")

    # Fallback to sample dataset if database is empty / not seeded
    fallback = [p for p in SAMPLE_PRODUCTS if p["sku"].upper() == sku.upper()]
    return fallback