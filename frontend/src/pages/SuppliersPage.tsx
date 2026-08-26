import React from 'react';
import { PageTransitionLayout } from '../layouts/PageTransitionLayout';
import { PageHeader } from '../components/ui/PageHeader';
import { SupplierKpis } from '../components/suppliers/SupplierKpis';
import { SupplierCardGrid } from '../components/suppliers/SupplierCardGrid';

export const SuppliersPage: React.FC = () => {
  return (
    <PageTransitionLayout>
      <PageHeader
        title="Supplier Intelligence Center"
        subtitle="End-to-end partner directory and risk assessment."
      />

      {/* KPI Ribbon - VISUAL_DECISION_REQUIRED */}
      <SupplierKpis />

      {/* Supplier Grid with Drawer */}
      <SupplierCardGrid />
    </PageTransitionLayout>
  );
};

export default SuppliersPage;
