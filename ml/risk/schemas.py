from __future__ import annotations
from datetime import date, datetime
from typing import List
from pydantic import BaseModel, ConfigDict, Field

class RiskPrediction(BaseModel):
    model_config = ConfigDict(extra="forbid")
    supplier_id: str = Field(min_length=1)
    risk_score: float = Field(ge=0.0, le=1.0)
    risk_level: str = Field(pattern=r"^(LOW|MEDIUM|HIGH)$")
    delivery_risk: float = Field(ge=0.0, le=1.0)
    quality_risk: float = Field(ge=0.0, le=1.0)
    prediction_date: date
    model_version: str = Field(min_length=1)
    generated_at: datetime

class RiskPredictionBatch(BaseModel):
    model_config = ConfigDict(extra="forbid")
    predictions: List[RiskPrediction]
