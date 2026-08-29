# FINAL AUDIT

## Phase A Findings

### 1. Hardcoded / Duplicate Frontend API Clients
- Duplicates found: rontend/src/services/api.ts vs rontend/src/services/api/client.ts.

### 2. CSV Dependencies in Backend (Production Path)
- ackend/app/repositories/procurement.py reads from local CSVs (supplier_materials.csv, suppliers.csv, supplier_contracts.csv) instead of Supabase.
- It also uses predict_supplier_risk that reads from eports/risk_predictions.csv with a hardcoded fallback instead of the live model or DB.

### 3. Contract Schema Mismatch
- The Python local logic (optimization/loader.py, optimization/schemas.py) expects fields like contract_otd_target, contract_quality_target, etc.
- The actual Supabase schema for supplier_contracts contains different fields (min_quantity, max_quantity, contract_price).

### 4. Hardcoded localhost
- Need to check rontend for hardcoded http://localhost:8000.

### 5. Deployment / Requirements
- Created unified ackend/requirements.txt.


