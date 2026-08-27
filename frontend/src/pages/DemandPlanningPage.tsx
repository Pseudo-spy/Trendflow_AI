import React, { useState, useEffect, useMemo } from 'react';
import { PageTransitionLayout } from '../layouts/PageTransitionLayout';
import { PageHeader } from '../components/ui/PageHeader';
import { DemandKpis } from '../components/demand/DemandKpis';
import { MultiHorizonForecastChart } from '../components/demand/MultiHorizonForecastChart';
import { DemandHistoryTable } from '../components/demand/SkuCategoryTable';
import { DemandDriversChart } from '../components/demand/DemandDriversChart';
import { DemandForecastTable } from '../components/demand/DemandAnomaliesFeed';
import { LoadingState, ErrorState } from '../components/ui/States';
import { GlowButton } from '../components/ui/GlowButton';
import { RefreshCcw, Search, X } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { useMediaQuery } from '../hooks/useMediaQuery';
import {
  fetchDemandHistory,
  fetchDemandForecast,
  type DemandHistoryItem,
  type DemandForecastItem,
} from '../services/api/demandApi';

export const DemandPlanningPage: React.FC = () => {
  const isTablet = useMediaQuery('(max-width: 1024px)');
  const { mode } = useTheme();
  const isLight = mode === 'light';

  const [historyData, setHistoryData] = useState<DemandHistoryItem[]>([]);
  const [forecastData, setForecastData] = useState<DemandForecastItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [skuFilter, setSkuFilter] = useState('');
  const [appliedSku, setAppliedSku] = useState<string | undefined>(undefined);

  const loadData = async (sku?: string) => {
    try {
      setLoading(true);
      setError(null);
      const [historyRes, forecastRes] = await Promise.all([
        fetchDemandHistory(sku),
        fetchDemandForecast(sku),
      ]);
      if (historyRes.success) setHistoryData(historyRes.data || []);
      if (forecastRes.success) setForecastData(forecastRes.data || []);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch demand data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSkuSearch = () => {
    const sku = skuFilter.trim() || undefined;
    setAppliedSku(sku);
    loadData(sku);
  };

  const handleClearSku = () => {
    setSkuFilter('');
    setAppliedSku(undefined);
    loadData();
  };

  // KPI aggregations from fetched data
  const kpiData = useMemo(() => ({
    totalHistoryRecords: historyData.length,
    totalHistoryQuantity: historyData.reduce((sum, d) => sum + d.quantity_sold, 0),
    totalForecastRecords: forecastData.length,
    totalForecastQuantity: forecastData.reduce((sum, d) => sum + d.forecast_quantity, 0),
  }), [historyData, forecastData]);

  return (
    <PageTransitionLayout>
      <PageHeader
        title="Demand Planning"
        subtitle="Historical demand analysis and baseline forecast data"
        badgeText="Demand"
        badgeVariant="cyan"
        actions={
          <GlowButton
            variant="secondary"
            size="sm"
            icon={<RefreshCcw size={14} />}
            onClick={() => loadData(appliedSku)}
            loading={loading}
          >
            Refresh
          </GlowButton>
        }
      />

      {/* SKU Filter Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          marginBottom: '20px',
          flexWrap: 'wrap',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 10px',
            borderRadius: '8px',
            background: isLight ? '#F8FAFC' : '#0A120D',
            border: isLight ? '1px solid #E2E8F0' : '1px solid #1B3B2B',
            maxWidth: '260px',
            flex: '1 1 200px',
          }}
        >
          <Search size={14} color="#64748B" />
          <input
            type="text"
            placeholder="Filter by SKU (e.g. TW001)"
            value={skuFilter}
            onChange={e => setSkuFilter(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSkuSearch()}
            style={{
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: isLight ? '#0F172A' : '#F0FDF4',
              fontSize: '12px',
              width: '100%',
            }}
          />
        </div>
        <GlowButton variant="secondary" size="sm" onClick={handleSkuSearch}>
          Apply
        </GlowButton>
        {appliedSku && (
          <GlowButton variant="ghost" size="sm" icon={<X size={12} />} onClick={handleClearSku}>
            Clear SKU
          </GlowButton>
        )}
      </div>

      {loading && <LoadingState message="Fetching Demand Data..." />}

      {error && <ErrorState error={error} onRetry={() => loadData(appliedSku)} />}

      {!loading && !error && (
        <>
          {/* KPI Summary Ribbon */}
          <DemandKpis
            totalHistoryRecords={kpiData.totalHistoryRecords}
            totalHistoryQuantity={kpiData.totalHistoryQuantity}
            totalForecastRecords={kpiData.totalForecastRecords}
            totalForecastQuantity={kpiData.totalForecastQuantity}
          />

          {/* Primary Chart */}
          <div style={{ marginBottom: '24px' }}>
            <MultiHorizonForecastChart
              historyData={historyData}
              forecastData={forecastData}
            />
          </div>

          {/* Main Layout Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: isTablet ? '1fr' : 'minmax(0, 1.8fr) minmax(0, 1fr)',
              gap: '16px',
              alignItems: 'start',
              marginBottom: '16px',
            }}
          >
            {/* Left Column */}
            <div>
              <DemandHistoryTable data={historyData} />
            </div>

            {/* Run Panel Column */}
            <div>
              <DemandDriversChart />
            </div>
          </div>

          {/* Full-width Forecast Table */}
          <div>
            <DemandForecastTable data={forecastData} />
          </div>
        </>
      )}
    </PageTransitionLayout>
  );
};

export default DemandPlanningPage;
