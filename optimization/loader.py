from __future__ import annotations

from pathlib import Path

import pandas as pd

from .schemas import AllocationRequest, SupplierOption


REQUIRED_MATERIAL_COLUMNS = {
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

REQUIRED_SUPPLIER_COLUMNS = {
    "supplier_id",
    "supplier_name",
}




def _read_csv(path: str | Path) -> pd.DataFrame:
    """Read a CSV file and fail clearly when it does not exist."""
    path = Path(path)

    if not path.exists():
        raise FileNotFoundError(f"CSV file not found: {path}")

    if not path.is_file():
        raise ValueError(f"Expected a file but got: {path}")

    return pd.read_csv(path)


def _validate_columns(
    df: pd.DataFrame,
    required: set[str],
    name: str,
) -> None:
    """Validate required columns."""
    missing = sorted(required - set(df.columns))

    if missing:
        raise ValueError(f"{name} is missing required columns: {missing}")


def _risk_frame(df: pd.DataFrame) -> pd.DataFrame:
    """
    Normalize the P3 risk prediction data.

    P3 is the source of truth for:
    - risk_score
    - risk_level
    - delivery_risk
    - quality_risk
    """
    _validate_columns(df, {"supplier_id"}, "risk_predictions")

    df = df.copy()

    # Support both the current P3 contract and the older delay_probability
    # field for backward compatibility.
    if "risk_score" not in df.columns:
        if "delay_probability" in df.columns:
            df["risk_score"] = df["delay_probability"]
        else:
            raise ValueError(
                "risk_predictions must contain "
                "'risk_score' or 'delay_probability'"
            )

    df["risk_score"] = (
        pd.to_numeric(df["risk_score"], errors="coerce")
        .fillna(1.0)
        .clip(0, 1)
    )

    if "delivery_risk" not in df.columns:
        df["delivery_risk"] = df["risk_score"]

    if "quality_risk" not in df.columns:
        df["quality_risk"] = df["risk_score"]

    df["delivery_risk"] = (
        pd.to_numeric(df["delivery_risk"], errors="coerce")
        .fillna(df["risk_score"])
        .clip(0, 1)
    )

    df["quality_risk"] = (
        pd.to_numeric(df["quality_risk"], errors="coerce")
        .fillna(df["risk_score"])
        .clip(0, 1)
    )

    # Preserve P3's explicit risk_level whenever it exists.
    # Only derive it when the P3 file does not provide one.
    if "risk_level" not in df.columns:
        df["risk_level"] = (
            pd.cut(
                df["risk_score"],
                bins=[-0.01, 0.33, 0.66, 1.01],
                labels=["LOW", "MEDIUM", "HIGH"],
            )
            .astype(str)
        )

    df["risk_level"] = (
        df["risk_level"]
        .fillna("")
        .astype(str)
        .str.strip()
        .str.upper()
    )

    # Repair only missing/invalid labels.
    valid_levels = {"LOW", "MEDIUM", "HIGH"}
    invalid_mask = ~df["risk_level"].isin(valid_levels)

    if invalid_mask.any():
        derived_levels = pd.cut(
            df.loc[invalid_mask, "risk_score"],
            bins=[-0.01, 0.33, 0.66, 1.01],
            labels=["LOW", "MEDIUM", "HIGH"],
        ).astype(str)

        df.loc[invalid_mask, "risk_level"] = derived_levels

    return df[
        [
            "supplier_id",
            "risk_score",
            "risk_level",
            "delivery_risk",
            "quality_risk",
        ]
    ]


def load_supplier_options(
    supplier_materials_csv: str | Path,
    suppliers_csv: str | Path,
    risk_predictions_csv: str | Path | None = None,
    supplier_contracts_csv: str | Path | None = None,
    material_id: str | None = None,
) -> list[SupplierOption]:
    """
    Load and combine all P4 supplier inputs.

    Data sources:
    - supplier_materials.csv
    - suppliers.csv
    - supplier_contracts.csv
    - P3 risk_predictions.csv

    P3 ML risk is the source of truth for risk fields.
    """
    materials = _read_csv(supplier_materials_csv)
    suppliers = _read_csv(suppliers_csv)

    _validate_columns(
        materials,
        REQUIRED_MATERIAL_COLUMNS,
        "supplier_materials",
    )
    _validate_columns(
        suppliers,
        REQUIRED_SUPPLIER_COLUMNS,
        "suppliers",
    )

    # Material/supplier master data.
    merged = materials.merge(
        suppliers,
        on="supplier_id",
        how="left",
        validate="many_to_one",
    )

    if merged["supplier_name"].isna().any():
        bad = (
            merged.loc[
                merged["supplier_name"].isna(),
                "supplier_id",
            ]
            .astype(str)
            .tolist()
        )
        raise ValueError(f"Unknown supplier_id(s): {bad}")

    if material_id is not None:
        merged = merged.loc[
            merged["material_id"] == material_id
        ].copy()

    if merged.empty:
        raise ValueError(
            f"No supplier-material records found for material_id={material_id!r}"
        )

    # Contract data.
    merged["contract_active"] = 1

    # P3 risk data.
    if risk_predictions_csv:
        risk = _risk_frame(
            _read_csv(risk_predictions_csv)
        )

        # suppliers.csv may contain a static/stale risk_level.
        # Remove it so P3's ML risk becomes the single source of truth.
        merged = merged.drop(
            columns=["risk_level"],
            errors="ignore",
        )

        merged = merged.merge(
            risk,
            on="supplier_id",
            how="left",
            validate="many_to_one",
        )
    else:
        # Safe defaults when no P3 risk file is supplied.
        merged["risk_score"] = 0.0
        merged["risk_level"] = "LOW"
        merged["delivery_risk"] = 0.0
        merged["quality_risk"] = 0.0

    # Normalize numeric risk fields after merge.
    merged["risk_score"] = (
        pd.to_numeric(
            merged["risk_score"],
            errors="coerce",
        )
        .fillna(1.0)
        .clip(0, 1)
    )

    merged["delivery_risk"] = (
        pd.to_numeric(
            merged["delivery_risk"],
            errors="coerce",
        )
        .fillna(merged["risk_score"])
        .clip(0, 1)
    )

    merged["quality_risk"] = (
        pd.to_numeric(
            merged["quality_risk"],
            errors="coerce",
        )
        .fillna(merged["risk_score"])
        .clip(0, 1)
    )

    # Normalize the risk-level label.
    merged["risk_level"] = (
        merged["risk_level"]
        .fillna("")
        .astype(str)
        .str.strip()
        .str.upper()
    )

    valid_levels = {"LOW", "MEDIUM", "HIGH"}
    invalid_level_mask = ~merged["risk_level"].isin(valid_levels)

    if invalid_level_mask.any():
        derived_levels = pd.cut(
            merged.loc[
                invalid_level_mask,
                "risk_score",
            ],
            bins=[-0.01, 0.33, 0.66, 1.01],
            labels=["LOW", "MEDIUM", "HIGH"],
        ).astype(str)

        merged.loc[
            invalid_level_mask,
            "risk_level",
        ] = derived_levels

    options: list[SupplierOption] = []

    for row in merged.to_dict(orient="records"):
        capacity = int(row["capacity"])
        max_allocation = min(
            int(row["max_allocation"]),
            capacity,
        )

        options.append(
            SupplierOption(
                supplier_id=str(row["supplier_id"]),
                supplier_name=str(row["supplier_name"]),
                material_id=str(row["material_id"]),
                unit_price=float(row["unit_price"]),
                capacity=capacity,
                lead_time_days=int(row["lead_time_days"]),
                quality_score=float(row["quality_score"]),
                otd_score=float(row["otd_score"]),
                min_allocation=int(row["min_allocation"]),
                max_allocation=max_allocation,
                risk_score=float(row["risk_score"]),
                risk_level=str(
                    row.get("risk_level", "LOW")
                ).upper(),
                delivery_risk=float(row["delivery_risk"]),
                quality_risk=float(row["quality_risk"]),
                approved=True,
            )
        )

    return options


def load_requirements_csv(
    path: str | Path,
) -> list[AllocationRequest]:
    """Load material requirements into AllocationRequest objects."""
    df = _read_csv(path)

    required = {
        "material_id",
        "required_quantity",
        "required_date",
        "plant_id",
        "priority",
    }

    _validate_columns(
        df,
        required,
        "material_requirements",
    )

    rows: list[AllocationRequest] = []

    for row in df.to_dict(orient="records"):
        rows.append(
            AllocationRequest(
                material_id=str(row["material_id"]),
                required_quantity=int(
                    row["required_quantity"]
                ),
                required_date=pd.to_datetime(
                    row["required_date"]
                ).date(),
                plant_id=str(row["plant_id"]),
                priority=str(
                    row.get("priority", "MEDIUM")
                ),
            )
        )

    return rows


def load_supplier_materials(
    supplier_materials_csv: str | Path,
    suppliers_csv: str | Path | None = None,
) -> list[SupplierOption]:
    """
    Backward-compatible loader for the original team API/tests.
    """
    if suppliers_csv is None:
        raise ValueError(
            "suppliers_csv is required for load_supplier_materials()"
        )

    return load_supplier_options(
        supplier_materials_csv=supplier_materials_csv,
        suppliers_csv=suppliers_csv,
    )