from __future__ import annotations

import os
from typing import Any

import pandas as pd
from dotenv import load_dotenv

load_dotenv()


RISK_COLUMNS = [
    "supplier_id",
    "risk_score",
    "risk_level",
    "delivery_risk",
    "quality_risk",
    "prediction_date",
    "model_version",
    "generated_at",
]


class SupabaseRiskWriter:
    """Publish canonical P3 risk predictions to the shared Supabase table."""

    def __init__(self, table: str = "risk_predictions", url: str | None = None, key: str | None = None) -> None:
        self.table = table
        self.url = url or os.getenv("SUPABASE_URL")
        self.key = key or os.getenv("SUPABASE_SERVICE_ROLE_KEY") or os.getenv("SUPABASE_KEY")
        if not self.url or not self.key:
            raise RuntimeError("Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (or SUPABASE_KEY) in .env")
        from supabase import create_client
        self.client = create_client(self.url, self.key)

    @staticmethod
    def build_payload(predictions: pd.DataFrame) -> list[dict[str, Any]]:
        missing = [c for c in RISK_COLUMNS if c not in predictions.columns]
        if missing:
            raise ValueError(f"Missing required risk prediction columns: {missing}")
        payload = predictions[RISK_COLUMNS].copy()
        payload["prediction_date"] = payload["prediction_date"].astype(str)
        return payload.to_dict("records")

    def upsert(self, predictions: pd.DataFrame) -> list[dict[str, Any]]:
        records = self.build_payload(predictions)
        return self.client.table(self.table).upsert(records, on_conflict="supplier_id").execute().data or []
