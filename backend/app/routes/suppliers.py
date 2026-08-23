from fastapi import APIRouter
from app.repositories.suppliers import get_all_suppliers, get_all_materials

router = APIRouter(
    tags=["Suppliers & Materials"]
)


@router.get("/api/suppliers")
def list_suppliers():
    suppliers = get_all_suppliers()
    return {
        "success": True,
        "count": len(suppliers),
        "data": suppliers
    }


@router.get("/api/materials")
def list_materials():
    materials = get_all_materials()
    return {
        "success": True,
        "count": len(materials),
        "data": materials
    }

