import React, { useState, useEffect } from 'react';
import { CinematicCard } from '../ui/CinematicCard';
import { Badge } from '../ui/Badge';
import { GlowButton } from '../ui/GlowButton';
import { LoadingState, ErrorState, EmptyState } from '../ui/States';
import { fetchDemandHistory, fetchDemandForecast, runForecast } from '../../services/api/demandApi';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { TrendingUp, Play } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

export const MultiHorizonForecastChart: React.FC = () => {
  const [horizon, setHorizon] = useState<'30D' | '60D' | '90D' | '180D'>('90D');
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [runningForecast, setRunningForecast] = useState(false);
  const [forecastMessage, setForecastMessage] = useState<string | null>(null);

  const { mode } = useTheme();
  const isLight = mode === 'light';

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      setForecastMessage(null);

      const [historyRes, forecastRes] = await Promise.all([
        fetchDemandHistory('TW001'),
        fetchDemandForecast('TW001')
      ]);

      const mergedData: Record<string, any> = {};

      if (historyRes.success && historyRes.data) {
        historyRes.data.forEach(item => {
          const date = new Date(item.demand_date);
          const monthStr = date.toLocaleString('default', { month: 'short' });
          if (!mergedData[monthStr]) mergedData[monthStr] = { month: monthStr };
          mergedData[monthStr].actual = item.quantity_sold;
        });
      }

      if (forecastRes.success && forecastRes.data) {
        forecastRes.data.forEach(item => {
          const date = new Date(item.forecast_date);
          const monthStr = date.toLocaleString('default', { month: 'short' });
          if (!mergedData[monthStr]) mergedData[monthStr] = { month: monthStr };
          mergedData[monthStr].forecast = item.forecast_quantity;
        });
      }

      // Convert dict to sorted array (assuming chronological order of months in the year)
      const monthsOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const sortedArray = Object.values(mergedData).sort((a, b) => {
        return monthsOrder.indexOf(a.month) - monthsOrder.indexOf(b.month);
      });

      setChartData(sortedArray);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch demand data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [horizon]);

  const handleRunForecast = async () => {
    try {
      setRunningForecast(true);
      setForecastMessage(null);
      const res = await runForecast({ sku: 'TW001', horizon_months: 3 });
      if (res.success) {
        setForecastMessage(`Forecast updated! Model: ${res.model_version}, Confidence: ${res.confidence}%`);
        await loadData();
      }
    } catch (err: any) {
      setForecastMessage(`Error: ${err.message || 'Failed to run forecast'}`);
    } finally {
      setRunningForecast(false);
    }
  };

  if (loading) return <LoadingState message="Fetching Multi-Horizon Demand..." />;
  if (error) return <ErrorState error={error} onRetry={loadData} />;
  if (chartData.length === 0) return <EmptyState title="No Demand Data" message="No historical or forecast data available." />;

  return (
    <CinematicCard
      title="Multi-Horizon Probabilistic Demand Forecast"
      subtitle="Ensemble predictions powered by LightGBM + Prophet with seasonal confidence intervals"
      icon={<TrendingUp size={18} color="#06B6D4" />}
      glowColor="cyan"
      headerAction={
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {/* Run Forecast Action */}
          <GlowButton
            variant="primary"
            size="sm"
            onClick={handleRunForecast}
            disabled={runningForecast}
            icon={<Play size={12} />}
          >
            {runningForecast ? 'Running...' : 'Run Forecast'}
          </GlowButton>

          {/* Horizon Selector */}
          <div style={{ display: 'flex', gap: '4px' }}>
            {(['30D', '60D', '90D', '180D'] as const).map((h) => (
              <button
                key={h}
                onClick={() => setHorizon(h)}
                style={{
                  padding: '3px 8px',
                  borderRadius: '6px',
                  background: horizon === h ? (isLight ? '#D1FAE5' : '#071A11') : 'transparent',
                  border: horizon === h ? '1px solid #16A34A' : '1px solid transparent',
                  color: horizon === h ? (isLight ? '#064E3B' : '#34D399') : '#86A795',
                  fontSize: '10px',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                {h}
              </button>
            ))}
          </div>
        </div>
      }
    >
      {/* Legend & Confidence Metadata */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '14px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#86A795' }}>
          <span style={{ width: '10px', height: '10px', borderRadius: '2px', backgroundColor: '#34D399' }} />
          <span>Historical POS Actuals</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#86A795' }}>
          <span style={{ width: '10px', height: '10px', borderRadius: '2px', backgroundColor: '#16A34A' }} />
          <span>Projected Demand (Baseline)</span>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px', alignItems: 'center' }}>
          {forecastMessage && (
            <span style={{ fontSize: '11px', color: forecastMessage.startsWith('Error') ? '#F43F5E' : '#10B981' }}>
              {forecastMessage}
            </span>
          )}
          <Badge variant="emerald">
            Live Feed
          </Badge>
        </div>
      </div>

      {/* Chart Canvas with proper Y-Axis spacing */}
      <div style={{ width: '100%', height: '280px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 20, left: 15, bottom: 0 }}>
            <defs>
              <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#34D399" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#34D399" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorForecast" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#16A34A" stopOpacity={0.6} />
                <stop offset="95%" stopColor="#16A34A" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isLight ? 'rgba(15, 23, 42, 0.05)' : 'rgba(255, 255, 255, 0.05)'} />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: '#64748B' }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: '#64748B' }}
              tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
              dx={-10}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: isLight ? '#FFFFFF' : '#0F172A',
                border: isLight ? '1px solid #E2E8F0' : '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                fontSize: '12px'
              }}
            />
            <Area
              animationDuration={400}
              type="monotone"
              dataKey="actual"
              stroke="#34D399"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorActual)"
              name="Historical Actuals"
            />

            <Area
              animationDuration={400}
              type="monotone"
              dataKey="forecast"
              stroke="#16A34A"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorForecast)"
              strokeDasharray="4 4"
              name="Projected Forecast"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </CinematicCard>
  );
};
