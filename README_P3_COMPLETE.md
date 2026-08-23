# TrendFlow P3 — Complete Risk Upgrade

This is an overlay to apply on top of the previous `TrendFlow_P3_Industry_Ready` project.

The latest team PDF assigns P3 to **Supplier Risk Prediction** and P4 to **PR1 Optimization / OR-Tools**. This upgrade completes the P3 side without moving procurement-allocation decisions into the risk model.

## What this upgrade adds
1. Contract attributes are explicit inputs to P3.
2. Canonical output matches the latest PDF: `supplier_id`, `risk_score`, `risk_level`, `delivery_risk`, `quality_risk`.
3. P3 output includes audit fields: `prediction_date`, `model_version`, `generated_at`.
4. Supplier-level latest-snapshot prediction is generated for P4/P1 integration.
5. Supabase `risk_predictions` publisher is included.
6. `.env.example` and secret-safe Git configuration are included.
7. Stronger validation and integration-contract tests are included.
8. Risk-feature effect extraction is included for viva/documentation.
9. SQL contract is included for P1/database-owner review.
10. Existing `optimization/` code is retained for your P4 handoff; it is not part of the P3 risk responsibility in the latest PDF.

## Install
```powershell
.\.venv-p3\Scripts\python.exe -m pip install -r requirements-p3.txt
```

## Prepare sample contract input
```powershell
.\.venv-p3\Scripts\python.exe scripts/generate_supplier_contracts.py
```

## Train risk model
```powershell
.\.venv-p3\Scripts\python.exe -m ml.risk.train
```

## Evaluate
```powershell
.\.venv-p3\Scripts\python.exe -m ml.risk.evaluate
```

## Generate canonical P3 predictions
```powershell
.\.venv-p3\Scripts\python.exe -m ml.risk.predict
```

## Generate visualizations
```powershell
.\.venv-p3\Scripts\python.exe -m ml.risk.visualize
```

## Generate feature-effect evidence for viva
```powershell
.\.venv-p3\Scripts\python.exe -m ml.risk.explain
```

## Test the P3 module
```powershell
.\.venv-p3\Scripts\python.exe -m pytest tests/risk tests/integration -q
```

## Publish to Supabase
Create `.env` locally and never commit it:
```env
SUPABASE_URL=https://<your-project>.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<secret>
```

Then:
```powershell
.\.venv-p3\Scripts\python.exe scripts/predict_and_publish_risk.py --publish
```

## P3-to-P4 handoff
P3 writes:
`risk_predictions`

P4 consumes:
`risk_score`, `risk_level`, `delivery_risk`, `quality_risk` together with supplier price/capacity/lead time/material requirements.

## Important
The PDF does not define the exact contract feature names, risk-score weights, or thresholds. The names and formula in this bundle are implementation choices designed to make the pipeline executable; P1/P4 should agree on the final database contract before shared integration.
