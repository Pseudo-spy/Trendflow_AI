from __future__ import annotations

import json
from pathlib import Path

import pandas as pd

from .model import SupplierRiskModel

ROOT = Path(__file__).resolve().parents[2]


def _coefficients(pipeline, feature_names: list[str]) -> pd.DataFrame:
    clf = pipeline.named_steps["classifier"]
    coef = clf.coef_[0]
    return pd.DataFrame({"feature": feature_names, "coefficient": coef}).sort_values("coefficient", ascending=False)


def main() -> None:
    model = SupplierRiskModel.load(ROOT / "models/supplier_risk.joblib")
    out_dir = ROOT / "reports/risk"
    out_dir.mkdir(parents=True, exist_ok=True)
    delay = _coefficients(model.delay_model, model.feature_names)
    quality = _coefficients(model.quality_model, model.feature_names)
    delay.to_csv(out_dir / "delivery_risk_feature_effects.csv", index=False)
    quality.to_csv(out_dir / "quality_risk_feature_effects.csv", index=False)
    metadata = {
        "model_version": model.model_version,
        "risk_score_formula": "0.60 * delivery_risk + 0.40 * quality_risk",
        "thresholds": {"LOW": "<0.34", "MEDIUM": "0.34-<0.67", "HIGH": ">=0.67"},
    }
    (out_dir / "risk_explanation.json").write_text(json.dumps(metadata, indent=2), encoding="utf-8")
    print(json.dumps(metadata, indent=2))


if __name__ == "__main__":
    main()
