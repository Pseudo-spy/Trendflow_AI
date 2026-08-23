from pathlib import Path

import pandas as pd

from ml.risk.predict import generate_predictions
from risk_service.supabase_writer import SupabaseRiskWriter, RISK_COLUMNS

ROOT = Path(__file__).resolve().parents[2]


def _predictions():
    return generate_predictions(
        ROOT / "models/supplier_risk.joblib",
        ROOT / "data/sample/supplier_performance.csv",
        ROOT / "data/sample/supplier_contracts.csv",
    )


def test_supabase_payload_contract():
    records = SupabaseRiskWriter.build_payload(_predictions())
    assert records
    assert all(set(record) == set(RISK_COLUMNS) for record in records)


def test_supabase_payload_is_json_safe():
    records = SupabaseRiskWriter.build_payload(_predictions())
    assert all(isinstance(r["supplier_id"], str) for r in records)
    assert all(isinstance(r["risk_score"], float) for r in records)
    assert all(r["risk_level"] in {"LOW", "MEDIUM", "HIGH"} for r in records)
