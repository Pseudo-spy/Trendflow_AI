import React from 'react';
import { CinematicCard } from '../ui/CinematicCard';
import { Badge } from '../ui/Badge';
import { Activity } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

const lines = [
  { line: 'Line A (Tech Tops & Tees)', planned: '62,000 u', maxCap: '68,000 u', load: 91.2, status: 'Optimal', badge: 'emerald' as const },
  { line: 'Line B (Streetwear & Hoodies)', planned: '45,000 u', maxCap: '48,000 u', load: 93.8, status: 'Optimal', badge: 'emerald' as const },
  { line: 'Line C (Seamless Activewear)', planned: '40,000 u', maxCap: '42,000 u', load: 95.2, status: 'Near Cap', badge: 'amber' as const },
  { line: 'Line D (Eco Denim & Bottoms)', planned: '37,200 u', maxCap: '40,000 u', load: 93.0, status: 'Optimal', badge: 'emerald' as const },
];

export const FactoryCapacityModule: React.FC = () => {
  const { mode } = useTheme();
  const isLight = mode === 'light';

  return (
    <CinematicCard
      title="Factory Line Capacity & Throughput Load"
      subtitle="Master Production Schedule (MPS) line allocations against maximum rated machine throughput"
      icon={<Activity size={18} color="#6366F1" />}
      glowColor="indigo"
      headerAction={<Badge variant="cyan">92.6% Aggregate Load</Badge>}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {lines.map((item, idx) => (
          <div
            key={idx}
            style={{
              padding: '12px 14px',
              borderRadius: '10px',
              background: isLight ? 'rgba(15, 23, 42, 0.03)' : 'rgba(255, 255, 255, 0.03)',
              border: isLight ? '1px solid rgba(15, 23, 42, 0.06)' : '1px solid rgba(255, 255, 255, 0.06)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <div>
                <span style={{ fontSize: '13px', fontWeight: 700, color: isLight ? '#0F172A' : '#F8FAFC' }}>
                  {item.line}
                </span>
                <span style={{ fontSize: '11px', color: '#94A3B8', marginLeft: '8px' }}>
                  Planned: {item.planned} / {item.maxCap} max
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '13px', fontWeight: 800, color: item.load > 94 ? '#F59E0B' : '#16A34A', fontFamily: "'JetBrains Mono', monospace" }}>
                  {item.load}%
                </span>
                <Badge variant={item.badge}>
                  {item.status}
                </Badge>
              </div>
            </div>

            {/* Capacity Progress Bar */}
            <div
              style={{
                width: '100%',
                height: '6px',
                borderRadius: '3px',
                background: isLight ? 'rgba(15, 23, 42, 0.08)' : 'rgba(255, 255, 255, 0.08)',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: `${item.load}%`,
                  height: '100%',
                  borderRadius: '3px',
                  background: item.load > 94
                    ? 'linear-gradient(90deg, #F59E0B, #F43F5E)'
                    : 'linear-gradient(90deg, #06B6D4, #16A34A)',
                  transition: 'width 0.5s ease',
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </CinematicCard>
  );
};
