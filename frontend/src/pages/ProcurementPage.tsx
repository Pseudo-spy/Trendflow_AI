import React from 'react';
import { PageTransitionLayout } from '../layouts/PageTransitionLayout';
import { PageHeader } from '../components/ui/PageHeader';
import { ProcurementHero } from '../components/procurement/ProcurementHero';
import { ProcurementKpis } from '../components/procurement/ProcurementKpis';
import { AllocationRadialChart } from '../components/procurement/AllocationRadialChart';
import { SupplierAllocationTable } from '../components/procurement/SupplierAllocationTable';

export const ProcurementPage: React.FC = () => {
  return (
    <PageTransitionLayout>
      <PageHeader
        title="AI Procurement Optimizer"
        subtitle="Mathematical order volume allocation across suppliers powered by Google OR-Tools mixed-integer linear programming"
        badgeText="OR-Tools MILP • Optimal"
        badgeVariant="cyan"
      />

      {/* Signature 3D Supplier Allocation Canvas */}
      <ProcurementHero />

      {/* KPI Summary Ribbon */}
      <ProcurementKpis />

      {/* Allocation Breakdown Chart & Matrix Table */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <AllocationRadialChart />
        <SupplierAllocationTable />
      </div>
    </PageTransitionLayout>
  );
};

export default ProcurementPage;
