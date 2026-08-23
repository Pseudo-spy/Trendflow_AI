from pathlib import Path
from ml.risk.features import clean_features, load_contracts_csv, load_performance_csv, merge_performance_and_contracts
from ml.risk.predict import generate_predictions
ROOT=Path(__file__).resolve().parents[2]
def test_prediction_contract_and_ranges():
    out=generate_predictions(ROOT/"models/supplier_risk.joblib",ROOT/"data/sample/supplier_performance.csv",ROOT/"data/sample/supplier_contracts.csv")
    expected={"supplier_id","risk_score","risk_level","delivery_risk","quality_risk","prediction_date","model_version","generated_at"}
    assert expected.issubset(out.columns); assert out["risk_score"].between(0,1).all(); assert out["delivery_risk"].between(0,1).all(); assert out["quality_risk"].between(0,1).all(); assert set(out["risk_level"]).issubset({"LOW","MEDIUM","HIGH"})
def test_contract_data_is_joined():
    p=load_performance_csv(ROOT/"data/sample/supplier_performance.csv"); c=load_contracts_csv(ROOT/"data/sample/supplier_contracts.csv"); m=clean_features(merge_performance_and_contracts(p,c)); assert len(m)==len(p); assert m["contract_active"].notna().all()
