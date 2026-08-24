from __future__ import annotations

from pathlib import Path
from typing import Mapping

import matplotlib.pyplot as plt
import numpy as np
import plotly.express as px
import seaborn as sns

from .schemas import OptimizationResult

sns.set_theme(style="whitegrid")


def _ensure_parent(path: Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)


def save_allocation_charts(result: OptimizationResult, output_dir: str | Path) -> dict[str, Path]:
    output_dir = Path(output_dir)
    output_dir.mkdir(parents=True, exist_ok=True)
    if not result.allocation:
        raise ValueError("Cannot chart an empty allocation result")

    suppliers = [line.supplier_id for line in result.allocation]
    quantities = [line.quantity for line in result.allocation]

    allocation_path = output_dir / "allocation_breakdown.png"
    fig, ax = plt.subplots(figsize=(8, 5))
    colors = sns.color_palette("crest", len(suppliers))
    bars = ax.bar(suppliers, quantities, color=colors)
    ax.set_title(f"Supplier Allocation — {result.material_id}")
    ax.set_xlabel("Supplier")
    ax.set_ylabel("Allocated quantity")
    for bar, line in zip(bars, result.allocation):
        ax.text(bar.get_x() + bar.get_width() / 2, bar.get_height(), f"{line.percentage:.1f}%", ha="center", va="bottom")
    fig.tight_layout()
    fig.savefig(allocation_path, dpi=180)
    plt.close(fig)

    cost_path = output_dir / "cost_breakdown.png"
    fig, ax = plt.subplots(figsize=(8, 5))
    cost_values = [line.total_cost for line in result.allocation]
    bars = ax.bar(suppliers, cost_values, color=sns.color_palette("flare", len(suppliers)))
    ax.set_title(f"Procurement Cost by Supplier — total ₹{result.total_cost:,.0f}")
    ax.set_xlabel("Supplier")
    ax.set_ylabel("Total cost")
    for bar, value in zip(bars, cost_values):
        ax.text(bar.get_x() + bar.get_width() / 2, bar.get_height(), f"₹{value:,.0f}", ha="center", va="bottom", fontsize=8)
    fig.tight_layout()
    fig.savefig(cost_path, dpi=180)
    plt.close(fig)

    html_path = output_dir / "p4_allocation.html"
    rows = [
        {
            "supplier_id": line.supplier_id,
            "quantity": line.quantity,
            "risk_level": line.risk_level,
            "risk_score": line.risk_score,
            "quality_score": line.quality_score,
            "otd_score": line.otd_score,
            "lead_time_days": line.lead_time_days,
            "total_cost": line.total_cost,
        }
        for line in result.allocation
    ]
    fig = px.bar(
        rows,
        x="supplier_id",
        y="quantity",
        color="risk_level",
        hover_data=["risk_score", "quality_score", "otd_score", "lead_time_days", "total_cost"],
        title=f"P4 Supplier Allocation — {result.material_id}",
        labels={"quantity": "Allocated quantity", "supplier_id": "Supplier"},
    )
    fig.write_html(html_path, include_plotlyjs="cdn")

    return {"allocation_png": allocation_path, "cost_png": cost_path, "allocation_html": html_path}


def save_scenario_comparison(
    baseline: OptimizationResult,
    scenario: OptimizationResult,
    output_path: str | Path,
    scenario_name: str,
) -> Path:
    output_path = Path(output_path)
    _ensure_parent(output_path)
    suppliers = sorted({x.supplier_id for x in baseline.allocation} | {x.supplier_id for x in scenario.allocation})
    base_map = {x.supplier_id: x.quantity for x in baseline.allocation}
    scen_map = {x.supplier_id: x.quantity for x in scenario.allocation}

    x = np.arange(len(suppliers))
    width = 0.36
    fig, ax = plt.subplots(figsize=(9, 5))
    ax.bar(x - width / 2, [base_map.get(s, 0) for s in suppliers], width, label="Baseline")
    ax.bar(x + width / 2, [scen_map.get(s, 0) for s in suppliers], width, label=scenario_name)
    ax.set_title(f"Allocation Scenario Comparison — {baseline.material_id}")
    ax.set_xlabel("Supplier")
    ax.set_ylabel("Allocated quantity")
    ax.set_xticks(x, suppliers)
    ax.legend()
    fig.tight_layout()
    fig.savefig(output_path, dpi=180)
    plt.close(fig)
    return output_path
