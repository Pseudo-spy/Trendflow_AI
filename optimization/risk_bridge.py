from __future__ import annotations

from pathlib import Path
from typing import Dict

import pandas as pd

from ml.risk.predict import generate_predictions
from .schemas import SupplierOption


def get_latest_ml_risk_scores(
    performance_csv: str | Path,
    model_path: str | Path,
) -> Dict[str, float]:
    """
    Generate the latest P3 supplier-risk predictions and return:

        {supplier_id: risk_score}

    The current P3 pipeline requires the supplier-contract CSV as an input,
    so it is resolved relative to the performance CSV location.
    """
    performance_csv = Path(performance_csv)
    model_path = Path(model_path)

    if not performance_csv.exists():
        raise FileNotFoundError(
            f"Performance CSV not found: {performance_csv}"
        )

    if not model_path.exists():
        raise FileNotFoundError(
            f"Risk model not found: {model_path}"
        )

    # Current project structure:
    #   data/sample/supplier_performance.csv
    #   data/sample/supplier_contracts.csv
    contracts_csv = performance_csv.with_name("supplier_contracts.csv")

    if not contracts_csv.exists():
        raise FileNotFoundError(
            f"Supplier contracts CSV not found: {contracts_csv}"
        )

    predictions = generate_predictions(
        model_path=model_path,
        performance_path=performance_csv,
        contracts_path=contracts_csv,
    )

    if predictions.empty:
        return {}

    required_columns = {"supplier_id", "risk_score"}
    missing = required_columns - set(predictions.columns)

    if missing:
        raise ValueError(
            f"P3 prediction output is missing required columns: {sorted(missing)}"
        )

    predictions = predictions.copy()
    predictions["supplier_id"] = predictions["supplier_id"].astype(str)
    predictions["risk_score"] = (
        pd.to_numeric(predictions["risk_score"], errors="coerce")
        .clip(0, 1)
    )

    predictions = predictions.dropna(
        subset=["supplier_id", "risk_score"]
    )

    return dict(
        zip(
            predictions["supplier_id"],
            predictions["risk_score"].astype(float),
        )
    )


def apply_ml_risk_scores(
    suppliers: list[SupplierOption],
    ml_scores: Dict[str, float],
) -> list[SupplierOption]:
    """
    Return a new supplier list with P3 ML risk scores applied.

    Suppliers without an ML prediction keep their existing risk_score.
    """
    updated: list[SupplierOption] = []

    for supplier in suppliers:
        new_risk = float(
            ml_scores.get(
                supplier.supplier_id,
                supplier.risk_score,
            )
        )

        new_risk = max(0.0, min(1.0, new_risk))

        # SupplierOption is a frozen dataclass, so construct a new object.
        updated.append(
            SupplierOption(
                supplier_id=supplier.supplier_id,
                supplier_name=supplier.supplier_name,
                material_id=supplier.material_id,
                unit_price=supplier.unit_price,
                capacity=supplier.capacity,
                lead_time_days=supplier.lead_time_days,
                quality_score=supplier.quality_score,
                otd_score=supplier.otd_score,
                min_allocation=supplier.min_allocation,
                max_allocation=supplier.max_allocation,
                risk_score=new_risk,
                risk_level=supplier.risk_level,
                delivery_risk=supplier.delivery_risk,
                quality_risk=supplier.quality_risk,
                contract_otd_target=supplier.contract_otd_target,
                contract_quality_target=supplier.contract_quality_target,
                contract_max_lead_time_days=supplier.contract_max_lead_time_days,
                contract_delay_penalty_rate=supplier.contract_delay_penalty_rate,
                contract_active=supplier.contract_active,
                approved=supplier.approved,
            )
        )

    return updated