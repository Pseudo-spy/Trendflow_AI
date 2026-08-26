from __future__ import annotations
import json
from pathlib import Path
from sklearn.metrics import accuracy_score, f1_score, precision_score, recall_score, roc_auc_score
from .features import clean_features, load_contracts_csv, load_performance_csv, make_quality_risk_flag, merge_performance_and_contracts
from .model import SupplierRiskModel
ROOT = Path(__file__).resolve().parents[2]

def main() -> None:
    data_dir = ROOT / "data/sample"
    model_dir = ROOT / "models"; model_dir.mkdir(exist_ok=True)
    perf = load_performance_csv(data_dir / "supplier_performance.csv")
    contracts = load_contracts_csv(data_dir / "supplier_contracts.csv")
    df = clean_features(merge_performance_and_contracts(perf, contracts)).sort_values("observation_date")
    split = int(len(df) * 0.80)
    train_df, test_df = df.iloc[:split], df.iloc[split:]
    model = SupplierRiskModel()
    model.fit(train_df[model.feature_names], train_df["delay_flag"], make_quality_risk_flag(train_df))
    scores = model.predict_scores(test_df[model.feature_names])
    y = test_df["delay_flag"].astype(int)
    p = scores["delivery_risk"]
    metrics = {
        "model_version": model.model_version,
        "accuracy": float(accuracy_score(y, p >= 0.5)),
        "precision": float(precision_score(y, p >= 0.5, zero_division=0)),
        "recall": float(recall_score(y, p >= 0.5, zero_division=0)),
        "f1": float(f1_score(y, p >= 0.5, zero_division=0)),
        "roc_auc": float(roc_auc_score(y, p)) if y.nunique() > 1 else None,
        "train_rows": len(train_df), "test_rows": len(test_df),
        "features": model.feature_names,
    }
    model.save(model_dir / "supplier_risk.joblib")
    (model_dir / "supplier_risk_metadata.json").write_text(json.dumps(metrics, indent=2), encoding="utf-8")
    print(json.dumps(metrics, indent=2))

if __name__ == "__main__": main()
