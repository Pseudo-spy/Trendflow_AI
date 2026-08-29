import React from 'react';
import { CinematicCard } from '../ui/CinematicCard';
import { Badge } from '../ui/Badge';
import { Boxes } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { EmptyState } from '../ui/States';

export const MultiEchelonDcTable: React.FC = () => {
  const { mode } = useTheme();
  const isLight = mode === 'light';

  return (
    <CinematicCard
      title="Distribution Center Inventory"
      subtitle="Distribution center inventory levels and requirements."
      icon={<Boxes size={18} color="#16A34A" />}
      glowColor="emerald"
      headerAction={<Badge variant="muted">Data Pending</Badge>}
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
              <th style={{ padding: '8px 10px' }}>Distribution Center</th>
              <th style={{ padding: '8px 10px' }}>SKU / Product</th>
              <th style={{ padding: '8px 10px' }}>Current Inventory</th>
              <th style={{ padding: '8px 10px' }}>Required Quantity</th>
              <th style={{ padding: '8px 10px' }}>Shortage / Gap</th>
              <th style={{ padding: '8px 10px' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={6} style={{ padding: '40px 0' }}>
                <EmptyState 
                  title="No distribution inventory available" 
                  message="Inventory distribution data will appear here soon."
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </CinematicCard>
  );
};
