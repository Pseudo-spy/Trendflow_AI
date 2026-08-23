from __future__ import annotations
from dataclasses import dataclass
from pathlib import Path
import joblib
import numpy as np
import pandas as pd
from sklearn.impute import SimpleImputer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from .features import ALL_FEATURES

MODEL_VERSION = "p3-risk-v2"

@dataclass
class ModelBundle:
    delay_model: Pipeline
    quality_model: Pipeline
    feature_names: list[str]
    model_version: str

class SupplierRiskModel:
    def __init__(self, model_version: str = MODEL_VERSION) -> None:
        self.model_version = model_version
        self.feature_names = ALL_FEATURES.copy()
        self.delay_model = self._make_pipeline()
        self.quality_model = self._make_pipeline()
        self.is_fitted = False

    @staticmethod
    def _make_pipeline() -> Pipeline:
        return Pipeline([
            ("imputer", SimpleImputer(strategy="median")),
            ("scaler", StandardScaler()),
            ("classifier", LogisticRegression(max_iter=1500, class_weight="balanced", random_state=42)),
        ])

    def fit(self, X: pd.DataFrame, y_delay: pd.Series, y_quality: pd.Series) -> "SupplierRiskModel":
        X2 = X[self.feature_names]
        if y_delay.nunique() < 2 or y_quality.nunique() < 2:
            raise ValueError("Both risk targets must contain at least two classes.")
        self.delay_model.fit(X2, y_delay.astype(int))
        self.quality_model.fit(X2, y_quality.astype(int))
        self.is_fitted = True
        return self

    def predict_scores(self, X: pd.DataFrame) -> pd.DataFrame:
        if not self.is_fitted:
            raise RuntimeError("Risk model is not fitted.")
        X2 = X[self.feature_names]
        delivery = self.delay_model.predict_proba(X2)[:, 1]
        quality = self.quality_model.predict_proba(X2)[:, 1]
        overall = np.clip(0.60 * delivery + 0.40 * quality, 0.0, 1.0)
        level = np.select([overall >= 0.67, overall >= 0.34], ["HIGH", "MEDIUM"], default="LOW")
        return pd.DataFrame({
            "delivery_risk": delivery,
            "quality_risk": quality,
            "risk_score": overall,
            "risk_level": level,
        }, index=X.index)

    def save(self, path: str | Path) -> None:
        if not self.is_fitted:
            raise RuntimeError("Cannot save an unfitted model.")
        joblib.dump(ModelBundle(self.delay_model, self.quality_model, self.feature_names, self.model_version), path)

    @classmethod
    def load(cls, path: str | Path) -> "SupplierRiskModel":
        bundle: ModelBundle = joblib.load(path)
        m = cls(bundle.model_version)
        m.delay_model, m.quality_model = bundle.delay_model, bundle.quality_model
        m.feature_names = bundle.feature_names
        m.is_fitted = True
        return m
