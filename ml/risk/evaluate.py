from __future__ import annotations
import json
from pathlib import Path
from sklearn.metrics import classification_report, confusion_matrix, roc_auc_score
from .features import clean_features, load_contracts_csv, load_performance_csv, merge_performance_and_contracts
from .model import SupplierRiskModel
ROOT = Path(__file__).resolve().parents[2]

def main() -> None:
    perf = load_performance_csv(ROOT / "data/sample/supplier_performance.csv")
    contracts = load_contracts_csv(ROOT / "data/sample/supplier_contracts.csv")
    df = clean_features(merge_performance_and_contracts(perf, contracts)).sort_values("observation_date")
    test = df.iloc[int(len(df)*0.8):]
    model = SupplierRiskModel.load(ROOT / "models/supplier_risk.joblib")
    s = model.predict_scores(test[model.feature_names])
    y = test["delay_flag"].astype(int); p = s["delivery_risk"]
    print(json.dumps({"classification_report": classification_report(y, p >= .5, output_dict=True, zero_division=0), "confusion_matrix": confusion_matrix(y, p >= .5).tolist(), "roc_auc": float(roc_auc_score(y, p)) if y.nunique()>1 else None}, indent=2))
if __name__ == "__main__": main()
