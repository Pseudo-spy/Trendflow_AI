import React from 'react';
import { CinematicCard } from '../ui/CinematicCard';
import { Badge } from '../ui/Badge';
import { Boxes } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

const dcInventory = [
  { dc: 'Taipei Central Hub', cycleStock: 32000, safetyStock: 14000, fillRate: 99.2, status: 'Optimal' },
  { dc: 'Shenzhen Mega Assembly', cycleStock: 45000, safetyStock: 18000, fillRate: 98.9, status: 'Optimal' },
  { dc: 'Hanoi Regional Hub', cycleStock: 22000, safetyStock: 12000, fillRate: 96.8, status: 'Warning' },
  { dc: 'Frankfurt European DC', cycleStock: 28000, safetyStock: 15000, fillRate: 99.4, status: 'Optimal' },
  { dc: 'Seattle Americas Gateway', cycleStock: 36000, safetyStock: 16000, fillRate: 98.6, status: 'Optimal' },
];

export const SopHealthModule: React.FC = () => {
  const { mode } = useTheme();
  const isLight = mode === 'light';

  return (
    <CinematicCard
      title="S&OP Health & Multi-Echelon Buffer Balance"
      subtitle="Balancing safety stock buffers against holding costs across global distribution hubs"
      icon={<Boxes size={18} color="#16A34A" />}
      glowColor="emerald"
      headerAction={<Badge variant="emerald" pulse>98.8% Global Fill Rate</Badge>}
    >
      {/* Top High-Level Health Bar */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '12px',
          padding: '14px',
          borderRadius: '10px',
          background: isLight ? 'rgba(15, 23, 42, 0.03)' : 'rgba(255, 255, 255, 0.03)',
          marginBottom: '16px',
        }}
      >
        <div>
          <div style={{ fontSize: '11px', color: '#64748B' }}>Total Cycle Stock</div>
          <div style={{ fontSize: '18px', fontWeight: 800, color: isLight ? '#0F172A' : '#F8FAFC', fontFamily: "'JetBrains Mono', monospace" }}>
            163,000 u
          </div>
        </div>
        <div>
          <div style={{ fontSize: '11px', color: '#64748B' }}>Dynamic Safety Buffer</div>
          <div style={{ fontSize: '18px', fontWeight: 800, color: '#06B6D4', fontFamily: "'JetBrains Mono', monospace" }}>
            75,000 u (14.2d)
          </div>
        </div>
        <div>
          <div style={{ fontSize: '11px', color: '#64748B' }}>Stockout Vulnerability</div>
          <div style={{ fontSize: '18px', fontWeight: 800, color: '#16A34A', fontFamily: "'JetBrains Mono', monospace" }}>
            0.8% (Near Zero)
          </div>
        </div>
      </div>

      {/* DC Inventory Table */}
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
              <th style={{ padding: '8px 10px' }}>Service Level</th>
              <th style={{ padding: '8px 10px' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {dcInventory.map((row, idx) => (
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
                  {row.cycleStock.toLocaleString()} u
                </td>
                <td style={{ padding: '10px 10px', color: '#06B6D4', fontWeight: 600, fontFamily: "'JetBrains Mono', monospace" }}>
                  {row.safetyStock.toLocaleString()} u
                </td>
                <td style={{ padding: '10px 10px', fontWeight: 800, color: row.fillRate >= 98 ? '#16A34A' : '#F59E0B', fontFamily: "'JetBrains Mono', monospace" }}>
                  {row.fillRate}%
                </td>
                <td style={{ padding: '10px 10px' }}>
                  <Badge variant={row.status === 'Optimal' ? 'emerald' : 'amber'}>
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
