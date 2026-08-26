"""
Turns a ScenarioComparison (from optimization.scenario_runner) into a short,
plain-English narrative for a procurement manager, using Gemini.

Same guardrails and SDK pattern as services/ai_explanation.py:
- Never invents new numbers -- every figure in the prompt comes directly
  from the ScenarioComparison object.
- Never overrides or second-guesses the optimizer's decision.
- Only narrates what the two real runs actually produced.
- If Gemini is unavailable or fails, falls back to the deterministic
  ScenarioComparison.summary() so the caller never loses information.
"""
from __future__ import annotations

import os

from google import genai
from google.genai import types

from dotenv import load_dotenv
load_dotenv()

from optimization.scenario_runner import ScenarioComparison

_MODEL_NAME = "gemini-3.6-flash"  # matches services/ai_explanation.py

_SYSTEM_INSTRUCTIONS = (
    "You are a procurement analyst explaining the result of a what-if "
    "scenario to a non-technical manager. You will be given exact figures "
    "computed by a real optimization run -- cost, risk score, and supplier "
    "allocation changes.\n\n"
    "STRICT RULES:\n"
    "1. Use ONLY the numbers given to you. Never invent, estimate, or "
    "round differently than provided.\n"
    "2. Do not recommend a different allocation than what the optimizer "
    "produced -- you are narrating, not deciding.\n"
    "3. Keep it to 2-4 sentences, plain business English.\n"
    "4. If feasibility changed (the plan became infeasible), say so clearly "
    "and lead with that over the cost/risk framing."
)


def _build_prompt(comparison: ScenarioComparison) -> str:
    lines = [
        f"Scenario type: {comparison.scenario_type}",
        f"Parameters: {comparison.parameters}",
        f"Feasibility changed: {comparison.feasibility_changed}",
        f"Baseline status: {comparison.baseline.status}",
        f"Scenario status: {comparison.scenario.status}",
        f"Cost: {comparison.baseline.total_cost:,.2f} -> "
        f"{comparison.scenario.total_cost:,.2f} "
        f"({comparison.cost_delta:+,.2f}"
        + (f", {comparison.cost_delta_pct:+.1f}%)" if comparison.cost_delta_pct is not None else ")"),
        f"Weighted risk score: "
        f"{comparison.baseline.kpis.weighted_avg_risk_score:.3f} -> "
        f"{comparison.scenario.kpis.weighted_avg_risk_score:.3f} "
        f"({comparison.risk_delta:+.3f})",
    ]
    changed = [d for d in comparison.allocation_deltas if d.change != 0]
    if changed:
        lines.append("Allocation changes:")
        for d in changed:
            lines.append(
                f"  {d.supplier_id}: {d.baseline_quantity:,} -> "
                f"{d.scenario_quantity:,} ({d.change:+,})"
            )
    else:
        lines.append("Allocation changes: none")

    return "\n".join(lines)


def explain_scenario(comparison: ScenarioComparison) -> str:
    """
    Returns a short plain-English narration of the scenario comparison.
    Falls back to the deterministic summary() if Gemini can't be reached,
    so the caller never gets an empty or fabricated explanation.
    """
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        return comparison.summary()

    try:
        client = genai.Client(api_key=api_key)
        response = client.models.generate_content(
            model=_MODEL_NAME,
            contents=_build_prompt(comparison),
            config=types.GenerateContentConfig(
                system_instruction=_SYSTEM_INSTRUCTIONS,
                temperature=0.2,
            ),
        )
        text = (response.text or "").strip()
        return text if text else comparison.summary()
    except Exception:
        # Never let a narration failure break the caller.
        return comparison.summary()


if __name__ == "__main__":
    from datetime import date
    from optimization.scenario_runner import run_scenario

    comparison = run_scenario(
        scenario_type="supplier_disruption",
        material_id="MAT001",
        required_quantity=30_000,
        required_date=date(2026, 10, 15),
        plant_id="PLANT001",
        priority="HIGH",
        target_supplier_id="SUP001",
        magnitude=0.7,
        current_date=date(2026, 8, 23),
    )
    print(explain_scenario(comparison))