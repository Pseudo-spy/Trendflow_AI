import React, { useState } from 'react';
import { CinematicCard } from '../ui/CinematicCard';
import { Badge } from '../ui/Badge';
import { GlowButton } from '../ui/GlowButton';
import { Sliders, Sparkles } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

export const ServiceLevelSensitivity: React.FC = () => {
  const [targetSL, setTargetSL] = useState(98.8);
  const [bufferMultiplier, setBufferMultiplier] = useState(1.2);
  const { mode } = useTheme();
  const isLight = mode === 'light';

  // Dynamic holding cost calculation based on slider
  const estHoldingCost = Math.round(2800000 + (targetSL - 90) * 52000 * bufferMultiplier);
  const estStockoutRisk = Math.max(0.1, (100 - targetSL) * 0.65).toFixed(1);
  const estCapitalSavings = Math.round(482500 - (bufferMultiplier - 1.0) * 120000);

  return (
    <CinematicCard
      title="S&OP Service Level & Buffer Sensitivity Simulator"
      subtitle="Interact with target service fill rates to simulate holding capital versus stockout risk trade-offs"
      icon={<Sliders size={18} color="#16A34A" />}
      glowColor="emerald"
      headerAction={<Badge variant="emerald">Simulation View</Badge>}
    >
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
        {/* Slider 1: Target Service Level */}
        <div
          style={{
            padding: '14px',
            borderRadius: '10px',
            background: isLight ? 'rgba(15, 23, 42, 0.03)' : 'rgba(255, 255, 255, 0.03)',
            border: isLight ? '1px solid rgba(15, 23, 42, 0.08)' : '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: isLight ? '#0F172A' : '#F8FAFC' }}>
              Target Fill Rate (Service Level)
            </span>
            <span style={{ fontSize: '13px', fontWeight: 800, color: '#16A34A', fontFamily: "'JetBrains Mono', monospace" }}>
              {targetSL}%
            </span>
          </div>
          <input
            type="range"
            min="92.0"
            max="99.9"
            step="0.1"
            value={targetSL}
            onChange={(e) => setTargetSL(parseFloat(e.target.value))}
            style={{ width: '100%', accentColor: '#16A34A', cursor: 'pointer' }}
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
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: isLight ? '#0F172A' : '#F8FAFC' }}>
              Dynamic Safety Buffer Factor
            </span>
            <span style={{ fontSize: '13px', fontWeight: 800, color: '#06B6D4', fontFamily: "'JetBrains Mono', monospace" }}>
              {bufferMultiplier}x
            </span>
          </div>
          <input
            type="range"
            min="1.0"
            max="2.0"
            step="0.1"
            value={bufferMultiplier}
            onChange={(e) => setBufferMultiplier(parseFloat(e.target.value))}
            style={{ width: '100%', accentColor: '#06B6D4', cursor: 'pointer' }}
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
          background: isLight ? 'rgba(16, 185, 129, 0.06)' : 'rgba(16, 185, 129, 0.08)',
          border: isLight ? '1px solid rgba(16, 185, 129, 0.15)' : '1px solid rgba(16, 185, 129, 0.2)',
          marginBottom: '16px',
        }}
      >
        <div>
          <div style={{ fontSize: '10px', color: '#64748B' }}>Est. Holding Capital</div>
          <div style={{ fontSize: '16px', fontWeight: 800, color: isLight ? '#0F172A' : '#F8FAFC', fontFamily: "'JetBrains Mono', monospace" }}>
            ${(estHoldingCost / 1000000).toFixed(2)}M
          </div>
        </div>
        <div>
          <div style={{ fontSize: '10px', color: '#64748B' }}>Stockout Probability</div>
          <div style={{ fontSize: '16px', fontWeight: 800, color: '#16A34A', fontFamily: "'JetBrains Mono', monospace" }}>
            {estStockoutRisk}%
          </div>
        </div>
        <div>
          <div style={{ fontSize: '10px', color: '#64748B' }}>Projected Net Savings</div>
          <div style={{ fontSize: '16px', fontWeight: 800, color: '#06B6D4', fontFamily: "'JetBrains Mono', monospace" }}>
            +${estCapitalSavings.toLocaleString()}
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
          Backend Support Pending
        </GlowButton>
      </div>
    </CinematicCard>
  );
};
