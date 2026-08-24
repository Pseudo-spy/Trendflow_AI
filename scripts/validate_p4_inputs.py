from pathlib import Path
import sys

PROJECT_ROOT = Path(__file__).resolve().parents[1]
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from optimization.loader import load_supplier_options

ROOT = Path(__file__).resolve().parents[1]


def main() -> None:
    options = load_supplier_options(
        ROOT / "data/sample/supplier_materials.csv",
        ROOT / "data/sample/suppliers.csv",
        ROOT / "reports/risk_predictions.csv" if (ROOT / "reports/risk_predictions.csv").exists() else None,
        ROOT / "data/sample/supplier_contracts.csv" if (ROOT / "data/sample/supplier_contracts.csv").exists() else None,
    )
    print(f"P4 input validation: OK ({len(options)} supplier-material options)")
    for option in options:
        print(
            f"{option.supplier_id}: material={option.material_id} price={option.unit_price} "
            f"capacity={option.capacity} lead={option.lead_time_days}d risk={option.risk_score:.3f} "
            f"level={option.risk_level} approved={option.approved}"
        )


if __name__ == "__main__":
    main()
