from typing import Optional, List, Dict, Any
from app.core.database import supabase

SAMPLE_SUPPLIERS = [
    {"id": 1, "supplier_id": "SUP001", "supplier_name": "Alpha Textiles", "location": "India", "risk_level": "LOW"},
    {"id": 2, "supplier_id": "SUP002", "supplier_name": "Beta Fabrics", "location": "India", "risk_level": "MEDIUM"},
    {"id": 3, "supplier_id": "SUP003", "supplier_name": "Gamma Materials", "location": "Bangladesh", "risk_level": "HIGH"},
    {"id": 4, "supplier_id": "SUP004", "supplier_name": "Delta Mills", "location": "India", "risk_level": "LOW"},
    {"id": 5, "supplier_id": "SUP005", "supplier_name": "EastWeave Textiles", "location": "Vietnam", "risk_level": "MEDIUM"}
]

SAMPLE_MATERIALS = [
    {"id": 1, "material_id": "MAT001", "material_name": "100% Organic Cotton Fabric", "unit": "Meters", "lead_time_days": 12, "moq": 5000},
    {"id": 2, "material_id": "MAT002", "material_name": "Indigo Denim Twill 12oz", "unit": "Meters", "lead_time_days": 20, "moq": 3000},
    {"id": 3, "material_id": "MAT003", "material_name": "Polyester Fleece 300gsm", "unit": "Meters", "lead_time_days": 15, "moq": 4000}
]


def get_all_suppliers() -> List[Dict[str, Any]]:
    try:
        response = (
            supabase
            .table("suppliers")
            .select("*")
            .execute()
        )
        if response.data:
            return response.data
    except Exception as e:
        print(f"Database query error (suppliers): {e}")

    return SAMPLE_SUPPLIERS


def get_all_materials() -> List[Dict[str, Any]]:
    try:
        response = (
            supabase
            .table("materials")
            .select("*")
            .execute()
        )
        if response.data:
            return response.data
    except Exception as e:
        print(f"Database query error (materials): {e}")

    return SAMPLE_MATERIALS

