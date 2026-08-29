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
import { type SupplierAllocationDetail } from '../../services/api/procurementApi';
import { EmptyState } from '../ui/States';

interface AllocationRadialChartProps {
  data: SupplierAllocationDetail[] | null;
}

const COLORS = ['#06B6D4', '#16A34A', '#F59E0B', '#6366F1', '#38BDF8'];

export const AllocationRadialChart: React.FC<AllocationRadialChartProps> = ({ data }) => {
  const { mode } = useTheme();
  const isLight = mode === 'light';

  return (
    <CinematicCard
      title="Supplier Allocation Share"
      subtitle="Current allocation by supplier."
      icon={<Cpu size={18} color="#06B6D4" />}
      glowColor="cyan"
      headerAction={<Badge variant="cyan">Allocation Result</Badge>}
    >
      <div style={{ width: '100%', height: '200px', marginTop: '8px' }}>
        {!data || data.length === 0 ? (
          <EmptyState 
            title="No allocation data available" 
            message="Run procurement allocation to visualize the supplier distribution."
          />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 30, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={isLight ? 'rgba(15, 23, 42, 0.08)' : 'rgba(255, 255, 255, 0.05)'} />
              <XAxis type="number" stroke="#64748B" unit="%" />
              <YAxis dataKey="supplier_id" type="category" stroke="#64748B" fontSize={11} width={120} />
              <Tooltip
                formatter={(val, _name, item: any) => [
                  `${val}% (${item.payload.quantity.toLocaleString()} units • ${item.payload.unit_price}/u)`,
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
              <Bar dataKey="percentage" radius={[0, 6, 6, 0]} animationDuration={400}>
                {data.map((_entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </CinematicCard>
  );
};
