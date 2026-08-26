# P3 — Supplier Risk Prediction

The latest team plan assigns P3 to supplier-risk prediction and P4 to OR-Tools procurement optimization.

## P3 flow
Supplier data + contract attributes + historical performance -> ML model -> risk_predictions -> Supabase -> P4/P1.

## Required output
- supplier_id
- risk_score (0..1, higher = riskier)
- risk_level (LOW/MEDIUM/HIGH)
- delivery_risk (0..1)
- quality_risk (0..1)
- prediction_date
- model_version
- generated_at

## Features
Historical performance:
- on_time_delivery_rate
- average_delay_days
- delay_std_days
- quality_score
- disruption_count_90d
- lead_time_days
- recent_otd_trend

Contract attributes:
- contract_otd_target
- contract_quality_target
- contract_max_lead_time_days
- contract_delay_penalty_rate
- contract_active

## Transparent risk policy
Two logistic classifiers are used as an explainable baseline: delivery-delay risk and quality risk. Overall risk is `0.60*delivery_risk + 0.40*quality_risk`. Levels are LOW < 0.34, MEDIUM 0.34–<0.67, HIGH >= 0.67. These weights/thresholds are implementation choices, not values specified by the project PDF.

## Supabase integration
`risk_service/supabase_writer.py` upserts the final P3 records into `risk_predictions`.
Use `.env` locally and never commit secrets.
