from typing import Dict, Any, List, Optional
from datetime import date as _date, datetime
from pathlib import Path

from optimization.scenario_runner import run_scenario as _run_scenario
from services.scenario_explanation import explain_scenario

# Project root is 3 levels up from this file:
# backend/app/repositories/procurement.py -> backend/app -> backend -> project root
_PROJECT_ROOT = Path(__file__).resolve().parents[3]
_DATA_DIR = _PROJECT_ROOT / "data" / "sample"
_REPORTS_DIR = _PROJECT_ROOT / "reports"


from optimization.schemas import AllocationRequest
from optimization.optimizer import SupplierAllocationOptimizer
from optimization.loader import load_supplier_options
from optimization.config import OptimizationConfig

def run_procurement_optimization(
    material_id: str,
    required_quantity: int,
    required_date: str,
    plant_id: str,
    priority: str = "HIGH"
) -> Dict[str, Any]:
    # 1. Parse date
    req_date = datetime.strptime(required_date, "%Y-%m-%d").date()
    
    # 2. Build allocation request
    request = AllocationRequest(
        material_id=material_id,
        required_quantity=required_quantity,
        required_date=req_date,
        plant_id=plant_id,
        priority=priority
    )

    # 3. Load actual options (using Scenario's existing CSV loader setup)
    try:
        supplier_options = load_supplier_options(
            supplier_materials_csv=_DATA_DIR / "supplier_materials.csv",
            suppliers_csv=_DATA_DIR / "suppliers.csv",
            risk_predictions_csv=_REPORTS_DIR / "risk_predictions.csv",
            supplier_contracts_csv=_DATA_DIR / "supplier_contracts.csv",
            material_id=material_id
        )
    except ValueError:
        supplier_options = []
    
    # Filter for the material
    options_for_mat = [opt for opt in supplier_options if opt.material_id == material_id]

    # 4. Run Optimizer
    config = OptimizationConfig()
    optimizer = SupplierAllocationOptimizer(config=config)
    result = optimizer.optimize(request, options_for_mat)

    # 5. Serialize full OptimizationResult matching the schema
    allocation_list = [
        {
            "supplier_id": line.supplier_id,
            "supplier_name": line.supplier_name,
            "quantity": line.quantity,
            "percentage": line.percentage,
            "unit_price": line.unit_price,
            "total_cost": line.total_cost,
            "risk_score": line.risk_score,
            "risk_level": line.risk_level,
            "lead_time_days": line.lead_time_days,
            "expected_delivery_date": line.expected_delivery_date.isoformat(),
        }
        for line in result.allocation
    ]

    return {
        "status": result.status,
        "material_id": result.material_id,
        "plant_id": result.plant_id,
        "priority": result.priority,
        "required_quantity": result.required_quantity,
        "total_allocated": result.total_allocated,
        "total_cost": result.total_cost,
        "objective_value": result.objective_value,
        "objective_bound": result.objective_bound,
        "solve_time_seconds": result.solve_time_seconds,
        "model_version": result.model_version,
        "solver_name": result.solver_name,
        "kpis": vars(result.kpis),
        "allocation": allocation_list
    }


import csv

def predict_supplier_risk(supplier_id: str, material_id: str) -> Dict[str, Any]:
    risk_csv = _REPORTS_DIR / "risk_predictions.csv"
    
    # Default fallback
    info = {
        "supplier_id": supplier_id,
        "material_id": material_id,
        "risk_score": 0.20,
        "risk_level": "MEDIUM",
        "delivery_risk": 0.15,
        "quality_risk": 0.10,
        "prediction_date": "2026-08-23",
        "model_version": "p3-risk-v2"
    }

    if risk_csv.exists():
        with open(risk_csv, "r", encoding="utf-8") as f:
            reader = csv.DictReader(f)
            for row in reader:
                if row["supplier_id"] == supplier_id:
                    info.update({
                        "risk_score": float(row["risk_score"]),
                        "risk_level": row["risk_level"],
                        "delivery_risk": float(row["delivery_risk"]),
                        "quality_risk": float(row["quality_risk"]),
                        "prediction_date": row["prediction_date"],
                        "model_version": row["model_version"]
                    })
                    break

    return info


def run_scenario_simulation(
    scenario_name: str,
    material_id: str,
    required_quantity: int,
    required_date: str,
    plant_id: str,
    priority: str = "HIGH",
    target_supplier_id: Optional[str] = None,
    magnitude: float = 0.3,
) -> Dict[str, Any]:
    """
    Runs the REAL what-if comparison via optimization.scenario_runner
    (real OR-Tools optimizer, real scenario perturbation functions),
    then narrates the result via services.scenario_explanation (Gemini,
    with a deterministic fallback). No fake/hardcoded math here anymore.
    """
    required_date_obj = datetime.strptime(required_date, "%Y-%m-%d").date()

    comparison = _run_scenario(
        scenario_type=scenario_name,
        material_id=material_id,
        required_quantity=required_quantity,
        required_date=required_date_obj,
        plant_id=plant_id,
        priority=priority,
        target_supplier_id=target_supplier_id,
        magnitude=magnitude,
        data_dir=_DATA_DIR,
        reports_dir=_REPORTS_DIR,
        current_date=_date.today(),
    )

    narration = explain_scenario(comparison)

    return {
        "scenario_name": scenario_name,
        "material_id": material_id,
        "feasibility_changed": comparison.feasibility_changed,
        "baseline_status": comparison.baseline.status,
        "scenario_status": comparison.scenario.status,
        "baseline_cost": comparison.baseline.total_cost,
        "scenario_cost": comparison.scenario.total_cost,
        "cost_delta": comparison.cost_delta,
        "cost_delta_pct": comparison.cost_delta_pct,
        "baseline_risk_score": comparison.baseline.kpis.weighted_avg_risk_score,
        "scenario_risk_score": comparison.scenario.kpis.weighted_avg_risk_score,
        "risk_delta": comparison.risk_delta,
        "allocation_deltas": [
            {
                "supplier_id": d.supplier_id,
                "baseline_quantity": d.baseline_quantity,
                "scenario_quantity": d.scenario_quantity,
                "change": d.change,
            }
            for d in comparison.allocation_deltas
        ],
        "explanation": narration,
    }