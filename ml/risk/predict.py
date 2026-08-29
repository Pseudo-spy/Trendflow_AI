from __future__ import annotations
import argparse
from datetime import datetime, timezone
from pathlib import Path
import pandas as pd
from .features import clean_features, latest_supplier_snapshot, load_performance_csv, merge_performance_and_contracts
from .model import SupplierRiskModel
from .schemas import RiskPrediction
ROOT = Path(__file__).resolve().parents[2]

def generate_predictions(model_path: str | Path, performance_path: str | Path, contracts_path: str | Path | None = None) -> pd.DataFrame:
    perf = load_performance_csv(performance_path)
    df = clean_features(merge_performance_and_contracts(perf, pd.DataFrame()))
    latest = latest_supplier_snapshot(df).reset_index(drop=True)
    model = SupplierRiskModel.load(model_path)
    scores = model.predict_scores(latest[model.feature_names]).reset_index(drop=True)
    ts = datetime.now(timezone.utc).isoformat()
    out = pd.DataFrame({
        "supplier_id": latest["supplier_id"].astype(str),
        "risk_score": scores["risk_score"].round(6),
        "risk_level": scores["risk_level"],
        "delivery_risk": scores["delivery_risk"].round(6),
        "quality_risk": scores["quality_risk"].round(6),
        "prediction_date": latest["observation_date"].dt.date,
        "model_version": model.model_version,
        "generated_at": ts,
    })
    for row in out.to_dict("records"):
        RiskPrediction(**row)
    return out

def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--model", default=str(ROOT / "models/supplier_risk.joblib"))
    parser.add_argument("--performance", default=str(ROOT / "data/sample/supplier_performance.csv"))
    parser.add_argument("--output", default=str(ROOT / "reports/risk_predictions.csv"))
    args = parser.parse_args()
    out = generate_predictions(args.model, args.performance)
    Path(args.output).parent.mkdir(parents=True, exist_ok=True)
    out.to_csv(args.output, index=False)
    print(out.to_string(index=False))

if __name__ == "__main__": main()

