import React from 'react';
import { PageTransitionLayout } from '../layouts/PageTransitionLayout';
import { PageHeader } from '../components/ui/PageHeader';
import { SopPipelineHero } from '../components/sop/SopPipelineHero';
import { SopKpis } from '../components/sop/SopKpis';
import { MultiEchelonDcTable } from '../components/sop/MultiEchelonDcTable';
import { FactoryCapacityModule } from '../components/sop/FactoryCapacityModule';
import { BomExplosionModule } from '../components/sop/BomExplosionModule';
import { ServiceLevelSensitivity } from '../components/sop/ServiceLevelSensitivity';
import { useMediaQuery } from '../hooks/useMediaQuery';

export const SopPlanningPage: React.FC = () => {
  const isTablet = useMediaQuery('(max-width: 1024px)');

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

      {/* S&OP Executive KPI Ribbon */}
      <SopKpis />

      {/* Main Operational 2-Column Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: isTablet ? '1fr' : 'minmax(0, 1.5fr) minmax(0, 1.3fr)',
          gap: '16px',
          alignItems: 'start',
        }}
      >
        {/* Left Column: DC Inventory */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <MultiEchelonDcTable />
        </div>

        {/* Right Column: Factory Line Capacity */}
        <div>
          <FactoryCapacityModule />
        </div>
      </div>

      {/* Full-width section for BOM Explosion */}
      <div style={{ marginTop: '16px' }}>
        <BomExplosionModule />
      </div>

      {/* Full-width bottom section for Sensitivity Simulator */}
      <div style={{ marginTop: '16px' }}>
        <ServiceLevelSensitivity />
      </div>
    </PageTransitionLayout>
  );
};

export default SopPlanningPage;
