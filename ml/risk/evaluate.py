from __future__ import annotations

import argparse
import json

from sklearn.metrics import classification_report, confusion_matrix, roc_auc_score

from .features import load_performance_data, time_split
from .model import load_model
from .schemas import RISK_FEATURES


def main() -> None:
    parser = argparse.ArgumentParser(description="Evaluate supplier risk model")
    parser.add_argument("--data", default="data/sample/supplier_performance.csv")
    parser.add_argument("--model", default="models/supplier_risk.joblib")
    args = parser.parse_args()

    df = load_performance_data(args.data)
    _, test_df = time_split(df)
    model = load_model(args.model)
    X = test_df[list(RISK_FEATURES)]
    y = test_df["delay_flag"]
    pred = model.predict(X)
    prob = model.predict_proba(X)[:, 1]

    payload = {
        "classification_report": classification_report(y, pred, output_dict=True, zero_division=0),
        "confusion_matrix": confusion_matrix(y, pred).tolist(),
        "roc_auc": float(roc_auc_score(y, prob)) if y.nunique() > 1 else None,
    }
    print(json.dumps(payload, indent=2))


if __name__ == "__main__":
    main()
