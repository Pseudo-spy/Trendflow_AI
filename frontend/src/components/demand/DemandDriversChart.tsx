import React from 'react';
import { CinematicCard } from '../ui/CinematicCard';
import { Badge } from '../ui/Badge';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from 'recharts';
import { Sparkles } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

const driverData = [
  { name: 'Sales Velocity', weight: 38, color: '#06B6D4' },
  { name: 'Seasonal Multiplier', weight: 26, color: '#6366F1' },
  { name: 'Price Elasticity', weight: 18, color: '#16A34A' },
  { name: 'Marketing Ad Spend', weight: 12, color: '#F59E0B' },
  { name: 'Macro Sentiment', weight: 6, color: '#F43F5E' },
];

export const DemandDriversChart: React.FC = () => {
  const { mode } = useTheme();
  const isLight = mode === 'light';

  return (
    <CinematicCard
      title="Demand Drivers & Feature Attribution"
      subtitle="Shapley value weights explaining model variance across multi-horizon forecasts"
      icon={<Sparkles size={18} color="#6366F1" />}
      glowColor="indigo"
      headerAction={<Badge variant="cyan">LightGBM Feature Importance</Badge>}
    >
      <div style={{ width: '100%', height: '200px', marginTop: '6px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={driverData} layout="vertical" margin={{ top: 5, right: 20, left: 30, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={isLight ? 'rgba(15, 23, 42, 0.08)' : 'rgba(255, 255, 255, 0.05)'} />
            <XAxis type="number" stroke="#64748B" unit="%" />
            <YAxis dataKey="name" type="category" stroke="#64748B" fontSize={11} width={110} />
            <Tooltip
              formatter={(val) => [`${val}% attribution`, 'Impact Weight']}
              contentStyle={{
                backgroundColor: isLight ? '#FFFFFF' : '#0F172A',
                borderColor: 'rgba(6, 182, 212, 0.3)',
                borderRadius: '8px',
                color: isLight ? '#0F172A' : '#F8FAFC',
                fontSize: '12px',
              }}
            />
            <Bar dataKey="weight" radius={[0, 6, 6, 0]} animationDuration={400}>
              {driverData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </CinematicCard>
  );
};
