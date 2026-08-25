import React from 'react';
import { CinematicCard } from '../ui/CinematicCard';
import { Badge } from '../ui/Badge';
import { Layers } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

const categoryBreakdown = [
  { category: 'Performance Tech Tees', skus: 14, projected: '58,000 u', yoy: '+14.2%', seasonalIdx: '1.34x', promoLift: '+22.0%', status: 'Surge', badge: 'emerald' as const },
  { category: 'Urban Streetwear Hoodies', skus: 10, projected: '42,000 u', yoy: '+6.8%', seasonalIdx: '0.88x', promoLift: '+15.0%', status: 'Stable', badge: 'cyan' as const },
  { category: 'Seamless Active Leggings', skus: 12, projected: '38,000 u', yoy: '+18.5%', seasonalIdx: '1.15x', promoLift: '+28.0%', status: 'Viral Lift', badge: 'emerald' as const },
  { category: 'Eco-Wash Denim Line', skus: 8, projected: '28,000 u', yoy: '+3.2%', seasonalIdx: '1.02x', promoLift: '+8.0%', status: 'Normal', badge: 'cyan' as const },
  { category: 'Accessories & Headwear', skus: 4, projected: '18,200 u', yoy: '+5.0%', seasonalIdx: '1.10x', promoLift: '+12.0%', status: 'Normal', badge: 'cyan' as const },
];

export const SkuCategoryTable: React.FC = () => {
  const { mode } = useTheme();
  const isLight = mode === 'light';

  return (
    <CinematicCard
      title="Category & SKU Cluster Demand Breakdown"
      subtitle="Granular unit forecast with seasonality velocity indices and promotional lift elasticity"
      icon={<Layers size={18} color="#06B6D4" />}
      glowColor="cyan"
      headerAction={<Badge variant="cyan">48 Active SKU Clusters</Badge>}
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
              <th style={{ padding: '8px 10px' }}>Product Line</th>
              <th style={{ padding: '8px 10px' }}>SKU Count</th>
              <th style={{ padding: '8px 10px' }}>Q3 Projected</th>
              <th style={{ padding: '8px 10px' }}>YoY Growth</th>
              <th style={{ padding: '8px 10px' }}>Seasonality</th>
              <th style={{ padding: '8px 10px' }}>Promo Lift</th>
              <th style={{ padding: '8px 10px' }}>Trend Status</th>
            </tr>
          </thead>
          <tbody>
            {categoryBreakdown.map((row, idx) => (
              <tr
                key={idx}
                style={{
                  borderBottom: isLight ? '1px solid rgba(15, 23, 42, 0.04)' : '1px solid rgba(255, 255, 255, 0.04)',
                }}
              >
                <td style={{ padding: '10px 10px', fontWeight: 700, color: isLight ? '#0F172A' : '#F8FAFC' }}>
                  {row.category}
                </td>
                <td style={{ padding: '10px 10px', color: '#94A3B8' }}>
                  {row.skus} SKUs
                </td>
                <td style={{ padding: '10px 10px', fontWeight: 800, color: isLight ? '#0F172A' : '#F8FAFC', fontFamily: "'JetBrains Mono', monospace" }}>
                  {row.projected}
                </td>
                <td style={{ padding: '10px 10px', fontWeight: 700, color: '#16A34A', fontFamily: "'JetBrains Mono', monospace" }}>
                  {row.yoy}
                </td>
                <td style={{ padding: '10px 10px', color: '#06B6D4', fontWeight: 600, fontFamily: "'JetBrains Mono', monospace" }}>
                  {row.seasonalIdx}
                </td>
                <td style={{ padding: '10px 10px', color: '#6366F1', fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>
                  {row.promoLift}
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
