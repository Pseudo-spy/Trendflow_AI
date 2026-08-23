"""
AI Explanation Layer for TrendWear AI (P2 + PR1)

This module NEVER makes procurement decisions and NEVER invents numbers.
It only explains results that have already been computed by:
    - P2's forecasting/S&OP pipeline
    - PR1's OR-Tools optimizer and risk model
"""

import os
import json
from dataclasses import dataclass, field
from typing import Optional

from google import genai
from google.genai import types

from dotenv import load_dotenv
load_dotenv()


class MissingDataError(Exception):
    """Raised when required input data is missing. We refuse to guess."""
    pass


@dataclass
class ExplanationInput:
    forecast: dict
    inventory: dict
    material_requirement: dict
    supplier_allocation: dict
    supplier_risk: dict
    cost: dict
    material_id: Optional[str] = None


@dataclass
class ExplanationOutput:
    summary: str
    key_risks: list
    explanation_of_allocation: str
    recommended_management_action: str
    raw_model_response: str = field(repr=False, default="")


REQUIRED_TOP_LEVEL_FIELDS = [
    "forecast", "inventory", "material_requirement",
    "supplier_allocation", "supplier_risk", "cost",
]

SYSTEM_INSTRUCTIONS = """You are an explanation layer for a supply-chain \
procurement system, not a decision-maker.

STRICT RULES — violating any of these makes your output unusable:
1. You must ONLY reference numbers, supplier names, and quantities that \
appear in the JSON input provided to you. Never invent, estimate, or \
round in a way that changes a figure.
2. You must NEVER override, second-guess, or propose an alternative to the \
supplier allocation that OR-Tools already computed. Your job is to explain \
it, not redesign it.
3. You must NEVER make an independent procurement decision (e.g. "switch \
to Supplier X instead"). You may only explain why the existing decision \
makes sense given cost, lead time, quality, OTD, and risk scores.
4. If a number is missing from the input, say so explicitly rather than \
filling it in.

Respond ONLY with valid JSON matching this exact shape, with no markdown \
fences and no preamble:
{
  "summary": "<2-3 sentence plain-English summary>",
  "key_risks": ["<risk 1>", "<risk 2>", "..."],
  "explanation_of_allocation": "<why the allocation looks the way it does, \
citing actual supplier_ids/quantities/scores from the input>",
  "recommended_management_action": "<one concrete, non-procurement-overriding \
recommendation, e.g. what to monitor or escalate>"
}
"""


def _validate_input(data: ExplanationInput) -> None:
    as_dict = data.__dict__
    missing = [f for f in REQUIRED_TOP_LEVEL_FIELDS if not as_dict.get(f)]
    if missing:
        raise MissingDataError(
            f"Cannot generate explanation — missing required input: {missing}. "
            "This module does not fabricate data for missing fields."
        )


def _build_user_prompt(data: ExplanationInput) -> str:
    payload = {
        "material_id": data.material_id,
        "forecast": data.forecast,
        "inventory": data.inventory,
        "material_requirement": data.material_requirement,
        "supplier_allocation": data.supplier_allocation,
        "supplier_risk": data.supplier_risk,
        "cost": data.cost,
    }
    return (
        "Here is the real, already-computed data for this procurement "
        "decision. Explain it according to your system instructions.\n\n"
        f"{json.dumps(payload, indent=2)}"
    )

def build_explanation_input(
    material_requirement: dict,
    optimization_response: dict,
    risk_predictions: list,
    demand_forecast: list,
    inventory_rows: list,
) -> ExplanationInput:
    """
    Maps raw backend/DB-shaped payloads into an ExplanationInput.
    Field names here match database/schema.sql and backend/app/models/schemas.py
    exactly, so real API responses can be passed straight through with no renaming.

    Expected shapes:
      material_requirement -> matches the material_requirements table /
          MaterialRequirementContract: material_id, required_quantity,
          required_date, plant_id, priority

      optimization_response -> matches POST /api/procurement/optimize response /
          the supplier_allocations table: material_id, required_quantity,
          total_allocated, total_cost,
          allocation: [{supplier_id, quantity, percentage, unit_price, risk_score}]
          (P3's real optimizer additionally includes total_cost, quality_score,
          otd_score, lead_time_days, expected_delivery_date per line — all
          passed through untouched if present)

      risk_predictions -> list of dicts matching the risk_predictions table,
          one per supplier: {supplier_id, material_id, delay_probability,
          predicted_delay_days, risk_level, model_version}
          (risk_score is not a DB column — it's a computed API field, so we
          fall back gracefully if it's missing)

      demand_forecast -> list of dicts matching the demand_forecast table:
          {sku, forecast_date, forecast_quantity, confidence, model_version}

      inventory_rows -> list of dicts matching the inventory table:
          {sku, location, quantity, reserved_quantity}
    """
    risk_by_supplier = {
        row["supplier_id"]: {
            "material_id": row.get("material_id"),
            "delay_probability": row.get("delay_probability"),
            "predicted_delay_days": row.get("predicted_delay_days"),
            "risk_level": row.get("risk_level"),
            "risk_score": row.get("risk_score"),  # may be absent — table has no such column
        }
        for row in risk_predictions
    }

    return ExplanationInput(
        material_id=material_requirement.get("material_id"),
        forecast={"forecasts": demand_forecast},
        inventory={"inventory": inventory_rows},
        material_requirement=material_requirement,
        supplier_allocation=optimization_response,
        supplier_risk=risk_by_supplier,
        cost={"total_cost": optimization_response.get("total_cost")},
    )    


def generate_explanation(data: ExplanationInput) -> ExplanationOutput:
    _validate_input(data)

    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        raise EnvironmentError(
            "GEMINI_API_KEY environment variable is not set. "
            "Copy .env.example to .env and add your key."
        )

    client = genai.Client(api_key=api_key)

    response = client.models.generate_content(
        model="gemini-3.6-flash",
        contents=_build_user_prompt(data),
        config=types.GenerateContentConfig(
            system_instruction=SYSTEM_INSTRUCTIONS,
            temperature=0.2,
            response_mime_type="application/json",
        ),
    )

    raw_text = response.text

    try:
        parsed = json.loads(raw_text)
    except json.JSONDecodeError as e:
        raise ValueError(
            f"Model did not return valid JSON. Raw response: {raw_text}"
        ) from e

    required_output_keys = [
        "summary", "key_risks", "explanation_of_allocation",
        "recommended_management_action",
    ]
    missing_keys = [k for k in required_output_keys if k not in parsed]
    if missing_keys:
        raise ValueError(
            f"Model response missing expected keys: {missing_keys}. "
            f"Raw response: {raw_text}"
        )

    return ExplanationOutput(
        summary=parsed["summary"],
        key_risks=parsed["key_risks"],
        explanation_of_allocation=parsed["explanation_of_allocation"],
        recommended_management_action=parsed["recommended_management_action"],
        raw_model_response=raw_text,
    )


if __name__ == "__main__":
    # Schema-accurate manual smoke test. Field names below match
    # database/schema.sql and backend/app/models/schemas.py exactly.
    # Do NOT treat these numbers as real — replace with live API/DB
    # calls once P3's optimizer is merged.

    sample_material_requirement = {
        "material_id": "MAT001",
        "required_quantity": 30000,
        "required_date": "2026-10-15",
        "plant_id": "PLANT001",
        "priority": "HIGH",
    }

    sample_optimization_response = {
        "material_id": "MAT001",
        "required_quantity": 30000,
        "total_allocated": 30000,
        "total_cost": 4350000,
        "allocation": [
            {"supplier_id": "SUP001", "quantity": 15000, "percentage": 50.0,
             "unit_price": 145.0, "risk_score": 0.12},
            {"supplier_id": "SUP002", "quantity": 10000, "percentage": 33.33,
             "unit_price": 138.0, "risk_score": 0.28},
            {"supplier_id": "SUP004", "quantity": 5000, "percentage": 16.67,
             "unit_price": 150.0, "risk_score": 0.08},
        ],
    }

    sample_risk_predictions = [
        {"supplier_id": "SUP001", "material_id": "MAT001", "delay_probability": 0.08,
         "predicted_delay_days": 1, "risk_level": "LOW", "risk_score": 0.12},
        {"supplier_id": "SUP002", "material_id": "MAT001", "delay_probability": 0.22,
         "predicted_delay_days": 3, "risk_level": "MEDIUM", "risk_score": 0.28},
        {"supplier_id": "SUP004", "material_id": "MAT001", "delay_probability": 0.05,
         "predicted_delay_days": 0, "risk_level": "LOW", "risk_score": 0.08},
    ]

    sample_demand_forecast = [
        {"sku": "TW001", "forecast_date": "2026-10-01", "forecast_quantity": 12000,
         "confidence": 92.5, "model_version": "v1.0-baseline"},
    ]

    sample_inventory_rows = [
        {"sku": "TW001", "location": "PLANT001", "quantity": 22000, "reserved_quantity": 0},
    ]

    sample_input = build_explanation_input(
        material_requirement=sample_material_requirement,
        optimization_response=sample_optimization_response,
        risk_predictions=sample_risk_predictions,
        demand_forecast=sample_demand_forecast,
        inventory_rows=sample_inventory_rows,
    )

    result = generate_explanation(sample_input)
    print(json.dumps(result.__dict__, indent=2))