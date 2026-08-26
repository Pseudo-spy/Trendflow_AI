from fastapi import APIRouter
from app.models.schemas import (
    MaterialRequirementContract,
    OptimizationResponse,
    RiskPredictionRequest,
    RiskPredictionResponse,
    ScenarioRunRequest,
    ScenarioRunResponse
)
from app.repositories.procurement import (
    run_procurement_optimization,
    predict_supplier_risk,
    run_scenario_simulation
)

router = APIRouter(
    tags=["Procurement, Optimization & Risk"]
)


@router.post("/api/procurement/optimize", response_model=OptimizationResponse)
def optimize_procurement(request: MaterialRequirementContract):
    result = run_procurement_optimization(
        material_id=request.material_id,
        required_quantity=request.required_quantity,
        required_date=request.required_date,
        plant_id=request.plant_id,
        priority=request.priority
    )
    return result


@router.post("/api/risk/predict", response_model=RiskPredictionResponse)
def predict_risk_endpoint(request: RiskPredictionRequest):
    result = predict_supplier_risk(
        supplier_id=request.supplier_id,
        material_id=request.material_id
    )
    return result


@router.post("/api/scenario/run", response_model=ScenarioRunResponse)
def run_scenario_endpoint(request: ScenarioRunRequest):
    result = run_scenario_simulation(
        scenario_name=request.scenario_name,
        material_id=request.material_id,
        required_quantity=request.required_quantity,
        required_date=request.required_date,
        plant_id=request.plant_id,
        priority=request.priority,
        target_supplier_id=request.target_supplier_id,
        magnitude=request.magnitude,
    )
    return result