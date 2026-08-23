"""
Bridges the trained supplier-risk ML model (ml/risk/) into the optimizer's
SupplierMaterial.risk_score, replacing the static LOW/MEDIUM/HIGH lookup in
loader.py with real predicted delay probabilities wherever a supplier has
recent performance data.

Falls back to the existing static risk_score (from loader.py's RISK_MAP)
for any supplier not covered by the performance dataset, so this never
breaks the optimizer if ML data is incomplete.
"""
from __future__ import annotations

from pathlib import Path
from typing import Dict, List

import pandas as pd

from ml.risk.predict import predict_risk
from .schemas import SupplierMaterial


def get_latest_ml_risk_scores(
    performance_csv: str | Path,
    model_path: str | Path,
) -> Dict[str, float]:
    """
    Returns {supplier_id: delay_probability}, using each supplier's most
    recent observation, scored by the trained risk model.
    """
    df = pd.read_csv(performance_csv)
    df["observation_date"] = pd.to_datetime(df["observation_date"])
    latest = df.sort_values("observation_date").groupby("supplier_id").tail(1)

    scored = predict_risk(model_path, latest)
    return dict(zip(scored["supplier_id"], scored["delay_probability"]))


def apply_ml_risk_scores(
    suppliers: List[SupplierMaterial],
    ml_scores: Dict[str, float],
) -> List[SupplierMaterial]:
    """
    Returns a new supplier list with risk_score replaced by the ML-predicted
    delay_probability wherever available. SupplierMaterial is a frozen
    dataclass, so we rebuild rather than mutate in place.
    """
    updated = []
    for s in suppliers:
        new_risk = ml_scores.get(s.supplier_id, s.risk_score)
        updated.append(
            SupplierMaterial(
                supplier_id=s.supplier_id,
                material_id=s.material_id,
                unit_price=s.unit_price,
                capacity=s.capacity,
                lead_time_days=s.lead_time_days,
                quality_score=s.quality_score,
                otd_score=s.otd_score,
                min_allocation=s.min_allocation,
                max_allocation=s.max_allocation,
                risk_score=new_risk,
            )
        )
    return updated


if __name__ == "__main__":
    from datetime import date
    from .loader import load_supplier_materials
    from .supplier_allocation import SupplierAllocationOptimizer
    from .schemas import AllocationRequest

    root = Path(__file__).resolve().parents[1]
    suppliers = load_supplier_materials(
        root / "data/sample/supplier_materials.csv",
        root / "data/sample/suppliers.csv",
    )

    ml_scores = get_latest_ml_risk_scores(
        root / "data/sample/supplier_performance.csv",
        root / "models/supplier_risk.joblib",
    )
    print("ML-predicted risk scores:", ml_scores)

    suppliers_with_ml_risk = apply_ml_risk_scores(suppliers, ml_scores)

    request = AllocationRequest(
        material_id="MAT001",
        required_quantity=30_000,
        required_date=date(2026, 10, 15),
        plant_id="PLANT001",
        priority="HIGH",
    )

    static_result = SupplierAllocationOptimizer().optimize(request, suppliers, current_date=date(2026, 8, 23))
    ml_result = SupplierAllocationOptimizer().optimize(request, suppliers_with_ml_risk, current_date=date(2026, 8, 23))

    print("\n--- Allocation with STATIC risk_level ---")
    print(static_result)
    print("\n--- Allocation with ML-predicted risk ---")
    print(ml_result)