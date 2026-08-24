from typing import List, Optional
from pydantic import BaseModel


# --- Products Schemas ---
class ProductBase(BaseModel):
    sku: str
    product_name: str
    category: Optional[str] = None
    season: Optional[str] = None
    selling_price: Optional[float] = None
    production_cost: Optional[float] = None


class ProductResponse(ProductBase):
    id: Optional[int] = None


# --- Demand & Forecasting Schemas ---
class DemandHistoryItem(BaseModel):
    id: Optional[int] = None
    sku: str
    demand_date: str
    quantity_sold: int
    promotion: Optional[bool] = False
    markdown_percentage: Optional[float] = 0.0
    sell_through_rate: Optional[float] = None


class DemandForecastItem(BaseModel):
    id: Optional[int] = None
    sku: str
    forecast_date: str
    forecast_quantity: int
    confidence: Optional[float] = None
    model_version: Optional[str] = "v1.0-baseline"


class ForecastRunRequest(BaseModel):
    sku: str
    horizon_months: Optional[int] = 3


class ForecastRunResponse(BaseModel):
    success: bool = True
    sku: str
    forecast: int
    confidence: float
    model_version: str = "v1.0-baseline"


# --- S&OP Schemas (P2 -> P3 Core Contract) ---
class SOPRunRequest(BaseModel):
    sku: str
    target_date: Optional[str] = "2026-10-15"


class MaterialRequirementContract(BaseModel):
    material_id: str
    required_quantity: int
    required_date: str
    plant_id: str
    priority: str


# --- Suppliers & Materials Schemas ---
class SupplierItem(BaseModel):
    id: Optional[int] = None
    supplier_id: str
    supplier_name: str
    location: str
    risk_level: str


class MaterialItem(BaseModel):
    id: Optional[int] = None
    material_id: str
    material_name: str
    unit: str
    lead_time_days: Optional[int] = None
    moq: Optional[int] = None


# --- Procurement & Optimization Schemas (P3 -> P1 Core Contract) ---
class SupplierAllocationDetail(BaseModel):
    supplier_id: str
    quantity: int
    percentage: float
    unit_price: float
    risk_score: float


class OptimizationResponse(BaseModel):
    material_id: str
    required_quantity: int
    total_allocated: int
    total_cost: float
    allocation: List[SupplierAllocationDetail]


# --- Risk & Scenarios Schemas ---
class RiskPredictionRequest(BaseModel):
    supplier_id: str
    material_id: str


class RiskPredictionResponse(BaseModel):
    supplier_id: str
    material_id: str
    delay_probability: float
    predicted_delay_days: int
    risk_level: str
    risk_score: float


class ScenarioRunRequest(BaseModel):
    scenario_name: str
    material_id: str
    quantity_modifier: Optional[float] = 1.0


class ScenarioRunResponse(BaseModel):
    scenario_name: str
    material_id: str
    adjusted_required_quantity: int
    feasibility: str
    estimated_cost: float
    recommended_action: str

