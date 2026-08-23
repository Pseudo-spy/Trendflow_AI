from app.core.database import supabase


def get_all_products():
    response = (
        supabase
        .table("products")
        .select("*")
        .execute()
    )

    return response.data


def get_product_by_sku(sku: str):
    sku = sku.strip()

    response = (
        supabase
        .table("products")
        .select("*")
        .eq("sku", sku)
        .execute()
    )

    return response.data