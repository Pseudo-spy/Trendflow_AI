from __future__ import annotations
from pathlib import Path
import argparse
from ml.risk.predict import generate_predictions
from risk_service.supabase_writer import SupabaseRiskWriter
ROOT=Path(__file__).resolve().parents[1]
def main():
    p=argparse.ArgumentParser(); p.add_argument("--publish",action="store_true"); args=p.parse_args()
    pred=generate_predictions(ROOT/"models/supplier_risk.joblib",ROOT/"data/sample/supplier_performance.csv",ROOT/"data/sample/supplier_contracts.csv")
    out=ROOT/"reports/risk_predictions.csv"; out.parent.mkdir(exist_ok=True,parents=True); pred.to_csv(out,index=False)
    print(f"Generated {len(pred)} supplier risk predictions -> {out}")
    if args.publish:
        rows=SupabaseRiskWriter().upsert(pred); print(f"Published {len(rows)} rows to risk_predictions.")
    else: print("Dry run only. Add --publish after Supabase env vars are configured.")
if __name__=="__main__": main()
