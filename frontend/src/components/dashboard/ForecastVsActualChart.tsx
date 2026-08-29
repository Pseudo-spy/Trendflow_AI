import React, { useMemo } from 'react';
import { CinematicCard } from '../ui/CinematicCard';
import { Badge } from '../ui/Badge';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { TrendingUp } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { type DemandHistoryItem, type DemandForecastItem } from '../../services/api/demandApi';

interface ForecastVsActualChartProps {
  demandHistory?: DemandHistoryItem[];
  demandForecast?: DemandForecastItem[];
}

export const ForecastVsActualChart: React.FC<ForecastVsActualChartProps> = ({ demandHistory, demandForecast }) => {
  const { mode } = useTheme();
  const isLight = mode === 'light';

  const chartData = useMemo(() => {
    // Merge history and forecast based on date
    const dateMap = new Map<string, any>();
    
    if (demandHistory) {
      demandHistory.forEach(record => {
        dateMap.set(record.demand_date, {
          name: record.demand_date,
          actual: record.quantity_sold
        });
      });
    }

    if (demandForecast) {
      demandForecast.forEach(record => {
        const existing = dateMap.get(record.forecast_date) || { name: record.forecast_date };
        existing.forecast = record.forecast_quantity;
        dateMap.set(record.forecast_date, existing);
      });
    }

    const merged = Array.from(dateMap.values());
    merged.sort((a, b) => new Date(a.name).getTime() - new Date(b.name).getTime());
    return merged;
  }, [demandHistory, demandForecast]);

  return (
    <CinematicCard
      title="Demand History & Forecast"
      subtitle="Historical demand and stored forecast values."
      icon={<TrendingUp size={18} color="#8B5CF6" />}
      glowColor="indigo"
      headerAction={<Badge variant="indigo">Stored Forecast</Badge>}
    >
      <div style={{ width: '100%', height: '240px', marginTop: '16px' }}>
        {chartData.length === 0 ? (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748B' }}>
            No demand data available
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#06B6D4" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorForecast" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke={isLight ? 'rgba(15,23,42,0.05)' : 'rgba(255,255,255,0.05)'}
              />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: isLight ? '#64748B' : '#94A3B8', fontSize: 10 }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: isLight ? '#64748B' : '#94A3B8', fontSize: 10 }}
                dx={-10}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: isLight ? 'rgba(255,255,255,0.9)' : 'rgba(15,23,42,0.9)',
                  borderColor: isLight ? 'rgba(15,23,42,0.1)' : 'rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  color: isLight ? '#0F172A' : '#F8FAFC',
                }}
                itemStyle={{ fontSize: '12px', fontWeight: 600 }}
                labelStyle={{ color: '#64748B', marginBottom: '4px', fontSize: '11px' }}
              />
              <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Area
                type="monotone"
                dataKey="actual"
                name="Historical Actuals"
                stroke="#06B6D4"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorActual)"
                activeDot={{ r: 6, fill: '#06B6D4', stroke: '#fff', strokeWidth: 2 }}
              />
              <Area
                type="monotone"
                dataKey="forecast"
                name="Projected Forecast"
                stroke="#8B5CF6"
                strokeWidth={2}
                strokeDasharray="5 5"
                fillOpacity={1}
                fill="url(#colorForecast)"
                activeDot={{ r: 6, fill: '#8B5CF6', stroke: '#fff', strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </CinematicCard>
  );
};
