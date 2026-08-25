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
        subtitle="End-to-end partner directory with real-time OTIF tracking, ESG scores, capacity telemetry, and contract scorecards"
        badgeText="18 Tier-1/Tier-2 Partners"
        badgeVariant="cyan"
      />

      {/* KPI Ribbon */}
      <SupplierKpis />

      {/* Supplier Grid with 3D Hover & Drawer */}
      <SupplierCardGrid />
    </PageTransitionLayout>
  );
};

export default SuppliersPage;
