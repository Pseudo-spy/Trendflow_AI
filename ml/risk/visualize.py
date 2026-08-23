from __future__ import annotations

from pathlib import Path

import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.metrics import ConfusionMatrixDisplay, RocCurveDisplay

from .features import load_performance_data, time_split
from .model import load_model
from .schemas import RISK_FEATURES


def generate_diagnostics(data_path: str, model_path: str, output_dir: str = "reports/risk") -> None:
    df = load_performance_data(data_path)
    _, test_df = time_split(df)
    model = load_model(model_path)
    X = test_df[list(RISK_FEATURES)]
    y = test_df["delay_flag"]
    pred = model.predict(X)
    prob = model.predict_proba(X)[:, 1]

    out = Path(output_dir)
    out.mkdir(parents=True, exist_ok=True)

    fig, ax = plt.subplots(figsize=(7, 6))
    ConfusionMatrixDisplay.from_predictions(y, pred, ax=ax)
    ax.set_title("Supplier Delay Risk - Confusion Matrix")
    fig.tight_layout()
    fig.savefig(out / "confusion_matrix.png", dpi=160)
    plt.close(fig)

    if y.nunique() > 1:
        fig, ax = plt.subplots(figsize=(7, 6))
        RocCurveDisplay.from_predictions(y, prob, ax=ax)
        ax.set_title("Supplier Delay Risk - ROC Curve")
        fig.tight_layout()
        fig.savefig(out / "roc_curve.png", dpi=160)
        plt.close(fig)

    fig, ax = plt.subplots(figsize=(8, 5))
    sns.histplot(prob, bins=20, kde=True, ax=ax)
    ax.set_title("Predicted Delay Probability Distribution")
    ax.set_xlabel("Delay Probability")
    fig.tight_layout()
    fig.savefig(out / "probability_distribution.png", dpi=160)
    plt.close(fig)
