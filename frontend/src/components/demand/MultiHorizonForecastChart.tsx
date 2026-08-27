import React, { useMemo } from 'react';
import { CinematicCard } from '../ui/CinematicCard';
import { Badge } from '../ui/Badge';
import { EmptyState } from '../ui/States';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { TrendingUp } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { type DemandHistoryItem, type DemandForecastItem } from '../../services/api/demandApi';

interface MultiHorizonForecastChartProps {
  historyData: DemandHistoryItem[];
  forecastData: DemandForecastItem[];
}

export const MultiHorizonForecastChart: React.FC<MultiHorizonForecastChartProps> = ({
  historyData,
  forecastData,
}) => {
  const { mode } = useTheme();
  const isLight = mode === 'light';

  const chartData = useMemo(() => {
    const mergedData: Record<string, { month: string; actual?: number; forecast?: number }> = {};

    historyData.forEach(item => {
      const date = new Date(item.demand_date);
      const monthStr = date.toLocaleString('default', { month: 'short' });
      if (!mergedData[monthStr]) mergedData[monthStr] = { month: monthStr };
      mergedData[monthStr].actual = item.quantity_sold;
    });

    forecastData.forEach(item => {
      const date = new Date(item.forecast_date);
      const monthStr = date.toLocaleString('default', { month: 'short' });
      if (!mergedData[monthStr]) mergedData[monthStr] = { month: monthStr };
      mergedData[monthStr].forecast = item.forecast_quantity;
    });

    const monthsOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return Object.values(mergedData).sort((a, b) =>
      monthsOrder.indexOf(a.month) - monthsOrder.indexOf(b.month)
    );
  }, [historyData, forecastData]);

  if (chartData.length === 0) {
    return <EmptyState title="No Demand Data" message="No historical or forecast data available for chart." />;
  }

  return (
    <CinematicCard
      title="Demand Trend Overview"
      subtitle="Historical actuals and projected demand from backend data"
      icon={<TrendingUp size={18} color="#06B6D4" />}
      glowColor="cyan"
    >
      {/* Legend */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '14px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#86A795' }}>
          <span style={{ width: '10px', height: '10px', borderRadius: '2px', backgroundColor: '#34D399' }} />
          <span>Historical Actuals</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#86A795' }}>
          <span style={{ width: '10px', height: '10px', borderRadius: '2px', backgroundColor: '#16A34A' }} />
          <span>Projected Demand</span>
        </div>
        <div style={{ marginLeft: 'auto' }}>
          <Badge variant="emerald">
            {chartData.length} Months
          </Badge>
        </div>
      </div>

      {/* Chart */}
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
