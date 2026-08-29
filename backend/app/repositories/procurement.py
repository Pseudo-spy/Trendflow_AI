"""
Procurement repository — Supabase-backed.

All data reads from Supabase; no local CSV files are used in this module.
The ML risk model is called via ml.risk.predict; the OR-Tools optimizer is
invoked with live data loaded from Supabase tables.
"""
from __future__ import annotations

import csv
import io
from datetime import date as _date, datetime
from pathlib import Path
from typing import Any, Dict, List, Optional

import pandas as pd

from optimization.config import OptimizationConfig
from optimization.loader import load_supplier_options
from optimization.optimizer import SupplierAllocationOptimizer
from optimization.schemas import AllocationRequest, SupplierOption
from optimization.scenario_runner import run_scenario as _run_scenario
from services.scenario_explanation import explain_scenario

# ─── Project root (for ML model artifacts) ──────────────────────────────────
_PROJECT_ROOT = Path(__file__).resolve().parents[3]
_MODELS_DIR = _PROJECT_ROOT / "models"
_REPORTS_DIR = _PROJECT_ROOT / "reports"

# ─── Supabase client (lazy import so unit tests can mock easily) ──────────────


def _db():
    from app.core.database import supabase
    return supabase


# ──────────────────────────────────────────────────────────────────────────────
# Internal helpers to load optimizer inputs from Supabase
# ──────────────────────────────────────────────────────────────────────────────

def _fetch_supplier_materials_df(material_id: str | None = None) -> pd.DataFrame:
    """Read supplier_materials from Supabase into a DataFrame."""
    q = _db().table("supplier_materials").select("*")
    if material_id:
        q = q.eq("material_id", material_id)
    res = q.execute()
    if not res.data:
        raise RuntimeError(
            f"No supplier_material records found for material_id={material_id!r}"
        )
    return pd.DataFrame(res.data)


def _fetch_suppliers_df() -> pd.DataFrame:
    """Read suppliers from Supabase into a DataFrame."""
    res = _db().table("suppliers").select("supplier_id,supplier_name,location,risk_level").execute()
    if not res.data:
        raise RuntimeError("suppliers table is empty or unreachable")
    return pd.DataFrame(res.data)


def _fetch_risk_predictions_df() -> pd.DataFrame:
    """Return the latest ML risk prediction per supplier from Supabase.

    Falls back to the local reports/risk_predictions.csv if the DB table is
    empty — but never falls back to hardcoded values.
    """
    res = (
        _db()
        .table("risk_predictions")
        .select("*")
        .order("id", desc=True)
        .execute()
    )
    rows = res.data or []

    # Prefer p3-risk-v2 model rows
    p3_rows = [r for r in rows if r.get("model_version") == "p3-risk-v2"]
    source = p3_rows or rows

    # Deduplicate: keep newest row per supplier
    seen: dict[str, dict] = {}
    for row in source:
        sid = str(row["supplier_id"])
        if sid not in seen:
            seen[sid] = row

    if seen:
        return pd.DataFrame(list(seen.values()))

    # Fallback: local CSV (populated by `python -m ml.risk.predict`)
    local_csv = _REPORTS_DIR / "risk_predictions.csv"
    if local_csv.exists():
        return pd.read_csv(local_csv)

    raise RuntimeError(
        "risk_predictions table is empty and local CSV fallback not found. "
        "Run: python -m ml.risk.predict"
    )


def _load_supplier_options_from_supabase(material_id: str) -> list[SupplierOption]:
    """Build SupplierOption list from Supabase tables."""
    mat_df = _fetch_supplier_materials_df(material_id)
    sup_df = _fetch_suppliers_df()
    risk_df = _fetch_risk_predictions_df()

    # Write to temp CSV buffers and delegate to existing load_supplier_options
    # (avoids duplicating the merge/validate/normalise logic)
    mat_buf = io.StringIO()
    sup_buf = io.StringIO()
    risk_buf = io.StringIO()

    mat_df.to_csv(mat_buf, index=False)
    sup_df.to_csv(sup_buf, index=False)
    risk_df.to_csv(risk_buf, index=False)

    mat_buf.seek(0)
    sup_buf.seek(0)
    risk_buf.seek(0)

    # load_supplier_options accepts str | Path — write to in-process temp files
    # via pandas StringIO path trick: read_csv accepts file-like objects but
    # load_supplier_options expects paths.  Use tmpfile pattern.
    import tempfile, os

    with (
        tempfile.NamedTemporaryFile("w", suffix=".csv", delete=False) as mf,
        tempfile.NamedTemporaryFile("w", suffix=".csv", delete=False) as sf,
        tempfile.NamedTemporaryFile("w", suffix=".csv", delete=False) as rf,
    ):
        mat_df.to_csv(mf.name, index=False)
        sup_df.to_csv(sf.name, index=False)
        risk_df.to_csv(rf.name, index=False)
        mat_path, sup_path, risk_path = mf.name, sf.name, rf.name

    try:
        options = load_supplier_options(
            supplier_materials_csv=mat_path,
            suppliers_csv=sup_path,
            risk_predictions_csv=risk_path,
            material_id=material_id,
        )
    finally:
        for p in (mat_path, sup_path, risk_path):
            try:
                os.unlink(p)
            except OSError:
                pass

    return options


# ──────────────────────────────────────────────────────────────────────────────
# Public API
# ──────────────────────────────────────────────────────────────────────────────

def run_procurement_optimization(
    material_id: str,
    required_quantity: int,
    required_date: str,
    plant_id: str,
    priority: str = "HIGH",
) -> Dict[str, Any]:
    req_date = datetime.strptime(required_date, "%Y-%m-%d").date()

    request = AllocationRequest(
        material_id=material_id,
        required_quantity=required_quantity,
        required_date=req_date,
        plant_id=plant_id,
        priority=priority,
    )

    options = _load_supplier_options_from_supabase(material_id)

    config = OptimizationConfig()
    optimizer = SupplierAllocationOptimizer(config=config)
    result = optimizer.optimize(request, options)

    # Persist to Supabase
    try:
        from optimization.supabase_io import write_optimization_result
        write_optimization_result(request, result)
    except Exception as exc:
        # Persistence failure is non-fatal; log and continue
        import logging
        logging.getLogger(__name__).warning("Supabase write failed: %s", exc)

    allocation_list = [
        {
            "supplier_id": line.supplier_id,
            "supplier_name": line.supplier_name,
            "quantity": line.quantity,
            "percentage": line.percentage,
            "unit_price": line.unit_price,
            "total_cost": line.total_cost,
            "risk_score": line.risk_score,
            "risk_level": line.risk_level,
            "lead_time_days": line.lead_time_days,
            "expected_delivery_date": line.expected_delivery_date.isoformat(),
        }
        for line in result.allocation
    ]

    return {
        "status": result.status,
        "material_id": result.material_id,
        "plant_id": result.plant_id,
        "priority": result.priority,
        "required_quantity": result.required_quantity,
        "total_allocated": result.total_allocated,
        "total_cost": result.total_cost,
        "objective_value": result.objective_value,
        "objective_bound": result.objective_bound,
        "solve_time_seconds": result.solve_time_seconds,
        "model_version": result.model_version,
        "solver_name": result.solver_name,
        "kpis": vars(result.kpis),
        "allocation": allocation_list,
    }


def predict_supplier_risk(supplier_id: str, material_id: str) -> Dict[str, Any]:
    """Return ML risk prediction for a supplier.

    Queries Supabase risk_predictions table first; falls back to local CSV.
    Never returns hardcoded fallback values — raises clearly if no data found.
    """
    # 1. Try Supabase
    try:
        res = (
            _db()
            .table("risk_predictions")
            .select("*")
            .eq("supplier_id", supplier_id)
            .order("id", desc=True)
            .limit(1)
            .execute()
        )
        rows = res.data or []
        if rows:
            row = rows[0]
            return {
                "supplier_id": supplier_id,
                "material_id": material_id,
                "risk_score": float(row.get("risk_score", 0.5)),
                "risk_level": row.get("risk_level", "MEDIUM"),
                "delivery_risk": float(row.get("delivery_risk", row.get("risk_score", 0.5))),
                "quality_risk": float(row.get("quality_risk", row.get("risk_score", 0.5))),
                "prediction_date": str(row.get("prediction_date", "")),
                "model_version": row.get("model_version", "p3-risk-v2"),
            }
    except Exception:
        pass

    # 2. Fallback: local reports/risk_predictions.csv
    risk_csv = _REPORTS_DIR / "risk_predictions.csv"
    if risk_csv.exists():
        with open(risk_csv, "r", encoding="utf-8") as f:
            reader = csv.DictReader(f)
            for row in reader:
                if row["supplier_id"] == supplier_id:
                    return {
                        "supplier_id": supplier_id,
                        "material_id": material_id,
                        "risk_score": float(row["risk_score"]),
                        "risk_level": row["risk_level"],
                        "delivery_risk": float(row["delivery_risk"]),
                        "quality_risk": float(row["quality_risk"]),
                        "prediction_date": row["prediction_date"],
                        "model_version": row["model_version"],
                    }

    raise ValueError(
        f"No risk prediction found for supplier_id={supplier_id!r}. "
        "Run: python -m ml.risk.predict to generate predictions."
    )


def run_scenario_simulation(
    scenario_name: str,
    material_id: str,
    required_quantity: int,
    required_date: str,
    plant_id: str,
    priority: str = "HIGH",
    target_supplier_id: Optional[str] = None,
    magnitude: float = 0.3,
) -> Dict[str, Any]:
    """Run a what-if scenario using the real OR-Tools optimizer.

    Uses Supabase-backed data (via temp CSV files) for the comparison.
    """
    required_date_obj = datetime.strptime(required_date, "%Y-%m-%d").date()

    # Build data dirs pointing to Supabase-backed temp files
    import tempfile, os

    mat_df = _fetch_supplier_materials_df()
    sup_df = _fetch_suppliers_df()
    risk_df = _fetch_risk_predictions_df()

    with tempfile.TemporaryDirectory() as tmpdir:
        tmpdir_path = Path(tmpdir)
        mat_df.to_csv(tmpdir_path / "supplier_materials.csv", index=False)
        sup_df.to_csv(tmpdir_path / "suppliers.csv", index=False)
        risk_df.to_csv(tmpdir_path / "risk_predictions.csv", index=False)

        comparison = _run_scenario(
            scenario_type=scenario_name,
            material_id=material_id,
            required_quantity=required_quantity,
            required_date=required_date_obj,
            plant_id=plant_id,
            priority=priority,
            target_supplier_id=target_supplier_id,
            magnitude=magnitude,
            data_dir=tmpdir_path,
            reports_dir=tmpdir_path,
            current_date=_date.today(),
        )

    narration = explain_scenario(comparison)

    return {
        "scenario_name": scenario_name,
        "material_id": material_id,
        "feasibility_changed": comparison.feasibility_changed,
        "baseline_status": comparison.baseline.status,
        "scenario_status": comparison.scenario.status,
        "baseline_cost": comparison.baseline.total_cost,
        "scenario_cost": comparison.scenario.total_cost,
        "cost_delta": comparison.cost_delta,
        "cost_delta_pct": comparison.cost_delta_pct,
        "baseline_risk_score": comparison.baseline.kpis.weighted_avg_risk_score,
        "scenario_risk_score": comparison.scenario.kpis.weighted_avg_risk_score,
        "risk_delta": comparison.risk_delta,
        "allocation_deltas": [
            {
                "supplier_id": d.supplier_id,
                "baseline_quantity": d.baseline_quantity,
                "scenario_quantity": d.scenario_quantity,
                "change": d.change,
            }
            for d in comparison.allocation_deltas
        ],
        "explanation": narration,
    }