import React from 'react';
import { CinematicCard } from '../ui/CinematicCard';
import { Badge } from '../ui/Badge';
import { Cpu } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

const supplierAllocations = [
  { supplier: 'Taipei Organic Fabrics', allocation: 48000, share: '38.4%', unitCost: '$18.50', leadTime: '7 days', moq: '10,000 u', status: 'Optimal', badge: 'emerald' as const },
  { supplier: 'Shenzhen Mega Spinning', allocation: 36000, share: '28.8%', unitCost: '$16.80', leadTime: '5 days', moq: '15,000 u', status: 'Optimal', badge: 'emerald' as const },
  { supplier: 'Hanoi Garments Ltd', allocation: 24000, share: '19.2%', unitCost: '$14.20', leadTime: '12 days', moq: '8,000 u', status: 'Cap Reached', badge: 'amber' as const },
  { supplier: 'Frankfurt Eco Textiles', allocation: 10000, share: '8.0%', unitCost: '$22.00', leadTime: '3 days', moq: '5,000 u', status: 'Fast-Track', badge: 'cyan' as const },
  { supplier: 'Americas Synthetic Mill', allocation: 7000, share: '5.6%', unitCost: '$21.50', leadTime: '4 days', moq: '5,000 u', status: 'Fast-Track', badge: 'cyan' as const },
];

export const ProcurementAllocationModule: React.FC = () => {
  const { mode } = useTheme();
  const isLight = mode === 'light';

  return (
    <CinematicCard
      title="Procurement Order Allocation (Google OR-Tools MILP)"
      subtitle="Mathematical optimization allocating purchase volumes across supplier MOQs, price breaks, and tariffs"
      icon={<Cpu size={18} color="#6366F1" />}
      glowColor="indigo"
      headerAction={<Badge variant="cyan" pulse>MILP Optimal (842ms)</Badge>}
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
              <th style={{ padding: '8px 10px' }}>Qualified Supplier</th>
              <th style={{ padding: '8px 10px' }}>Allocated Volume</th>
              <th style={{ padding: '8px 10px' }}>Quota Share</th>
              <th style={{ padding: '8px 10px' }}>Unit Cost</th>
              <th style={{ padding: '8px 10px' }}>Lead Time</th>
              <th style={{ padding: '8px 10px' }}>Tier MOQ</th>
              <th style={{ padding: '8px 10px' }}>Solver Status</th>
            </tr>
          </thead>
          <tbody>
            {supplierAllocations.map((row, idx) => (
              <tr
                key={idx}
                style={{
                  borderBottom: isLight ? '1px solid rgba(15, 23, 42, 0.04)' : '1px solid rgba(255, 255, 255, 0.04)',
                }}
              >
                <td style={{ padding: '10px 10px', fontWeight: 700, color: isLight ? '#0F172A' : '#F8FAFC' }}>
                  {row.supplier}
                </td>
                <td style={{ padding: '10px 10px', fontWeight: 800, color: isLight ? '#0F172A' : '#F8FAFC', fontFamily: "'JetBrains Mono', monospace" }}>
                  {row.allocation.toLocaleString()} units
                </td>
                <td style={{ padding: '10px 10px', color: '#06B6D4', fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>
                  {row.share}
                </td>
                <td style={{ padding: '10px 10px', color: '#16A34A', fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>
                  {row.unitCost}
                </td>
                <td style={{ padding: '10px 10px', color: '#94A3B8' }}>
                  {row.leadTime}
                </td>
                <td style={{ padding: '10px 10px', color: '#64748B', fontFamily: "'JetBrains Mono', monospace" }}>
                  {row.moq}
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
