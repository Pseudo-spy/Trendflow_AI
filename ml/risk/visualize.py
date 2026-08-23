from __future__ import annotations
from pathlib import Path
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.metrics import ConfusionMatrixDisplay, RocCurveDisplay
from .features import clean_features, load_contracts_csv, load_performance_csv, merge_performance_and_contracts
from .model import SupplierRiskModel
ROOT = Path(__file__).resolve().parents[2]
REPORTS = ROOT / "reports/risk"

def generate_diagnostics() -> None:
    REPORTS.mkdir(parents=True, exist_ok=True)
    perf = load_performance_csv(ROOT/"data/sample/supplier_performance.csv")
    contracts = load_contracts_csv(ROOT/"data/sample/supplier_contracts.csv")
    df = clean_features(merge_performance_and_contracts(perf, contracts)).sort_values("observation_date")
    test = df.iloc[int(len(df)*0.8):]
    model = SupplierRiskModel.load(ROOT/"models/supplier_risk.joblib")
    scores = model.predict_scores(test[model.feature_names]); y=test["delay_flag"].astype(int)
    pred = scores["delivery_risk"] >= .5
    fig, ax = plt.subplots(figsize=(7,5)); ConfusionMatrixDisplay.from_predictions(y,pred,ax=ax); ax.set_title("Supplier Delivery Risk — Confusion Matrix"); fig.tight_layout(); fig.savefig(REPORTS/"confusion_matrix.png",dpi=160); plt.close(fig)
    fig, ax = plt.subplots(figsize=(7,5)); RocCurveDisplay.from_predictions(y,scores["delivery_risk"],ax=ax); ax.set_title("Supplier Delivery Risk — ROC Curve"); fig.tight_layout(); fig.savefig(REPORTS/"roc_curve.png",dpi=160); plt.close(fig)
    fig, ax = plt.subplots(figsize=(8,5)); sns.histplot(scores,x="risk_score",hue="risk_level",bins=12,multiple="stack",ax=ax); ax.set_title("Supplier Risk Score Distribution"); fig.tight_layout(); fig.savefig(REPORTS/"risk_score_distribution.png",dpi=160); plt.close(fig)
if __name__ == "__main__": generate_diagnostics()
