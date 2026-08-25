import React from 'react';
import { CinematicCard } from '../ui/CinematicCard';
import { Badge } from '../ui/Badge';
import { AlertOctagon, TrendingUp, Sun, RotateCcw } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

const anomalyEvents = [
  {
    id: 1,
    title: 'Viral Social Surge: Performance Tech Tee',
    type: 'Social Velocity',
    desc: 'TikTok & Instagram engagement spiked +340% in last 48h, triggering an estimated +12,500 unit demand surge.',
    lift: '+35.0% Demand Lift',
    icon: <TrendingUp size={16} color="#06B6D4" />,
    badge: 'cyan' as const,
  },
  {
    id: 2,
    title: 'Regional Heatwave Anomaly: Southern Europe',
    type: 'Climate Sensing',
    desc: 'Extended heatwave (+4.2°C above seasonal norms) accelerating lightweight activewear sales across Frankfurt DC region.',
    lift: '+18.4% Regional Lift',
    icon: <Sun size={16} color="#F59E0B" />,
    badge: 'amber' as const,
  },
  {
    id: 3,
    title: 'Return Rate Drop: Streetwear Line',
    type: 'POS Inversion',
    desc: 'Customer return rates declined from 14.2% to 7.8% following updated size guide, increasing net retained units.',
    lift: '+3,200 Net Kept Units',
    icon: <RotateCcw size={16} color="#16A34A" />,
    badge: 'emerald' as const,
  },
];

export const DemandAnomaliesFeed: React.FC = () => {
  const { mode } = useTheme();
  const isLight = mode === 'light';

  return (
    <CinematicCard
      title="Demand Sensing Anomalies & External Signals"
      subtitle="Real-time early detection of viral social spikes, climate shifts, and channel anomalies"
      icon={<AlertOctagon size={18} color="#F59E0B" />}
      glowColor="amber"
      headerAction={<Badge variant="amber" pulse>3 Live Signals</Badge>}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {anomalyEvents.map((item) => (
          <div
            key={item.id}
            style={{
              padding: '12px 14px',
              borderRadius: '8px',
              background: isLight ? 'rgba(15, 23, 42, 0.03)' : 'rgba(255, 255, 255, 0.03)',
              border: isLight ? '1px solid rgba(15, 23, 42, 0.06)' : '1px solid rgba(255, 255, 255, 0.06)',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
            }}
          >
            <div
              style={{
                padding: '6px',
                borderRadius: '6px',
                background: isLight ? 'rgba(15, 23, 42, 0.05)' : 'rgba(255, 255, 255, 0.05)',
                marginTop: '2px',
              }}
            >
              {item.icon}
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2px' }}>
                <span style={{ fontSize: '13px', fontWeight: 700, color: isLight ? '#0F172A' : '#F8FAFC' }}>
                  {item.title}
                </span>
                <Badge variant={item.badge}>
                  {item.type}
                </Badge>
              </div>
              <p style={{ fontSize: '11px', color: '#94A3B8', lineHeight: '1.4', marginBottom: '4px' }}>
                {item.desc}
              </p>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#16A34A', fontFamily: "'JetBrains Mono', monospace" }}>
                Signal Impact: {item.lift}
              </span>
            </div>
          </div>
        ))}
      </div>
    </CinematicCard>
  );
};
