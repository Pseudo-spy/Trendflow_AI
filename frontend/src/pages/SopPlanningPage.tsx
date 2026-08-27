import React from 'react';
import { PageTransitionLayout } from '../layouts/PageTransitionLayout';
import { PageHeader } from '../components/ui/PageHeader';
import { SopPipelineHero } from '../components/sop/SopPipelineHero';
import { SopExecutiveSummary } from '../components/sop/SopExecutiveSummary';
import { SopDemandSupplyProcurementChart } from '../components/sop/SopDemandSupplyProcurementChart';

export const SopPlanningPage: React.FC = () => {

  return (
    <PageTransitionLayout>
      <PageHeader
        title="S&OP Planning"
        subtitle="Material requirement planning and cross-functional supply visibility."
        badgeText="S&OP Engine"
        badgeVariant="emerald"
      />

      {/* Signature 3D S&OP Dimensional Pipeline Flow */}
      <SopPipelineHero />

      {/* S&OP Executive Summary */}
      <SopExecutiveSummary />

      {/* Demand vs Supply vs Procurement Alignment Chart */}
      <SopDemandSupplyProcurementChart />
    </PageTransitionLayout>
  );
};

export default SopPlanningPage;
