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
import { Cpu } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

const allocationData = [
  { name: 'Taipei Organic', share: 38.4, volume: 48000, unitCost: 18.50, color: '#06B6D4' },
  { name: 'Shenzhen Mega', share: 28.8, volume: 36000, unitCost: 16.80, color: '#16A34A' },
  { name: 'Hanoi Garments', share: 19.2, volume: 24000, unitCost: 14.20, color: '#F59E0B' },
  { name: 'Frankfurt Eco', share: 8.0, volume: 10000, unitCost: 22.00, color: '#6366F1' },
  { name: 'Americas Synthetic', share: 5.6, volume: 7000, unitCost: 21.50, color: '#38BDF8' },
];

export const AllocationRadialChart: React.FC = () => {
  const { mode } = useTheme();
  const isLight = mode === 'light';

  return (
    <CinematicCard
      title="Optimal Supplier Allocation Share & Quota Distribution"
      subtitle="Google OR-Tools MILP quota allocation balancing MOQ tier price breaks against transit times"
      icon={<Cpu size={18} color="#06B6D4" />}
      glowColor="cyan"
      headerAction={<Badge variant="cyan">125,000 Units Total</Badge>}
    >
      <div style={{ width: '100%', height: '200px', marginTop: '8px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={allocationData} layout="vertical" margin={{ top: 5, right: 30, left: 30, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={isLight ? 'rgba(15, 23, 42, 0.08)' : 'rgba(255, 255, 255, 0.05)'} />
            <XAxis type="number" stroke="#64748B" unit="%" />
            <YAxis dataKey="name" type="category" stroke="#64748B" fontSize={11} width={120} />
            <Tooltip
              formatter={(val, _name, item: any) => [
                `${val}% (${item.payload.volume.toLocaleString()} units • $${item.payload.unitCost}/u)`,
                'Allocation Share',
              ]}
              contentStyle={{
                backgroundColor: isLight ? '#FFFFFF' : '#0F172A',
                borderColor: 'rgba(6, 182, 212, 0.3)',
                borderRadius: '8px',
                color: isLight ? '#0F172A' : '#F8FAFC',
                fontSize: '12px',
              }}
            />
            <Bar dataKey="share" radius={[0, 6, 6, 0]} animationDuration={400}>
              {allocationData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </CinematicCard>
  );
};
