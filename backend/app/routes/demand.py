from typing import Optional
from fastapi import APIRouter, Query
from app.models.schemas import (
    ForecastRunRequest,
    ForecastRunResponse,
    SOPRunRequest,
    MaterialRequirementContract
)
from app.repositories.demand import (
    get_demand_history,
    get_demand_forecast,
    run_demand_forecast,
    run_sop_engine
)

router = APIRouter(
    tags=["Demand & S&OP"]
)


@router.get("/api/demand/history")
def demand_history(sku: Optional[str] = Query(None, description="Optional SKU to filter history")):
    history = get_demand_history(sku)
    return {
        "success": True,
        "count": len(history),
        "data": history
    }


@router.get("/api/demand/forecast")
def demand_forecast(sku: Optional[str] = Query(None, description="Optional SKU to filter forecast")):
    forecasts = get_demand_forecast(sku)
    return {
        "success": True,
        "count": len(forecasts),
        "data": forecasts
    }


@router.post("/api/forecast/run", response_model=ForecastRunResponse)
def run_forecast_endpoint(request: ForecastRunRequest):
    result = run_demand_forecast(request.sku, request.horizon_months)
    return result


@router.post("/api/sop/run", response_model=MaterialRequirementContract)
def run_sop_endpoint(request: SOPRunRequest):
    result = run_sop_engine(request.sku, request.target_date)
    return result

