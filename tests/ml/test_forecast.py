"""
test_forecast.py
Automated test suite for P2 Demand Forecasting Module.
Validates all test cases from TrendFlow AI Test Case Documentation:
- TC-FC-01: Baseline SKU-level forecast generation
- TC-FC-02: Seasonality signal reflection
- TC-FC-03: Holdout accuracy (MAPE threshold)
- TC-FC-04: Confidence interval & bounds
- TC-FC-05: Cold-start handling for new SKUs
- TC-FC-07: Promotional uplift elasticity
"""

import os
import sys
import pytest
import pandas as pd
import numpy as np

CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
FORECASTING_DIR = os.path.join(CURRENT_DIR, "..", "..", "ml", "forecasting")
sys.path.insert(0, FORECASTING_DIR)

from predict import run_demand_forecast, load_model, predict_sku_demand
from evaluate import evaluate_model_on_holdout


@pytest.fixture(scope="session")
def model_bundle():
    return load_model()


def test_tc_fc_01_baseline_sku_level_forecast():
    skus = ["TW001", "TW002", "TW003", "TW004", "TW005"]
    df = run_demand_forecast(target_date="2026-10-15", skus=skus, push_to_supabase=False)
    assert len(df) == len(skus)
    assert set(df["sku"]) == set(skus)
    assert all(df["forecast_quantity"] >= 0)
    assert all(df["forecast_date"] == "2026-10-15")


def test_tc_fc_02_seasonality_signal(model_bundle):
    sku_row = {"sku": "TW003", "category": "Hoodies", "season": "AW26", "selling_price": 2999.0, "production_cost": 1400.0}
    peak = predict_sku_demand(model_bundle, sku_row, target_date="2026-12-15", promotion=False)
    trough = predict_sku_demand(model_bundle, sku_row, target_date="2026-05-15", promotion=False)
    assert peak["forecast_quantity"] > trough["forecast_quantity"]


def test_tc_fc_03_forecast_accuracy_holdout():
    results = evaluate_model_on_holdout()
    assert results["mape"] < 15.0


def test_tc_fc_04_confidence_interval(model_bundle):
    sku_row = {"sku": "TW001", "category": "Shirts", "season": "SS26", "selling_price": 1250.0, "production_cost": 650.0}
    res = predict_sku_demand(model_bundle, sku_row, target_date="2026-10-15")
    assert 0.0 <= res["confidence"] <= 1.0


def test_tc_fc_05_cold_start_new_sku(model_bundle):
    new_sku_row = {"sku": "TW999_NEW", "category": "Denim", "season": "SS26", "selling_price": 2499.0, "production_cost": 1100.0}
    res = predict_sku_demand(model_bundle, new_sku_row, target_date="2026-10-15")
    assert res["sku"] == "TW999_NEW"
    assert res["forecast_quantity"] > 0


def test_tc_fc_07_promotion_uplift(model_bundle):
    sku_row = {"sku": "TW001", "category": "Shirts", "season": "SS26", "selling_price": 1250.0, "production_cost": 650.0}
    base_res = predict_sku_demand(model_bundle, sku_row, target_date="2026-10-15", promotion=False, markdown_percentage=0.0)
    promo_res = predict_sku_demand(model_bundle, sku_row, target_date="2026-10-15", promotion=True, markdown_percentage=15.0)
    assert promo_res["forecast_quantity"] >= base_res["forecast_quantity"]

