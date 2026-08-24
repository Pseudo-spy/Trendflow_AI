# 🤖 P2 Module — Explainable ML Demand Forecasting

**Project**: TrendWear AI / TrendFlow AI (Cognizant 2026 NPN SCM Hackathon — Combination 5)  
**Role**: Person 2 (P2) — Demand Forecasting & S&OP Planning Integration  

---

## 📌 1. Overview & Business Goal
In fast-fashion supply chains, TrendWear launches seasonal collections every 6 weeks. Accurate SKU-level demand forecasting is the critical input that prevents overproduction of slow movers and stock-outs of fast sellers, driving downstream S&OP material requirements and PR1 procurement optimization.

This module implements an explainable, high-accuracy Machine Learning demand forecasting pipeline trained on historical sell-through data, seasonality signals, promotional uplifts, markdown elasticities, and product attributes.

---

## 🗄️ 2. Database & Data Contracts

The pipeline connects directly to Supabase PostgreSQL using the service-role key to bypass RLS policies.

### Source Tables (Inputs):
- `demand_history` (1,000 rows):
  - `id` (BIGSERIAL PRIMARY KEY)
  - `sku` (VARCHAR, FK to products)
  - `demand_date` (DATE)
  - `quantity_sold` (INTEGER)
  - `promotion` (BOOLEAN)
  - `markdown_percentage` (NUMERIC)
  - `sell_through_rate` (NUMERIC)
- `products` (100 rows):
  - `id` (BIGSERIAL PRIMARY KEY)
  - `sku` (VARCHAR UNIQUE)
  - `product_name` (VARCHAR)
  - `category` (VARCHAR)
  - `season` (VARCHAR)
  - `selling_price` (NUMERIC)
  - `production_cost` (NUMERIC)

### Output Table:
- `demand_forecast` (100 rows for target planning horizon):
  - `id` (BIGSERIAL PRIMARY KEY)
  - `sku` (VARCHAR, FK to products)
  - `forecast_date` (DATE)
  - `forecast_quantity` (INTEGER, strictly >= 0)
  - `confidence` (NUMERIC, 0.00 to 1.00)
  - `model_version` (VARCHAR, e.g. `v2.0-ml-randomforest`)

---

## 🧠 3. ML Architecture & Feature Engineering

### Tabular Features:
1. **Calendar & Seasonality**: Month (1..12), Quarter (1..4), Cyclical Sin/Cos Month encodings.
2. **Promotional & Markdown Signals**: Binary promotion flag (0/1), markdown percentage (0..25%).
3. **Product Attributes**: Categorical encoding of product category, Season, Price, Cost, Profit Margin.
4. **Historical Lags & Rolling Statistics**: 1-period lag, 2-period lag, 3-period rolling mean, 3-period rolling std, historical sell-through rate.
5. **Cold-Start Fallback (TC-FC-05)**: For 16 new SKUs without historical sales, the model automatically estimates baseline demand from category + season benchmarks, ensuring 100% SKU coverage without null values or errors.

---

## 📊 4. Model Evaluation & Accuracy Metrics

Evaluated on holdout validation data (latest 2 months):

| Metric | Holdout Value | Target Threshold | Status |
|---|---|---|---|
| **MAE** | **95.25 units** | < 350 units | ✅ Passed |
| **RMSE** | **131.06 units** | < 450 units | ✅ Passed |
| **MAPE** | **3.95%** | < 15.0% | ✅ High Accuracy |

### Category-Level MAPE Breakdown:
- **Shirts**: 2.36%
- **Hoodies**: 3.59%
- **Dresses**: 4.08%
- **T-Shirts**: 4.09%
- **Kurtas**: 4.25%
- **Jackets**: 4.32%
- **Denim**: 4.48%
- **Trousers**: 4.48%

---

## 🔌 5. Integration Guide for P1 (FastAPI Backend)

Mehul (P1) or backend routes can easily integrate with P2 forecasting in either of two ways:

### Option A: Direct Python Import (Recommended for POST `/api/forecast`)
```python
from ml.forecasting.predict import run_demand_forecast

# Generate forecast DataFrame for all 100 SKUs
df_forecast = run_demand_forecast(
    target_date="2026-10-15",
    skus=None,                  # None = all 100 SKUs, or pass ["TW001", "TW002"]
    push_to_supabase=True,      # Automatically upserts into demand_forecast table
    promotions={"TW001": True} # Optional promo overrides
)

# Convert to JSON for FastAPI response
return df_forecast.to_dict(orient="records")
```

### Option B: Supabase Database Query (for GET `/api/demand/forecast`)
The table `demand_forecast` is already populated with the latest ML predictions (`model_version = 'v2.0-ml-randomforest'`).

---

## 🚀 6. Execution Commands

From `ml/forecasting/`:

```bash
# 1. Fetch data from Supabase
python fetch_data.py

# 2. Train model & save artifact
python train.py

# 3. Evaluate model accuracy on holdout test set
python evaluate.py

# 4. Run end-to-end pipeline (Train -> Predict -> Push to Supabase)
python run_pipeline.py

# 5. Run test suite (All 6 Test Cases TC-FC-01..TC-FC-07)
pytest ../../tests/ml/test_forecast.py -v
```
