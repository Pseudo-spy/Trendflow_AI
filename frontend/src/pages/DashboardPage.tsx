import React from 'react';
import { PageTransitionLayout } from '../layouts/PageTransitionLayout';
import { PageHeader } from '../components/ui/PageHeader';
import { ControlTowerHero } from '../components/dashboard/ControlTowerHero';
import { ControlTowerKpis } from '../components/dashboard/ControlTowerKpis';
import { ForecastVsActualChart } from '../components/dashboard/ForecastVsActualChart';
import { MaterialRequirementsModule } from '../components/dashboard/MaterialRequirementsModule';
import { ProcurementAllocationModule } from '../components/dashboard/ProcurementAllocationModule';
import { SupplierRiskModule } from '../components/dashboard/SupplierRiskModule';
import { SopHealthModule } from '../components/dashboard/SopHealthModule';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { useDashboardData } from '../hooks/useDashboardData';
import { useOutletContext } from 'react-router-dom';
import type { AppOutletContext } from '../layouts/AppLayout';

export const DashboardPage: React.FC = () => {
  const isTablet = useMediaQuery('(max-width: 1024px)');
  const { data } = useDashboardData();
  const sessionContext = useOutletContext<AppOutletContext>();

  return (
    <PageTransitionLayout>
      <PageHeader
        title="Supply Chain Control Tower"
        subtitle="Unified visibility across demand, inventory, suppliers, planning and procurement."
      />

      {/* PROTECTED: 3D Hero */}
      <ControlTowerHero />

      {/* KPIs built from GET data and session state */}
      <ControlTowerKpis data={data} sessionContext={sessionContext} />

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: isTablet ? '1fr' : 'minmax(0, 1.6fr) minmax(0, 1.4fr)',
          gap: '16px',
          alignItems: 'start',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <ForecastVsActualChart demandHistory={data?.demandHistory} demandForecast={data?.demandForecast} />
          <ProcurementAllocationModule latestProcurementResult={sessionContext?.latestProcurementResult} />
          <MaterialRequirementsModule latestSopResult={sessionContext?.latestSopResult} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <SopHealthModule inventory={data?.inventory} />
          <SupplierRiskModule suppliers={data?.suppliers} latestRiskResult={sessionContext?.latestRiskResult} />
        </div>
      </div>
    </PageTransitionLayout>
  );
};

export default DashboardPage;
