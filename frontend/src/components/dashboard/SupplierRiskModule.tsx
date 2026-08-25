import React from 'react';
import { CinematicCard } from '../ui/CinematicCard';
import { Badge } from '../ui/Badge';
import { ShieldAlert } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

const riskRows = [
  { vendor: 'Taipei Organic Fabrics', region: 'Taiwan', riskScore: 6, weather: 'Clear', geoRisk: 'Low', variance: '±0.4d', status: 'Stable', badge: 'emerald' as const },
  { vendor: 'Shenzhen Mega Spinning', region: 'China', riskScore: 12, weather: 'Clear', geoRisk: 'Low', variance: '±0.8d', status: 'Stable', badge: 'emerald' as const },
  { vendor: 'Hanoi Garments Ltd', region: 'Vietnam', riskScore: 38, weather: 'Typhoon Watch', geoRisk: 'Moderate', variance: '±2.5d', status: 'Watchlist', badge: 'amber' as const },
  { vendor: 'Frankfurt Eco Textiles', region: 'Germany', riskScore: 8, weather: 'Clear', geoRisk: 'Low', variance: '±0.2d', status: 'Stable', badge: 'emerald' as const },
  { vendor: 'Americas Synthetic Mill', region: 'USA', riskScore: 10, weather: 'Clear', geoRisk: 'Low', variance: '±0.5d', status: 'Stable', badge: 'emerald' as const },
];

export const SupplierRiskModule: React.FC = () => {
  const { mode } = useTheme();
  const isLight = mode === 'light';

  return (
    <CinematicCard
      title="Supplier Disruption & Vulnerability Radar"
      subtitle="Continuous telemetry analyzing geopolitical risk, port congestion, and climate vulnerabilities"
      icon={<ShieldAlert size={18} color="#F43F5E" />}
      glowColor="rose"
      headerAction={<Badge variant="emerald">Composite Risk: 18.4 (Low)</Badge>}
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
              <th style={{ padding: '8px 10px' }}>Vendor Facility</th>
              <th style={{ padding: '8px 10px' }}>Region</th>
              <th style={{ padding: '8px 10px' }}>Risk Index</th>
              <th style={{ padding: '8px 10px' }}>Climate / Port</th>
              <th style={{ padding: '8px 10px' }}>Lead-Time Var.</th>
              <th style={{ padding: '8px 10px' }}>Mitigation Status</th>
            </tr>
          </thead>
          <tbody>
            {riskRows.map((row, idx) => (
              <tr
                key={idx}
                style={{
                  borderBottom: isLight ? '1px solid rgba(15, 23, 42, 0.04)' : '1px solid rgba(255, 255, 255, 0.04)',
                }}
              >
                <td style={{ padding: '10px 10px', fontWeight: 700, color: isLight ? '#0F172A' : '#F8FAFC' }}>
                  {row.vendor}
                </td>
                <td style={{ padding: '10px 10px', color: '#94A3B8' }}>
                  {row.region}
                </td>
                <td style={{ padding: '10px 10px', fontWeight: 800, color: row.riskScore > 30 ? '#F43F5E' : '#16A34A', fontFamily: "'JetBrains Mono', monospace" }}>
                  {row.riskScore} / 100
                </td>
                <td style={{ padding: '10px 10px', color: row.weather.includes('Watch') ? '#F59E0B' : '#64748B' }}>
                  {row.weather}
                </td>
                <td style={{ padding: '10px 10px', color: '#94A3B8', fontFamily: "'JetBrains Mono', monospace" }}>
                  {row.variance}
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
