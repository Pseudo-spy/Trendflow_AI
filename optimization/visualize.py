from __future__ import annotations

from pathlib import Path

import pandas as pd
import plotly.express as px

from .schemas import OptimizationResult


def allocation_dataframe(result: OptimizationResult) -> pd.DataFrame:
    return pd.DataFrame([
        {
            "supplier_id": x.supplier_id,
            "quantity": x.quantity,
            "percentage": x.percentage,
            "unit_price": x.unit_price,
            "total_cost": x.total_cost,
            "risk_score": x.risk_score,
            "quality_score": x.quality_score,
            "otd_score": x.otd_score,
            "lead_time_days": x.lead_time_days,
        }
        for x in result.allocation
    ])


def save_allocation_chart(result: OptimizationResult, output_path: str | Path) -> None:
    df = allocation_dataframe(result)
    if df.empty:
        raise ValueError("Cannot plot an empty allocation")
    fig = px.bar(df, x="supplier_id", y="quantity", title="Supplier Allocation", text="quantity")
    fig.update_layout(yaxis_title="Allocated Quantity", xaxis_title="Supplier")
    Path(output_path).parent.mkdir(parents=True, exist_ok=True)
    fig.write_html(str(output_path), include_plotlyjs="cdn")
