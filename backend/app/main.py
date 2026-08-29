import sys
from pathlib import Path

# Add project root to sys.path so backend can import sibling packages
# (optimization/, services/) that live outside backend/
PROJECT_ROOT = Path(__file__).resolve().parents[2]
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.database import supabase
from app.routes.products import router as products_router
from app.routes.demand import router as demand_router
from app.routes.inventory import router as inventory_router
from app.routes.suppliers import router as suppliers_router
from app.routes.procurement import router as procurement_router

app = FastAPI(
    title="TrendWear AI API",
    description="Integrated S&OP + Procurement Planning & Supplier Allocation API for TrendWear Apparel",
    version="1.0.0"
)

import os

# Configure CORS origins from environment variable (production: Vercel URL)
# For local dev and testing, also allow localhost origins
_FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")
_ALLOWED_ORIGINS = [
    _FRONTEND_URL,
    "http://localhost:5173",
    "http://localhost:3000",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=_ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register All API Routers
app.include_router(products_router)
app.include_router(demand_router)
app.include_router(inventory_router)
app.include_router(suppliers_router)
app.include_router(procurement_router)


@app.get("/")
def root():
    return {
        "message": "TrendWear AI API is running"
    }


@app.get("/api/health")
@app.get("/health")
def health():
    return {
        "status": "healthy"
    }


@app.get("/test-db")
def test_db():
    try:
        response = (
            supabase
            .table("products")
            .select("*")
            .limit(5)
            .execute()
        )
        return {
            "success": True,
            "connected": True,
            "count": len(response.data),
            "data": response.data
        }
    except Exception as e:
        return {
            "success": False,
            "connected": False,
            "error": str(e)
        }