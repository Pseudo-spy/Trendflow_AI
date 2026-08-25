import React from 'react';
import { CinematicCard } from '../ui/CinematicCard';
import { Badge } from '../ui/Badge';
import { Layers } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

const bomMaterials = [
  { material: 'Organic Supima Cotton', category: 'Fabric', required: '120,000 kg', onHand: '95,000 kg', shortage: '25,000 kg', status: 'PO Scheduled', badge: 'cyan' as const },
  { material: 'Recycled Ocean Polyester', category: 'Synthetic', required: '65,000 kg', onHand: '70,000 kg', shortage: 'None (Surplus)', status: 'Sufficient', badge: 'emerald' as const },
  { material: 'High-Elastic Spandex Blend', category: 'Yarn', required: '32,000 kg', onHand: '28,000 kg', shortage: '4,000 kg', status: 'MILP Allocating', badge: 'cyan' as const },
  { material: 'Eco-Friendly Reactive Dyes', category: 'Chemical', required: '18,000 L', onHand: '18,500 L', shortage: 'None', status: 'Sufficient', badge: 'emerald' as const },
  { material: 'Recycled Zinc Zippers & Trims', category: 'Hardware', required: '85,000 pcs', onHand: '72,000 pcs', shortage: '13,000 pcs', status: 'Tier MOQ Reached', badge: 'amber' as const },
];

export const MaterialRequirementsModule: React.FC = () => {
  const { mode } = useTheme();
  const isLight = mode === 'light';

  return (
    <CinematicCard
      title="Material Requirements Planning (BOM)"
      subtitle="Bill of materials requirements matching production orders to fabric, trim, and dye availability"
      icon={<Layers size={18} color="#06B6D4" />}
      glowColor="cyan"
      headerAction={<Badge variant="cyan">99.1% BOM Coverage</Badge>}
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
              <th style={{ padding: '8px 10px' }}>Material Name</th>
              <th style={{ padding: '8px 10px' }}>Class</th>
              <th style={{ padding: '8px 10px' }}>Gross Req.</th>
              <th style={{ padding: '8px 10px' }}>On-Hand Stock</th>
              <th style={{ padding: '8px 10px' }}>Net Shortage</th>
              <th style={{ padding: '8px 10px' }}>Procurement Action</th>
            </tr>
          </thead>
          <tbody>
            {bomMaterials.map((item, idx) => (
              <tr
                key={idx}
                style={{
                  borderBottom: isLight ? '1px solid rgba(15, 23, 42, 0.04)' : '1px solid rgba(255, 255, 255, 0.04)',
                }}
              >
                <td style={{ padding: '10px 10px', fontWeight: 700, color: isLight ? '#0F172A' : '#F8FAFC' }}>
                  {item.material}
                </td>
                <td style={{ padding: '10px 10px', color: '#94A3B8' }}>
                  {item.category}
                </td>
                <td style={{ padding: '10px 10px', color: isLight ? '#0F172A' : '#F8FAFC', fontWeight: 600, fontFamily: "'JetBrains Mono', monospace" }}>
                  {item.required}
                </td>
                <td style={{ padding: '10px 10px', color: '#94A3B8', fontFamily: "'JetBrains Mono', monospace" }}>
                  {item.onHand}
                </td>
                <td style={{ padding: '10px 10px', color: item.shortage.includes('None') ? '#16A34A' : '#F59E0B', fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>
                  {item.shortage}
                </td>
                <td style={{ padding: '10px 10px' }}>
                  <Badge variant={item.badge}>
                    {item.status}
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
