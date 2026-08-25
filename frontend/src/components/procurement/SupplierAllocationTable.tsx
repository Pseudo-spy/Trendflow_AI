import React from 'react';
import { CinematicCard } from '../ui/CinematicCard';
import { Badge } from '../ui/Badge';
import { Cpu } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

const allocationRows = [
  { supplier: 'Supplier A: Taipei Organic Fabrics', quantity: 48000, share: '38.4%', unitPrice: '$18.50', totalCost: '$888,000', risk: '6 / 100', delivery: '7 days', status: 'Optimal', badge: 'emerald' as const },
  { supplier: 'Supplier B: Shenzhen Mega Spinning', quantity: 36000, share: '28.8%', unitPrice: '$16.80', totalCost: '$604,800', risk: '12 / 100', delivery: '5 days', status: 'Optimal', badge: 'emerald' as const },
  { supplier: 'Supplier C: Hanoi Garments Ltd', quantity: 24000, share: '19.2%', unitPrice: '$14.20', totalCost: '$340,800', risk: '38 / 100', delivery: '12 days', status: 'Cap Limit', badge: 'amber' as const },
  { supplier: 'Supplier D: Frankfurt Eco Textiles', quantity: 10000, share: '8.0%', unitPrice: '$22.00', totalCost: '$220,000', risk: '8 / 100', delivery: '3 days', status: 'Fast-Track', badge: 'cyan' as const },
  { supplier: 'Supplier E: Americas Synthetic Mill', quantity: 7000, share: '5.6%', unitPrice: '$21.50', totalCost: '$150,500', risk: '10 / 100', delivery: '4 days', status: 'Fast-Track', badge: 'cyan' as const },
];

export const SupplierAllocationTable: React.FC = () => {
  const { mode } = useTheme();
  const isLight = mode === 'light';

  return (
    <CinematicCard
      title="Supplier Allocation & Spend Optimization Matrix"
      subtitle="Detailed procurement allocations with unit economics, transit lead times, and vulnerability ratings"
      icon={<Cpu size={18} color="#6366F1" />}
      glowColor="indigo"
      headerAction={<Badge variant="cyan">Total Allocated: $2,204,100</Badge>}
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
              <th style={{ padding: '8px 10px' }}>Supplier Entity</th>
              <th style={{ padding: '8px 10px' }}>Quantity</th>
              <th style={{ padding: '8px 10px' }}>Share (%)</th>
              <th style={{ padding: '8px 10px' }}>Unit Price</th>
              <th style={{ padding: '8px 10px' }}>Total Cost</th>
              <th style={{ padding: '8px 10px' }}>Risk Index</th>
              <th style={{ padding: '8px 10px' }}>Delivery</th>
              <th style={{ padding: '8px 10px' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {allocationRows.map((row, idx) => (
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
                  {row.quantity.toLocaleString()} u
                </td>
                <td style={{ padding: '10px 10px', color: '#06B6D4', fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>
                  {row.share}
                </td>
                <td style={{ padding: '10px 10px', color: isLight ? '#0F172A' : '#F8FAFC', fontWeight: 600, fontFamily: "'JetBrains Mono', monospace" }}>
                  {row.unitPrice}
                </td>
                <td style={{ padding: '10px 10px', color: '#16A34A', fontWeight: 800, fontFamily: "'JetBrains Mono', monospace" }}>
                  {row.totalCost}
                </td>
                <td style={{ padding: '10px 10px', color: row.risk.startsWith('38') ? '#F43F5E' : '#16A34A', fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>
                  {row.risk}
                </td>
                <td style={{ padding: '10px 10px', color: '#94A3B8' }}>
                  {row.delivery}
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
