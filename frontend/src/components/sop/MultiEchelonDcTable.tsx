import React from 'react';
import { CinematicCard } from '../ui/CinematicCard';
import { Badge } from '../ui/Badge';
import { Boxes } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

const dcDistribution = [
  { dc: 'Taipei Central Hub', cycleStock: '32,000 u', safetyStock: '14,000 u', rop: '18,500 u', dos: '14.2 days', fillRate: '99.2%', status: 'Optimal', badge: 'emerald' as const },
  { dc: 'Shenzhen Mega Assembly', cycleStock: '45,000 u', safetyStock: '18,000 u', rop: '24,000 u', dos: '12.8 days', fillRate: '98.9%', status: 'Optimal', badge: 'emerald' as const },
  { dc: 'Hanoi Regional DC', cycleStock: '22,000 u', safetyStock: '12,000 u', rop: '14,000 u', dos: '16.5 days', fillRate: '96.8%', status: 'Rebalancing', badge: 'amber' as const },
  { dc: 'Frankfurt European DC', cycleStock: '28,000 u', safetyStock: '15,000 u', rop: '16,000 u', dos: '15.0 days', fillRate: '99.4%', status: 'Optimal', badge: 'emerald' as const },
  { dc: 'Seattle Americas Gateway', cycleStock: '36,000 u', safetyStock: '16,000 u', rop: '20,000 u', dos: '13.5 days', fillRate: '98.6%', status: 'Optimal', badge: 'emerald' as const },
];

export const MultiEchelonDcTable: React.FC = () => {
  const { mode } = useTheme();
  const isLight = mode === 'light';

  return (
    <CinematicCard
      title="Multi-Echelon DC Inventory & Safety Buffer Balancing"
      subtitle="Stock balancing across distribution hubs optimizing cycle inventory and safety stock thresholds"
      icon={<Boxes size={18} color="#16A34A" />}
      glowColor="emerald"
      headerAction={<Badge variant="emerald">5 Connected DCs</Badge>}
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
              <th style={{ padding: '8px 10px' }}>Fulfillment DC</th>
              <th style={{ padding: '8px 10px' }}>Cycle Stock</th>
              <th style={{ padding: '8px 10px' }}>Safety Stock</th>
              <th style={{ padding: '8px 10px' }}>Reorder Point</th>
              <th style={{ padding: '8px 10px' }}>Target DOS</th>
              <th style={{ padding: '8px 10px' }}>Fill Rate</th>
              <th style={{ padding: '8px 10px' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {dcDistribution.map((row, idx) => (
              <tr
                key={idx}
                style={{
                  borderBottom: isLight ? '1px solid rgba(15, 23, 42, 0.04)' : '1px solid rgba(255, 255, 255, 0.04)',
                }}
              >
                <td style={{ padding: '10px 10px', fontWeight: 700, color: isLight ? '#0F172A' : '#F8FAFC' }}>
                  {row.dc}
                </td>
                <td style={{ padding: '10px 10px', color: '#94A3B8', fontFamily: "'JetBrains Mono', monospace" }}>
                  {row.cycleStock}
                </td>
                <td style={{ padding: '10px 10px', color: '#06B6D4', fontWeight: 600, fontFamily: "'JetBrains Mono', monospace" }}>
                  {row.safetyStock}
                </td>
                <td style={{ padding: '10px 10px', color: '#6366F1', fontFamily: "'JetBrains Mono', monospace" }}>
                  {row.rop}
                </td>
                <td style={{ padding: '10px 10px', color: '#64748B', fontFamily: "'JetBrains Mono', monospace" }}>
                  {row.dos}
                </td>
                <td style={{ padding: '10px 10px', fontWeight: 800, color: row.fillRate >= '98.0%' ? '#16A34A' : '#F59E0B', fontFamily: "'JetBrains Mono', monospace" }}>
                  {row.fillRate}
                </td>
                <td style={{ padding: '10px 10px' }}>
                  <Badge variant={row.badge}>
                    {row.status}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </CinematicCard>
  );
};
