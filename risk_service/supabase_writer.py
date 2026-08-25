from __future__ import annotations

import os
from typing import Any

import pandas as pd
from dotenv import load_dotenv

load_dotenv()


# Canonical P3 output contract.
# Existing tests and downstream P3 consumers use this shape.
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
    """
    Publish canonical P3 risk predictions to the existing shared
    Supabase risk_predictions table.

    Canonical P3 payload:
        supplier_id
        risk_score
        risk_level
        delivery_risk
        quality_risk
        prediction_date
        model_version
        generated_at

    Live Supabase mapping:
        risk_score    -> delay_probability
        generated_at  -> created_at
        supplier_id   -> supplier_id
        risk_level    -> risk_level
        delivery_risk -> delivery_risk
    """

    def __init__(
        self,
        table: str = "risk_predictions",
        url: str | None = None,
        key: str | None = None,
    ) -> None:
        self.table = table
        self.url = url or os.getenv("SUPABASE_URL")
        self.key = (
            key
            or os.getenv("SUPABASE_SERVICE_ROLE_KEY")
            or os.getenv("SUPABASE_KEY")
        )

        if not self.url or not self.key:
            raise RuntimeError(
                "Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY "
                "(or SUPABASE_KEY) in .env"
            )

        from supabase import create_client

        self.client = create_client(self.url, self.key)

    @staticmethod
    def build_payload(
        predictions: pd.DataFrame,
    ) -> list[dict[str, Any]]:
        """
        Build the canonical P3 payload.

        This function intentionally keeps the P3 contract independent
        from the current Supabase database schema.
        """
        missing = [
            column
            for column in RISK_COLUMNS
            if column not in predictions.columns
        ]

        if missing:
            raise ValueError(
                f"Missing required risk prediction columns: {missing}"
            )

        payload: list[dict[str, Any]] = []

        for row in predictions.to_dict(orient="records"):
            payload.append(
                {
                    "supplier_id": str(row["supplier_id"]),
                    "risk_score": float(row["risk_score"]),
                    "risk_level": str(row["risk_level"]).upper(),
                    "delivery_risk": float(row["delivery_risk"]),
                    "quality_risk": float(row["quality_risk"]),
                    "prediction_date": str(row["prediction_date"]),
                    "model_version": str(row["model_version"]),
                    "generated_at": str(row["generated_at"]),
                }
            )

        return payload

    @staticmethod
    def _to_supabase_payload(
        canonical_records: list[dict[str, Any]],
    ) -> list[dict[str, Any]]:
        """
        Translate the canonical P3 contract into the current live
        Supabase risk_predictions schema.
        """
        rows: list[dict[str, Any]] = []

        for record in canonical_records:
            rows.append(
                {
                    "supplier_id": record["supplier_id"],
                    # P3 is supplier-level, so material_id is intentionally
                    # NULL in the shared historical table.
                    "material_id": None,
                    "delay_probability": float(record["risk_score"]),
                    "risk_level": record["risk_level"],
                    "delivery_risk": float(record["delivery_risk"]),
                    "model_version": record["model_version"],
                    "created_at": record["generated_at"],
                }
            )

        return rows

    def insert(
        self,
        predictions: pd.DataFrame,
    ) -> list[dict[str, Any]]:
        """
        Insert canonical P3 predictions into the existing Supabase table.

        supplier_id is not unique in the shared table, so INSERT is used
        instead of UPSERT.
        """
        canonical_records = self.build_payload(predictions)
        database_rows = self._to_supabase_payload(canonical_records)

        response = (
            self.client
            .table(self.table)
            .insert(database_rows)
            .execute()
        )

        return response.data or []

    def upsert(
        self,
        predictions: pd.DataFrame,
    ) -> list[dict[str, Any]]:
        """
        Backward-compatible public method.

        The live table uses an auto-generated primary key and supplier_id
        is not unique, so the operation is INSERT.
        """
        return self.insert(predictions)