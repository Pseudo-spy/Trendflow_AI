from datetime import date
from pathlib import Path

from optimization.loader import load_supplier_materials
from optimization.supplier_allocation import SupplierAllocationOptimizer
from optimization.schemas import AllocationRequest

ROOT = Path(__file__).resolve().parents[2]


def test_sample_allocation_hits_required_quantity() -> None:
    suppliers = load_supplier_materials(
        ROOT / "data/sample/supplier_materials.csv",
        ROOT / "data/sample/suppliers.csv",
    )
    request = AllocationRequest(
        material_id="MAT001",
        required_quantity=30_000,
        required_date=date(2026, 10, 15),
        plant_id="PLANT001",
        priority="HIGH",
    )
    result = SupplierAllocationOptimizer().optimize(
        request,
        suppliers,
        current_date=date(2026, 8, 23),
    )
    assert result.is_feasible
    assert result.total_allocated == 30_000
    assert round(sum(x.quantity for x in result.allocation)) == 30_000
    for line in result.allocation:
        assert line.quantity > 0
        assert line.total_cost == line.quantity * line.unit_price
