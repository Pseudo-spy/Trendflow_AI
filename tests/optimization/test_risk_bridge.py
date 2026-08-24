from pathlib import Path
from optimization.risk_bridge import get_latest_ml_risk_scores, apply_ml_risk_scores
from optimization.loader import load_supplier_materials

ROOT = Path(__file__).resolve().parents[2]


def test_ml_risk_scores_are_valid_probabilities():
    scores = get_latest_ml_risk_scores(
        ROOT / "data/sample/supplier_performance.csv",
        ROOT / "models/supplier_risk.joblib",
    )
    assert len(scores) > 0
    for supplier_id, score in scores.items():
        assert 0.0 <= score <= 1.0


def test_apply_ml_risk_scores_overrides_matching_suppliers():
    suppliers = load_supplier_materials(
        ROOT / "data/sample/supplier_materials.csv",
        ROOT / "data/sample/suppliers.csv",
    )
    fake_scores = {suppliers[0].supplier_id: 0.99}
    updated = apply_ml_risk_scores(suppliers, fake_scores)

    updated_target = next(s for s in updated if s.supplier_id == suppliers[0].supplier_id)
    assert updated_target.risk_score == 0.99

    if len(suppliers) > 1:
        untouched = next(s for s in updated if s.supplier_id == suppliers[1].supplier_id)
        assert untouched.risk_score == suppliers[1].risk_score