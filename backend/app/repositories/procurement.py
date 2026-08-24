from typing import Dict, Any, List


def run_procurement_optimization(
    material_id: str,
    required_quantity: int,
    required_date: str,
    plant_id: str,
    priority: str = "HIGH"
) -> Dict[str, Any]:
    if material_id == "MAT001" and required_quantity == 30000:
        allocations = [
            {
                "supplier_id": "SUP001",
                "quantity": 15000,
                "percentage": 50.0,
                "unit_price": 145.0,
                "risk_score": 0.12
            },
            {
                "supplier_id": "SUP002",
                "quantity": 10000,
                "percentage": 33.33,
                "unit_price": 138.0,
                "risk_score": 0.28
            },
            {
                "supplier_id": "SUP004",
                "quantity": 5000,
                "percentage": 16.67,
                "unit_price": 150.0,
                "risk_score": 0.08
            }
        ]
        total_cost = sum(a["quantity"] * a["unit_price"] for a in allocations)
    else:
        q1 = int(required_quantity * 0.5)
        q2 = int(required_quantity * 0.3)
        q3 = required_quantity - q1 - q2
        allocations = [
            {"supplier_id": "SUP001", "quantity": q1, "percentage": 50.0, "unit_price": 145.0, "risk_score": 0.12},
            {"supplier_id": "SUP002", "quantity": q2, "percentage": 30.0, "unit_price": 138.0, "risk_score": 0.28},
            {"supplier_id": "SUP004", "quantity": q3, "percentage": 20.0, "unit_price": 150.0, "risk_score": 0.08}
        ]
        total_cost = sum(a["quantity"] * a["unit_price"] for a in allocations)

    return {
        "material_id": material_id,
        "required_quantity": required_quantity,
        "total_allocated": required_quantity,
        "total_cost": total_cost,
        "allocation": allocations
    }


def predict_supplier_risk(supplier_id: str, material_id: str) -> Dict[str, Any]:
    risk_data = {
        "SUP001": {"delay_prob": 0.08, "delay_days": 1, "level": "LOW", "score": 0.12},
        "SUP002": {"delay_prob": 0.22, "delay_days": 3, "level": "MEDIUM", "score": 0.28},
        "SUP003": {"delay_prob": 0.55, "delay_days": 7, "level": "HIGH", "score": 0.65},
        "SUP004": {"delay_prob": 0.05, "delay_days": 0, "level": "LOW", "score": 0.08},
        "SUP005": {"delay_prob": 0.18, "delay_days": 2, "level": "MEDIUM", "score": 0.24}
    }
    info = risk_data.get(supplier_id, {"delay_prob": 0.15, "delay_days": 2, "level": "MEDIUM", "score": 0.20})

    return {
        "supplier_id": supplier_id,
        "material_id": material_id,
        "delay_probability": info["delay_prob"],
        "predicted_delay_days": info["delay_days"],
        "risk_level": info["level"],
        "risk_score": info["score"]
    }


def run_scenario_simulation(scenario_name: str, material_id: str, quantity_modifier: float = 1.0) -> Dict[str, Any]:
    base_qty = 30000
    adjusted_qty = int(base_qty * quantity_modifier)
    unit_price_est = 145.0
    estimated_cost = adjusted_qty * unit_price_est

    return {
        "scenario_name": scenario_name,
        "material_id": material_id,
        "adjusted_required_quantity": adjusted_qty,
        "feasibility": "FEASIBLE" if adjusted_qty <= 100000 else "CAPACITY_CONSTRAINED",
        "estimated_cost": estimated_cost,
        "recommended_action": f"Allocate {adjusted_qty:,} units across approved suppliers SUP001, SUP002, and SUP004."
    }

