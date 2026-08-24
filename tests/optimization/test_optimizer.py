from datetime import date

import pytest

ortools = pytest.importorskip("ortools")

from optimization.config import OptimizationConfig
from optimization.optimizer import SupplierAllocationOptimizer
from optimization.schemas import AllocationRequest, SupplierOption


def _suppliers():
    return [
        SupplierOption(
            supplier_id="S1", supplier_name="Safe", material_id="MAT001", unit_price=150,
            capacity=25000, lead_time_days=10, quality_score=96, otd_score=96,
            min_allocation=5000, max_allocation=25000, risk_score=0.10, risk_level="LOW",
            delivery_risk=0.08, quality_risk=0.03,
        ),
        SupplierOption(
            supplier_id="S2", supplier_name="Cheap", material_id="MAT001", unit_price=130,
            capacity=30000, lead_time_days=25, quality_score=88, otd_score=82,
            min_allocation=5000, max_allocation=25000, risk_score=0.80, risk_level="HIGH",
            delivery_risk=0.85, quality_risk=0.70,
        ),
    ]


def test_optimizer_fulfills_requirement():
    request = AllocationRequest("MAT001", 30000, date(2026, 10, 15), "PLANT001", "HIGH")
    result = SupplierAllocationOptimizer(OptimizationConfig(today=date(2026, 8, 23))).optimize(request, _suppliers())
    assert result.is_success
    assert result.total_allocated == 30000
    assert sum(x.quantity for x in result.allocation) == 30000


def test_high_risk_cap_is_respected():
    request = AllocationRequest("MAT001", 30000, date(2026, 10, 15), "PLANT001", "HIGH")
    config = OptimizationConfig(today=date(2026, 8, 23), high_risk_allocation_cap=0.25)
    result = SupplierAllocationOptimizer(config).optimize(request, _suppliers())
    assert result.is_success
    high_qty = sum(x.quantity for x in result.allocation if x.risk_level == "HIGH")
    assert high_qty <= 7500


def test_infeasible_deadline_is_reported():
    request = AllocationRequest("MAT001", 30000, date(2026, 8, 30), "PLANT001", "URGENT")
    result = SupplierAllocationOptimizer(OptimizationConfig(today=date(2026, 8, 23))).optimize(request, _suppliers())
    assert not result.is_success
    assert result.status == "INFEASIBLE"
