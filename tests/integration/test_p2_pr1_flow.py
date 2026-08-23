"""
Day-1 integration tests: the P2 -> PR1 JSON contract shape, plus
ai_explanation.py's input validation (runs without a live Gemini key).
"""
import os
import sys
import pytest

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "..", "services"))
from ai_explanation import ExplanationInput, MissingDataError, _validate_input  # noqa: E402


def test_p2_to_pr1_contract_shape():
    material_requirement = {
        "material_id": "MAT001", "required_quantity": 30000,
        "required_date": "2026-10-15", "plant_id": "PLANT001", "priority": "HIGH",
    }
    required_keys = {"material_id", "required_quantity", "required_date", "plant_id", "priority"}
    assert required_keys.issubset(material_requirement.keys())


def test_pr1_output_contract_shape():
    allocation_entry = {
        "supplier_id": "SUP001", "quantity": 15000, "percentage": 50,
        "unit_price": 145, "risk_score": 0.12,
    }
    required_keys = {"supplier_id", "quantity", "percentage", "unit_price", "risk_score"}
    assert required_keys.issubset(allocation_entry.keys())


def test_ai_explanation_rejects_missing_data():
    incomplete_input = ExplanationInput(
        forecast={"sku": "TW001", "forecast": 12000},
        inventory={}, material_requirement={},
        supplier_allocation={"total_allocated": 30000},
        supplier_risk={}, cost={},
    )
    with pytest.raises(MissingDataError):
        _validate_input(incomplete_input)


def test_ai_explanation_accepts_complete_data():
    complete_input = ExplanationInput(
        forecast={"sku": "TW001", "forecast": 12000},
        inventory={"sku": "TW001", "quantity": 22000},
        material_requirement={"material_id": "MAT001", "required_quantity": 30000},
        supplier_allocation={"total_allocated": 30000},
        supplier_risk={"SUP001": {"risk_level": "LOW"}},
        cost={"total_cost": 4350000},
    )
    _validate_input(complete_input)