from fastapi import FastAPI
from app.core.database import supabase
from app.routes.products import router as products_router

app = FastAPI(
    title="TrendWear AI Backend",
    version="1.0.0"
)

app.include_router(products_router)

@app.get("/")
def root():
    return {
        "message": "TrendWear AI Backend is running"
    }


@app.get("/health")
def health():
    return {
        "status": "healthy"
    }


@app.get("/test-db")
def test_db():
    response = (
        supabase
        .table("products")
        .select("*")
        .limit(5)
        .execute()
    )

    return {
        "success": True,
        "data": response.data
    }

