from datetime import date

import pytest

pytest.importorskip("ortools")

from optimization.config import OptimizationConfig
from optimization.optimizer import SupplierAllocationOptimizer
from optimization.schemas import AllocationRequest, SupplierOption
from optimization.scenarios import supplier_disruption


def test_disruption_changes_supplier_attributes():
    supplier = SupplierOption(
        supplier_id="S1", supplier_name="Supplier 1", material_id="MAT001", unit_price=100,
        capacity=10000, lead_time_days=10, quality_score=95, otd_score=95,
        min_allocation=0, max_allocation=10000, risk_score=0.20, risk_level="LOW",
        delivery_risk=0.20, quality_risk=0.10,
    )
    changed = supplier_disruption([supplier], "S1", capacity_multiplier=0.5, risk_delta=0.3, lead_time_delta_days=5)[0]
    assert changed.capacity == 5000
    assert changed.risk_score == 0.5
    assert changed.lead_time_days == 15


def test_disruption_can_change_allocation():
    suppliers = [
        SupplierOption(
            supplier_id="S1", supplier_name="Safe", material_id="MAT001", unit_price=120,
            capacity=20000, lead_time_days=10, quality_score=96, otd_score=96,
            min_allocation=0, max_allocation=20000, risk_score=0.1, risk_level="LOW",
            delivery_risk=0.1, quality_risk=0.05,
        ),
        SupplierOption(
            supplier_id="S2", supplier_name="Backup", material_id="MAT001", unit_price=130,
            capacity=20000, lead_time_days=12, quality_score=95, otd_score=94,
            min_allocation=0, max_allocation=20000, risk_score=0.2, risk_level="LOW",
            delivery_risk=0.15, quality_risk=0.1,
        ),
    ]
    request = AllocationRequest("MAT001", 20000, date(2026, 9, 30), "PLANT001", "HIGH")
    optimizer = SupplierAllocationOptimizer(OptimizationConfig(today=date(2026, 8, 23)))
    before = optimizer.optimize(request, suppliers)
    after = optimizer.optimize(request, supplier_disruption(suppliers, "S1", capacity_multiplier=0.2, risk_delta=0.3, lead_time_delta_days=5))
    assert before.is_success and after.is_success
    assert {x.supplier_id for x in before.allocation} != {x.supplier_id for x in after.allocation} or before.allocation != after.allocation
