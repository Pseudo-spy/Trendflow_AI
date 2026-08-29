import React from 'react';
import { CinematicCard } from '../ui/CinematicCard';
import { Badge } from '../ui/Badge';
import { GlowButton } from '../ui/GlowButton';
import { Sliders, Sparkles } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

export const ServiceLevelSensitivity: React.FC = () => {
  const { mode } = useTheme();
  const isLight = mode === 'light';

  return (
    <CinematicCard
      title="Service Level Sensitivity"
      subtitle="Simulate holding capital versus stockout risk trade-offs."
      icon={<Sliders size={18} color="#16A34A" />}
      glowColor="emerald"
      headerAction={<Badge variant="muted">Data Pending</Badge>}
    >
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
        {/* Slider 1: Target Service Level */}
        <div
          style={{
            padding: '14px',
            borderRadius: '10px',
            background: isLight ? 'rgba(15, 23, 42, 0.03)' : 'rgba(255, 255, 255, 0.03)',
            border: isLight ? '1px solid rgba(15, 23, 42, 0.08)' : '1px solid rgba(255, 255, 255, 0.08)',
            opacity: 0.6,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: isLight ? '#0F172A' : '#F8FAFC' }}>
              Target Fill Rate (Service Level)
            </span>
            <span style={{ fontSize: '13px', fontWeight: 800, color: '#94A3B8', fontFamily: "'JetBrains Mono', monospace" }}>
              Pending
            </span>
          </div>
          <input
            type="range"
            min="92.0"
            max="99.9"
            step="0.1"
            value={95}
            disabled
            style={{ width: '100%', accentColor: '#94A3B8', cursor: 'not-allowed' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#64748B', marginTop: '4px' }}>
            <span>92.0% (Lean Capital)</span>
            <span>99.9% (Zero Stockout)</span>
          </div>
        </div>

        {/* Slider 2: Safety Buffer Multiplier */}
        <div
          style={{
            padding: '14px',
            borderRadius: '10px',
            background: isLight ? 'rgba(15, 23, 42, 0.03)' : 'rgba(255, 255, 255, 0.03)',
            border: isLight ? '1px solid rgba(15, 23, 42, 0.08)' : '1px solid rgba(255, 255, 255, 0.08)',
            opacity: 0.6,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: isLight ? '#0F172A' : '#F8FAFC' }}>
              Dynamic Safety Buffer Factor
            </span>
            <span style={{ fontSize: '13px', fontWeight: 800, color: '#94A3B8', fontFamily: "'JetBrains Mono', monospace" }}>
              Pending
            </span>
          </div>
          <input
            type="range"
            min="1.0"
            max="2.0"
            step="0.1"
            value={1.0}
            disabled
            style={{ width: '100%', accentColor: '#94A3B8', cursor: 'not-allowed' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#64748B', marginTop: '4px' }}>
            <span>1.0x (Standard)</span>
            <span>2.0x (Max Resilience)</span>
          </div>
        </div>
      </div>

      {/* Simulated Outcomes Bar */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '12px',
          padding: '14px',
          borderRadius: '10px',
          background: isLight ? 'rgba(15, 23, 42, 0.03)' : 'rgba(255, 255, 255, 0.03)',
          border: isLight ? '1px solid rgba(15, 23, 42, 0.06)' : '1px solid rgba(255, 255, 255, 0.06)',
          marginBottom: '16px',
        }}
      >
        <div>
          <div style={{ fontSize: '10px', color: '#64748B' }}>Est. Holding Capital</div>
          <div style={{ fontSize: '13px', fontWeight: 600, color: '#94A3B8', marginTop: '4px' }}>
            Data Pending
          </div>
        </div>
        <div>
          <div style={{ fontSize: '10px', color: '#64748B' }}>Stockout Probability</div>
          <div style={{ fontSize: '13px', fontWeight: 600, color: '#94A3B8', marginTop: '4px' }}>
            Data Pending
          </div>
        </div>
        <div>
          <div style={{ fontSize: '10px', color: '#64748B' }}>Projected Net Savings</div>
          <div style={{ fontSize: '13px', fontWeight: 600, color: '#94A3B8', marginTop: '4px' }}>
            Data Pending
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <GlowButton
          variant="primary"
          size="sm"
          icon={<Sparkles size={14} />}
          onClick={() => {}}
          disabled={true}
        >
          Support Pending
        </GlowButton>
      </div>
    </CinematicCard>
  );
};
