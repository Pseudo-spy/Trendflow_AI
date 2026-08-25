import React, { useState } from 'react';
import { CinematicCard } from '../ui/CinematicCard';
import { Badge } from '../ui/Badge';
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

const forecastData90D = [
  { month: 'Apr', actual: 16800, forecast: 16600, upperCI: 17200, lowerCI: 16000 },
  { month: 'May', actual: 21200, forecast: 20900, upperCI: 21800, lowerCI: 20100 },
  { month: 'Jun', actual: 28400, forecast: 28000, upperCI: 29200, lowerCI: 27100 },
  { month: 'Jul', actual: 32600, forecast: 32100, upperCI: 33800, lowerCI: 31000 },
  { month: 'Aug', actual: null, forecast: 36800, upperCI: 38900, lowerCI: 34800 },
  { month: 'Sep', actual: null, forecast: 41200, upperCI: 43800, lowerCI: 38700 },
  { month: 'Oct', actual: null, forecast: 38500, upperCI: 41200, lowerCI: 35900 },
  { month: 'Nov', actual: null, forecast: 46200, upperCI: 49500, lowerCI: 43100 },
  { month: 'Dec', actual: null, forecast: 52400, upperCI: 56200, lowerCI: 48900 },
];

export const ForecastVsActualChart: React.FC = () => {
  const [horizon, setHorizon] = useState<'60D' | '90D' | '180D'>('90D');
  const { mode } = useTheme();
  const isLight = mode === 'light';

  return (
    <CinematicCard
      title="Demand Forecast vs Historical Actuals"
      subtitle="Probabilistic multi-horizon forecasting with LightGBM + Prophet 95% confidence bounds"
      icon={<TrendingUp size={18} color="#06B6D4" />}
      glowColor="cyan"
      headerAction={
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {(['60D', '90D', '180D'] as const).map((h) => (
            <button
              key={h}
              onClick={() => setHorizon(h)}
              style={{
                padding: '4px 10px',
                borderRadius: '6px',
                background: horizon === h ? (isLight ? 'rgba(2, 132, 199, 0.15)' : 'rgba(6, 182, 212, 0.25)') : 'transparent',
                border: horizon === h ? '1px solid #06B6D4' : '1px solid transparent',
                color: horizon === h ? (isLight ? '#0284C7' : '#38BDF8') : '#94A3B8',
                fontSize: '11px',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              {h}
            </button>
          ))}
        </div>
      }
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '14px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#94A3B8' }}>
          <span style={{ width: '10px', height: '10px', borderRadius: '2px', backgroundColor: '#16A34A' }} />
          <span>Historical Actuals</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#94A3B8' }}>
          <span style={{ width: '10px', height: '10px', borderRadius: '2px', backgroundColor: '#06B6D4' }} />
          <span>AI Projected Forecast</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#94A3B8' }}>
          <span style={{ width: '10px', height: '10px', borderRadius: '2px', backgroundColor: 'rgba(99, 102, 241, 0.3)' }} />
          <span>95% Confidence Interval Band</span>
        </div>
        <div style={{ marginLeft: 'auto' }}>
          <Badge variant="cyan">
            MAPE: 3.2% (96.8% Accuracy)
          </Badge>
        </div>
      </div>

      <div style={{ width: '100%', height: '300px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={forecastData90D} margin={{ top: 10, right: 20, left: 15, bottom: 0 }}>
            <defs>
              <linearGradient id="forecastCyan" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#06B6D4" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="ciBand" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366F1" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#6366F1" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={isLight ? 'rgba(15, 23, 42, 0.08)' : 'rgba(255, 255, 255, 0.05)'} />
            <XAxis dataKey="month" stroke="#64748B" />
            <YAxis
              stroke="#64748B"
              width={52}
              tickFormatter={(val: number) => (val >= 1000 ? `${val / 1000}k` : `${val}`)}
              tick={{ fontSize: 11, fill: '#64748B' }}
            />
            <Tooltip
              formatter={(value: any, name: any) => [
                typeof value === 'number' ? `${value.toLocaleString()} units` : value,
                name,
              ]}
              contentStyle={{
                backgroundColor: isLight ? '#FFFFFF' : '#0F172A',
                borderColor: 'rgba(6, 182, 212, 0.3)',
                borderRadius: '8px',
                color: isLight ? '#0F172A' : '#F8FAFC',
                fontSize: '12px',
              }}
            />
            {/* Confidence Interval Area */}
            <Area
              animationDuration={400}
              type="monotone"
              dataKey="upperCI"
              stroke="transparent"
              fillOpacity={1}
              fill="url(#ciBand)"
              name="Upper 95% Bound"
            />
            {/* AI Forecast */}
            <Area
              animationDuration={400}
              type="monotone"
              dataKey="forecast"
              stroke="#06B6D4"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#forecastCyan)"
              name="AI Projected Demand"
            />
            {/* Actuals */}
            <Area
              animationDuration={400}
              type="monotone"
              dataKey="actual"
              stroke="#16A34A"
              strokeWidth={3}
              fillOpacity={0}
              name="Actual Sales"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </CinematicCard>
  );
};
