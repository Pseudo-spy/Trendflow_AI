from __future__ import annotations
from pathlib import Path
import pandas as pd
ROOT=Path(__file__).resolve().parents[1]
def main():
    suppliers=pd.read_csv(ROOT/"data/sample/suppliers.csv")
    d={"LOW":(0.95,95,20,0.04,1),"MEDIUM":(0.92,92,24,0.03,1),"HIGH":(0.90,88,30,0.02,1)}
    rows=[]
    for r in suppliers.itertuples(index=False):
        otd,quality,lead,penalty,active=d[str(r.risk_level).upper()]
        rows.append({"supplier_id":r.supplier_id,"contract_otd_target":otd,"contract_quality_target":quality,"contract_max_lead_time_days":lead,"contract_delay_penalty_rate":penalty,"contract_active":active})
    out=ROOT/"data/sample/supplier_contracts.csv"; pd.DataFrame(rows).to_csv(out,index=False); print(f"Generated {len(rows)} contract records -> {out}")
if __name__=="__main__": main()
