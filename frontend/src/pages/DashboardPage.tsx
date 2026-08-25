import React from 'react';
import { PageTransitionLayout } from '../layouts/PageTransitionLayout';
import { PageHeader } from '../components/ui/PageHeader';
import { ControlTowerHero } from '../components/dashboard/ControlTowerHero';
import { ControlTowerKpis } from '../components/dashboard/ControlTowerKpis';
import { ForecastVsActualChart } from '../components/dashboard/ForecastVsActualChart';
import { SopHealthModule } from '../components/dashboard/SopHealthModule';
import { MaterialRequirementsModule } from '../components/dashboard/MaterialRequirementsModule';
import { ProcurementAllocationModule } from '../components/dashboard/ProcurementAllocationModule';
import { SupplierRiskModule } from '../components/dashboard/SupplierRiskModule';
import { AiInsightsModule } from '../components/dashboard/AiInsightsModule';
import { RecentActivityModule } from '../components/dashboard/RecentActivityModule';
import { useMediaQuery } from '../hooks/useMediaQuery';

export const DashboardPage: React.FC = () => {
  const isTablet = useMediaQuery('(max-width: 1024px)');

  return (
    <PageTransitionLayout>
      <PageHeader
        title="Supply Chain Control Tower"
        subtitle="Autonomous S&OP intelligence, multi-echelon buffer balancing & Google OR-Tools MILP optimization"
        badgeText="OR-Tools MILP • Live"
        badgeVariant="cyan"
      />

      {/* Signature 3D Hero Visualization with Node Telemetry Inspector */}
      <ControlTowerHero />

      {/* 8 Animated Count-Up KPI Cards */}
      <ControlTowerKpis />

      {/* Operational Modules Responsive Layout */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: isTablet ? '1fr' : 'minmax(0, 1.6fr) minmax(0, 1.4fr)',
          gap: '16px',
          alignItems: 'start',
        }}
      >
        {/* Left Column: Forecasting, Procurement MILP, and Material BOM */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <ForecastVsActualChart />
          <ProcurementAllocationModule />
          <MaterialRequirementsModule />
        </div>

        {/* Right Column: S&OP Health, Risk Radar, AI Insights, Activity Feed */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <SopHealthModule />
          <SupplierRiskModule />
          <AiInsightsModule />
          <RecentActivityModule />
        </div>
      </div>
    </PageTransitionLayout>
  );
};

export default DashboardPage;
