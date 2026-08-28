# API Readiness Audit

## 1. Endpoint Readiness Matrix

| Feature | Method | Endpoint | Ready | Request | Response | Issue |
|---|---|---|---|---|---|---|
| Dashboard KPIs | N/A | None | No | - | - | Missing aggregate endpoint |
| Demand History | GET | `/api/demand/history` | Yes | `?sku={str}` | `{ success, count, data: [DemandHistoryItem] }` | None |
| Demand Forecast | GET | `/api/demand/forecast` | Yes | `?sku={str}` | `{ success, count, data: [DemandForecastItem] }` | None |
| Run Forecast | POST | `/api/forecast/run` | Yes | `{ sku, horizon_months }` | `ForecastRunResponse` | None |
| Run S&OP | POST | `/api/sop/run` | Yes | `{ sku, target_date }` | `MaterialRequirementContract` | None |
| Suppliers | GET | `/api/suppliers` | Yes | None | `{ success, count, data: [SupplierItem] }` | None |
| Materials | GET | `/api/materials` | Yes | None | `{ success, count, data: [MaterialItem] }` | None |
| Optimize Procurement | POST | `/api/procurement/optimize` | Partial | `MaterialRequirementContract` | `OptimizationResponse` | Missing fields in PR1 schema |
| Risk Prediction | POST | `/api/risk/predict` | Yes | `{ supplier_id, material_id }` | `RiskPredictionResponse` | None |
| Scenario Run | POST | `/api/scenario/run` | Yes | `{ scenario_name, material_id, quantity_modifier }` | `ScenarioRunResponse` | None |

## 2. P2 → PR1 Contract Verification

**P2: Material Requirement** - ✅ MATCHES
- `material_id`: Present
- `required_quantity`: Present
- `required_date`: Present
- `plant_id`: Present
- `priority`: Present

**PR1: Supplier Allocation** - ❌ MISMATCH
- `supplier_id`: Present
- `quantity`: Present
- `percentage`: Present
- `unit_price`: Present
- `total_cost`: **MISSING** from `SupplierAllocationDetail` (exists only as aggregate on response root)
- `risk_score`: Present
- `expected_delivery_date`: **MISSING** from `SupplierAllocationDetail` entirely.

## 3. Frontend Mapping Status

- **Dashboard**: NO API (No aggregate metrics API exists)
- **Demand Planning**: READY FOR INTEGRATION
- **S&OP**: READY FOR INTEGRATION
- **Procurement**: PARTIALLY READY (Blocked by PR1 schema mismatches)
- **Suppliers**: READY FOR INTEGRATION
- **Risk Analysis**: READY FOR INTEGRATION
- **Scenarios**: READY FOR INTEGRATION

## 4. Teammate Dependencies

1. **Backend Teammate**: Needs to update the `SupplierAllocationDetail` Pydantic model in `schemas.py` to include `expected_delivery_date` (string/date) and `total_cost` (float) per supplier allocation.
2. **Backend Teammate**: Needs to create a `/api/dashboard/metrics` endpoint for the top-level KPIs on the Dashboard, or advise if the frontend should aggregate these manually from all other endpoints.

## 5. Recommended Integration Order

We should integrate the ready modules while waiting for the backend PR1 schema fix:

1. **Suppliers & Risk Analysis**
2. **Demand Planning**
3. **S&OP**
4. **Scenarios**
5. **Procurement** (Wait until PR1 schema is updated by backend)
6. **Dashboard** (Wait until dashboard aggregate API is created)
