from pathlib import Path

from ml.risk.features import load_performance_data, time_split
from ml.risk.model import train_model
from ml.risk.schemas import RISK_FEATURES

ROOT = Path(__file__).resolve().parents[2]


def test_risk_model_trains() -> None:
    df = load_performance_data(ROOT / "data/sample/supplier_performance.csv")
    train_df, test_df = time_split(df)
    model = train_model(train_df)
    probabilities = model.predict_proba(test_df[list(RISK_FEATURES)])[:, 1]
    assert len(probabilities) == len(test_df)
    assert ((probabilities >= 0) & (probabilities <= 1)).all()
