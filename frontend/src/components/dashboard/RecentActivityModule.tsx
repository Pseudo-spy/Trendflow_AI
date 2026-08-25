import React from 'react';
import { CinematicCard } from '../ui/CinematicCard';
import { Activity, Cpu, FileCheck, ShieldCheck, RefreshCw } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

const activityFeed = [
  {
    id: 1,
    time: '2 mins ago',
    title: 'Google OR-Tools MILP Solver Converged',
    detail: 'Global minimum cost optimum found across 5 supplier nodes in 842ms.',
    icon: <Cpu size={14} color="#06B6D4" />,
    badge: 'Solver' as const,
  },
  {
    id: 2,
    time: '14 mins ago',
    title: 'Dynamic Safety Buffer Rebalance',
    detail: 'Safety stock auto-adjusted by +2,400 units at Taipei DC to protect 98.8% fill rate.',
    icon: <RefreshCw size={14} color="#16A34A" />,
    badge: 'S&OP' as const,
  },
  {
    id: 3,
    time: '42 mins ago',
    title: 'Purchase Order #PO-88421 Dispatched',
    detail: 'Allocated 48,000 units to Taipei Organic Fabrics via automated ERP EDI connection.',
    icon: <FileCheck size={14} color="#6366F1" />,
    badge: 'Procurement' as const,
  },
  {
    id: 4,
    time: '1 hr ago',
    title: 'Disruption Risk Radar Scan Finished',
    detail: 'Monitored 18 tier-1/tier-2 suppliers and shipping corridors. 0 critical stoppages.',
    icon: <ShieldCheck size={14} color="#16A34A" />,
    badge: 'Risk' as const,
  },
  {
    id: 5,
    time: '2 hrs ago',
    title: 'LightGBM Multi-Horizon Retraining',
    detail: 'Ingested 48,000 POS omnichannel sales lines. Model MAPE lowered to 3.2%.',
    icon: <Activity size={14} color="#06B6D4" />,
    badge: 'Forecast' as const,
  },
];

export const RecentActivityModule: React.FC = () => {
  const { mode } = useTheme();
  const isLight = mode === 'light';

  return (
    <CinematicCard
      title="Recent Platform Activity & Audit Log"
      subtitle="Autonomous execution log of mathematical optimization, buffer calibrations, and PO dispatches"
      icon={<Activity size={18} color="#06B6D4" />}
      glowColor="cyan"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {activityFeed.map((item) => (
          <div
            key={item.id}
            style={{
              padding: '10px 14px',
              borderRadius: '8px',
              background: isLight ? 'rgba(15, 23, 42, 0.02)' : 'rgba(255, 255, 255, 0.02)',
              border: isLight ? '1px solid rgba(15, 23, 42, 0.06)' : '1px solid rgba(255, 255, 255, 0.06)',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
            }}
          >
            <div
              style={{
                marginTop: '2px',
                padding: '6px',
                borderRadius: '6px',
                background: isLight ? 'rgba(15, 23, 42, 0.04)' : 'rgba(255, 255, 255, 0.04)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {item.icon}
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2px' }}>
                <span style={{ fontSize: '13px', fontWeight: 700, color: isLight ? '#0F172A' : '#F8FAFC' }}>
                  {item.title}
                </span>
                <span style={{ fontSize: '10px', color: '#64748B', fontFamily: "'JetBrains Mono', monospace" }}>
                  {item.time}
                </span>
              </div>
              <p style={{ fontSize: '11px', color: '#94A3B8', lineHeight: '1.4' }}>
                {item.detail}
              </p>
            </div>
          </div>
        ))}
      </div>
    </CinematicCard>
  );
};
