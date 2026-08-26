# TrendFlow P4 — Industry-Ready PR1 Procurement Optimization

P4 is the procurement decision engine described in the team PDF.

**P4 input**

- Material requirement
- Supplier/material capacity
- Unit price
- Supplier risk from P3
- Delivery risk / quality risk from P3
- Lead time
- MOQ/min allocation and maximum allocation
- Supplier contract status and contract lead-time limit

**P4 output**

- Supplier allocation quantities
- Procurement-plan summary
- Total procurement cost
- Weighted risk / delivery / quality indicators
- Supplier utilization and concentration KPIs
- Solver diagnostics and scenario comparisons

## Design choices

- Google OR-Tools CP-SAT is used as the primary solver.
- P3's current canonical risk output is supported: `risk_score`, `risk_level`, `delivery_risk`, `quality_risk`.
- Legacy risk aliases such as `delay_probability` are accepted at the loading boundary only.
- Contract activity and contractual max lead time are treated as hard feasibility rules by default.
- Cost, risk, delivery risk, lead time, quality and OTD are combined into a transparent weighted objective.
- High-risk allocation can be capped as a configurable share of the requirement.
- Minimum/max allocations are linked to binary supplier activation variables.
- Static PNG charts (Matplotlib/Seaborn) and interactive HTML charts (Plotly) are generated for PPT/demo use.
- Scenario simulation supports disruption, capacity cut, lead-time shock and demand spike.
- Supabase integration is optional and only activates when environment variables are present.

## Existing project integration

This package is intended to be copied into the existing repository on the P4 branch.
It does **not** create a new Supabase project and it does **not** replace P3.

Expected P3 output:

`reports/risk_predictions.csv`

Expected P4 outputs:

- `reports/p4/p4_optimization_result.json`
- `reports/p4/allocation_breakdown.png`
- `reports/p4/cost_breakdown.png`
- `reports/p4/p4_allocation.html`
- `reports/p4/scenario_comparison.png`

## Install

```powershell
.\.venv-p3\Scripts\python.exe -m pip install -r requirements-p4.txt
```

## Validate inputs

```powershell
.\.venv-p3\Scripts\python.exe scripts\validate_p4_inputs.py
```

## Run optimizer

```powershell
.\.venv-p3\Scripts\python.exe -m optimization.run_optimizer
```

Example custom request:

```powershell
.\.venv-p3\Scripts\python.exe -m optimization.run_optimizer `
  --material-id MAT001 `
  --quantity 30000 `
  --required-date 2026-10-15 `
  --plant-id PLANT001 `
  --priority HIGH
```

## Run scenario demo

```powershell
.\.venv-p3\Scripts\python.exe scripts\run_p4_scenario.py
```

## Run P4 tests

```powershell
.\.venv-p3\Scripts\python.exe -m pytest tests\optimization -q
```

## Supabase (optional)

Set these in a local `.env` (never commit it):

```env
SUPABASE_URL=https://<team-project>.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<server-side-key>
```

The P4 database adapter expects the existing shared project and uses the tables:

- `risk_predictions`
- `supplier_allocations`
- `procurement_plans`

Do not put secrets in source control.
