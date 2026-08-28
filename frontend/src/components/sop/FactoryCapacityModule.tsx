import React from 'react';
import { CinematicCard } from '../ui/CinematicCard';
import { Badge } from '../ui/Badge';
import { Activity } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { EmptyState } from '../ui/States';

export const FactoryCapacityModule: React.FC = () => {
  const { mode } = useTheme();
  const isLight = mode === 'light';

  return (
    <CinematicCard
      title="Factory Capacity"
      subtitle="Production capacity visibility."
      icon={<Activity size={18} color="#6366F1" />}
      glowColor="indigo"
      headerAction={<Badge variant="muted">Backend Pending</Badge>}
    >
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
          <thead>
            <tr
              style={{
                borderBottom: isLight ? '1px solid rgba(15, 23, 42, 0.1)' : '1px solid rgba(255, 255, 255, 0.08)',
                textAlign: 'left',
                color: '#64748B',
                fontSize: '11px',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              <th style={{ padding: '8px 10px' }}>Factory / Plant</th>
              <th style={{ padding: '8px 10px' }}>Production Line</th>
              <th style={{ padding: '8px 10px' }}>Available Capacity</th>
              <th style={{ padding: '8px 10px' }}>Required Capacity</th>
              <th style={{ padding: '8px 10px' }}>Capacity Utilization</th>
              <th style={{ padding: '8px 10px' }}>Capacity Gap</th>
              <th style={{ padding: '8px 10px' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={7} style={{ padding: '40px 0' }}>
                <EmptyState 
                  title="No factory capacity data available" 
                  message="Factory capacity data will appear here after backend integration."
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </CinematicCard>
  );
};
