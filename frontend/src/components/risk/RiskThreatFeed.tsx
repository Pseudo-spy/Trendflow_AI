import React from 'react';
import { CinematicCard } from '../ui/CinematicCard';
import { Badge } from '../ui/Badge';
import { AlertTriangle, Compass, Ship, FileText, CheckCircle2 } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

const threatAlerts = [
  {
    id: 1,
    title: 'Severe Weather Warning: South China Sea',
    category: 'Climate Disruption',
    detail: 'Tropical depression tracking toward Gulf of Tonkin; potential 3–5 day port clearance delays at Haiphong.',
    impact: 'Hanoi Assembly Hub (19.2% Volume)',
    action: 'Dynamic Buffer Shifted (+15k u to Taipei)',
    badge: 'amber' as const,
    icon: <Compass size={16} color="#F59E0B" />,
  },
  {
    id: 2,
    title: 'Port Dwell Congestion: LA / Long Beach',
    category: 'Logistics Chokepoint',
    detail: 'Container dwell times increased to 4.8 days due to inland rail delays.',
    impact: 'Americas Gateway DC',
    action: 'Fast-Track Priority Air Corridor Armed',
    badge: 'cyan' as const,
    icon: <Ship size={16} color="#06B6D4" />,
  },
  {
    id: 3,
    title: 'Tariff Schedule Revision Notice',
    category: 'Geopolitical / Trade',
    detail: 'Projected 4.5% tariff increase on non-certified raw cotton imports starting next month.',
    impact: 'Supima Cotton BOM Lines',
    action: 'Lock Advance Contract with Taipei Organic',
    badge: 'emerald' as const,
    icon: <FileText size={16} color="#16A34A" />,
  },
];

export const RiskThreatFeed: React.FC = () => {
  const { mode } = useTheme();
  const isLight = mode === 'light';

  return (
    <CinematicCard
      title="Early-Warning Threat Stream & Automated Contingencies"
      subtitle="Automated intelligence scanning global AIS ship tracking, meteorological models, and customs filings"
      icon={<AlertTriangle size={18} color="#F59E0B" />}
      glowColor="amber"
      headerAction={<Badge variant="amber" pulse>3 Live Threats</Badge>}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {threatAlerts.map((threat) => (
          <div
            key={threat.id}
            style={{
              padding: '14px 16px',
              borderRadius: '10px',
              background: isLight ? 'rgba(15, 23, 42, 0.03)' : 'rgba(255, 255, 255, 0.03)',
              border: isLight ? '1px solid rgba(15, 23, 42, 0.08)' : '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              gap: '14px',
              flexWrap: 'wrap',
            }}
          >
            <div style={{ display: 'flex', gap: '12px', flex: 1, minWidth: '280px' }}>
              <div
                style={{
                  padding: '8px',
                  borderRadius: '8px',
                  background: isLight ? 'rgba(15, 23, 42, 0.05)' : 'rgba(255, 255, 255, 0.05)',
                  marginTop: '2px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {threat.icon}
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 800, color: isLight ? '#0F172A' : '#F8FAFC' }}>
                    {threat.title}
                  </span>
                  <Badge variant={threat.badge}>
                    {threat.category}
                  </Badge>
                </div>
                <p style={{ fontSize: '12px', color: isLight ? '#475569' : '#94A3B8', lineHeight: '1.4', marginBottom: '6px' }}>
                  {threat.detail}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px' }}>
                  <span style={{ color: '#64748B' }}>Impacted Node:</span>
                  <span style={{ fontWeight: 700, color: isLight ? '#0F172A' : '#F8FAFC' }}>{threat.impact}</span>
                </div>
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end',
                gap: '6px',
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  padding: '6px 10px',
                  borderRadius: '6px',
                  background: isLight ? 'rgba(16, 185, 129, 0.08)' : 'rgba(16, 185, 129, 0.12)',
                  border: isLight ? '1px solid rgba(16, 185, 129, 0.2)' : '1px solid rgba(16, 185, 129, 0.25)',
                  fontSize: '11px',
                  fontWeight: 700,
                  color: isLight ? '#047857' : '#34D399',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                }}
              >
                <CheckCircle2 size={13} />
                <span>{threat.action}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </CinematicCard>
  );
};
