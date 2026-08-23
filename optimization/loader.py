from __future__ import annotations

from pathlib import Path
from typing import Dict, Iterable, List

import pandas as pd

from .schemas import SupplierMaterial

RISK_MAP: Dict[str, float] = {"LOW": 0.15, "MEDIUM": 0.50, "HIGH": 0.90}

REQUIRED_COLUMNS = {
    "supplier_id",
    "material_id",
    "unit_price",
    "capacity",
    "lead_time_days",
    "quality_score",
    "otd_score",
    "min_allocation",
    "max_allocation",
}


def load_supplier_materials(path: str | Path, suppliers_path: str | Path | None = None) -> List[SupplierMaterial]:
    path = Path(path)
    if not path.exists():
        raise FileNotFoundError(path)
    df = pd.read_csv(path)
    missing = REQUIRED_COLUMNS - set(df.columns)
    if missing:
        raise ValueError(f"Missing columns in {path}: {sorted(missing)}")

    risk_by_supplier: Dict[str, float] = {}
    if suppliers_path is not None:
        sp = Path(suppliers_path)
        if sp.exists():
            supplier_df = pd.read_csv(sp)
            if {"supplier_id", "risk_level"}.issubset(supplier_df.columns):
                risk_by_supplier = {
                    str(row.supplier_id): RISK_MAP.get(str(row.risk_level).upper(), 0.5)
                    for row in supplier_df.itertuples(index=False)
                }

    records: List[SupplierMaterial] = []
    for row in df.itertuples(index=False):
        max_allocation = None if pd.isna(row.max_allocation) else int(row.max_allocation)
        records.append(
            SupplierMaterial(
                supplier_id=str(row.supplier_id),
                material_id=str(row.material_id),
                unit_price=float(row.unit_price),
                capacity=int(row.capacity),
                lead_time_days=int(row.lead_time_days),
                quality_score=float(row.quality_score),
                otd_score=float(row.otd_score),
                min_allocation=int(row.min_allocation),
                max_allocation=max_allocation,
                risk_score=risk_by_supplier.get(str(row.supplier_id), 0.5),
            )
        )
    return records
