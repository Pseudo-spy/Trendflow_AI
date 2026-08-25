import React from 'react';
import { PageTransitionLayout } from '../layouts/PageTransitionLayout';
import { PageHeader } from '../components/ui/PageHeader';
import { RiskKpis } from '../components/risk/RiskKpis';
import { RiskHeatmapMatrix } from '../components/risk/RiskHeatmapMatrix';
import { SupplierRiskTable } from '../components/risk/SupplierRiskTable';
import { RiskThreatFeed } from '../components/risk/RiskThreatFeed';

export const RiskAnalysisPage: React.FC = () => {
  return (
    <PageTransitionLayout>
      <PageHeader
        title="Supplier Risk Command Center"
        subtitle="Continuous telemetry monitoring geopolitical stability, port congestion, extreme climate events, and automated buffer rerouting"
        badgeText="Risk AI • Live Surveillance"
        badgeVariant="rose"
      />

      {/* KPI Ribbon */}
      <RiskKpis />

      {/* 2D Interactive Risk Heatmap Matrix */}
      <div style={{ marginBottom: '24px' }}>
        <RiskHeatmapMatrix />
      </div>

      {/* Supplier Risk Scoring Table & Live Threat Stream */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <SupplierRiskTable />
        <RiskThreatFeed />
      </div>
    </PageTransitionLayout>
  );
};

export default RiskAnalysisPage;
