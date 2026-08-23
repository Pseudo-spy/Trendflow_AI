from __future__ import annotations

import argparse
import json
from pathlib import Path

from sklearn.metrics import accuracy_score, f1_score, precision_score, recall_score, roc_auc_score

from .features import load_performance_data, time_split
from .model import save_model, train_model
from .schemas import RISK_FEATURES


def main() -> None:
    parser = argparse.ArgumentParser(description="Train supplier delay risk model")
    parser.add_argument("--data", default="data/sample/supplier_performance.csv")
    parser.add_argument("--model", default="models/supplier_risk.joblib")
    parser.add_argument("--metadata", default="models/supplier_risk_metadata.json")
    args = parser.parse_args()

    df = load_performance_data(args.data)
    train_df, test_df = time_split(df)
    model = train_model(train_df)

    pred = model.predict(test_df[list(RISK_FEATURES)])
    prob = model.predict_proba(test_df[list(RISK_FEATURES)])[:, 1]
    metrics = {
        "accuracy": float(accuracy_score(test_df["delay_flag"], pred)),
        "precision": float(precision_score(test_df["delay_flag"], pred, zero_division=0)),
        "recall": float(recall_score(test_df["delay_flag"], pred, zero_division=0)),
        "f1": float(f1_score(test_df["delay_flag"], pred, zero_division=0)),
        "roc_auc": float(roc_auc_score(test_df["delay_flag"], prob)) if test_df["delay_flag"].nunique() > 1 else None,
        "train_rows": len(train_df),
        "test_rows": len(test_df),
        "features": list(RISK_FEATURES),
    }
    save_model(model, args.model)
    meta_path = Path(args.metadata)
    meta_path.parent.mkdir(parents=True, exist_ok=True)
    meta_path.write_text(json.dumps(metrics, indent=2), encoding="utf-8")
    print(json.dumps(metrics, indent=2))


if __name__ == "__main__":
    main()
