import React from 'react';
import { PageTransitionLayout } from '../layouts/PageTransitionLayout';
import { PageHeader } from '../components/ui/PageHeader';
import { DemandKpis } from '../components/demand/DemandKpis';
import { MultiHorizonForecastChart } from '../components/demand/MultiHorizonForecastChart';
import { SkuCategoryTable } from '../components/demand/SkuCategoryTable';
import { DemandDriversChart } from '../components/demand/DemandDriversChart';
import { DemandAnomaliesFeed } from '../components/demand/DemandAnomaliesFeed';
import { useMediaQuery } from '../hooks/useMediaQuery';

export const DemandPlanningPage: React.FC = () => {
  const isTablet = useMediaQuery('(max-width: 1024px)');

  return (
    <PageTransitionLayout>
      <PageHeader
        title="AI Demand Planning Studio"
        subtitle="Multi-horizon probabilistic demand forecasting powered by LightGBM, Prophet, and omnichannel demand sensing"
        badgeText="LightGBM + Prophet • 96.8% Accuracy"
        badgeVariant="cyan"
      />

      {/* KPI Summary Ribbon */}
      <DemandKpis />

      {/* Primary Forecast Chart */}
      <div style={{ marginBottom: '24px' }}>
        <MultiHorizonForecastChart />
      </div>

      {/* 2-Column Section: SKU Breakdown + (Drivers & Anomalies) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: isTablet ? '1fr' : 'minmax(0, 1.5fr) minmax(0, 1.2fr)',
          gap: '16px',
          alignItems: 'start',
        }}
      >
        {/* Left: SKU Category Forecast Breakdown */}
        <div>
          <SkuCategoryTable />
        </div>

        {/* Right: Feature Attribution Drivers */}
        <div>
          <DemandDriversChart />
        </div>
      </div>

      {/* Full-width bottom section for Anomalies Feed */}
      <div style={{ marginTop: '16px' }}>
        <DemandAnomaliesFeed />
      </div>
    </PageTransitionLayout>
  );
};

export default DemandPlanningPage;
