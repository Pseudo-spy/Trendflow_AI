import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { CinematicCard } from '../ui/CinematicCard';
import { GlowButton } from '../ui/GlowButton';
import { Badge } from '../ui/Badge';
import { ArrowRight, TrendingUp, Factory, ShoppingCart, ShieldAlert } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

const ScenarioButton: React.FC<{
  label: string;
  isActive: boolean;
  isLight: boolean;
  onClick: () => void;
  activeBg: string;
  activeHoverBg: string;
  activeBorder: string;
  activeHoverBorder: string;
}> = ({ label, isActive, isLight, onClick, activeBg, activeHoverBg, activeBorder, activeHoverBorder }) => {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        padding: '12px 24px',
        borderRadius: '8px',
        background: isActive ? (isHovered ? activeHoverBg : activeBg) : (isHovered ? (isLight ? '#F1F5F9' : 'rgba(255,255,255,0.05)') : (isLight ? '#FFFFFF' : '#101612')),
        color: isActive ? '#FFFFFF' : isLight ? '#475569' : (isHovered ? '#FFFFFF' : '#94A3B8'),
        border: isActive ? (isHovered ? activeHoverBorder : activeBorder) : isLight ? '1px solid #E2E8F0' : (isHovered ? '1px solid rgba(255,255,255,0.1)' : '1px solid #202E25'),
        fontWeight: 700,
        cursor: 'pointer',
        transition: 'all 0.2s ease',
      }}
    >
      {label}
    </button>
  );
};

export const ScenarioTeaser: React.FC = () => {
  const [activeScenario, setActiveScenario] = useState<'surge' | 'disruption'>('surge');
  const { mode } = useTheme();
  const isLight = mode === 'light';

  return (
    <section style={{ marginBottom: '80px' }}>
      <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 48px' }}>
        <Badge variant="emerald" pulse>
          WHAT-IF SCENARIOS
        </Badge>
        <h2
          style={{
            fontSize: '36px',
            fontWeight: 800,
            color: isLight ? '#0F172A' : '#FFFFFF',
            letterSpacing: '-0.02em',
            marginTop: '16px',
            marginBottom: '16px',
          }}
        >
          WHAT HAPPENS WHEN DEMAND CHANGES?
        </h2>
        <p style={{ fontSize: '16px', color: isLight ? '#475569' : '#94A3B8', lineHeight: '1.6' }}>
          Simulate supply shocks and demand surges before they happen. TRENDFLOW AI instantly ripples changes through your entire supply chain to recommend optimal responses.
        </p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginBottom: '32px' }}>
        <ScenarioButton
          label="Scenario: Demand +20%"
          isActive={activeScenario === 'surge'}
          isLight={isLight}
          onClick={() => setActiveScenario('surge')}
          activeBg="#16A34A"
          activeHoverBg="linear-gradient(135deg, #14532D 0%, #064E3B 100%)"
          activeBorder="1px solid #16A34A"
          activeHoverBorder="1px solid #14532D"
        />
        <ScenarioButton
          label="Scenario: Port Closure"
          isActive={activeScenario === 'disruption'}
          isLight={isLight}
          onClick={() => setActiveScenario('disruption')}
          activeBg="#EF4444"
          activeHoverBg="linear-gradient(135deg, #7F1D1D 0%, #450A0A 100%)" // Dark red gradient
          activeBorder="1px solid #EF4444"
          activeHoverBorder="1px solid #7F1D1D"
        />
      </div>

      <CinematicCard
        style={{
          maxWidth: '1000px',
          margin: '0 auto',
          background: isLight ? '#FFFFFF' : '#101612',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
            padding: '12px',
          }}
        >
          {/* Reaction Flow */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
            {/* Step 1 */}
            <div style={{ flex: 1, minWidth: '180px', padding: '16px', background: isLight ? '#F8FAFC' : '#0A0F0B', borderRadius: '12px', border: isLight ? '1px solid #E2E8F0' : '1px solid #1A241E' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: activeScenario === 'surge' ? '#16A34A' : '#EF4444' }}>
                {activeScenario === 'surge' ? <TrendingUp size={16} /> : <ShieldAlert size={16} />}
                <span style={{ fontSize: '12px', fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>TRIGGER</span>
              </div>
              <div style={{ fontSize: '15px', fontWeight: 700, color: isLight ? '#0F172A' : '#FFFFFF' }}>
                {activeScenario === 'surge' ? 'Holiday Surge (+20%)' : 'Port Strike (14 Days)'}
              </div>
            </div>

            <ArrowRight size={20} color={isLight ? '#CBD5E1' : '#2C3D32'} />

            {/* Step 2 */}
            <div style={{ flex: 1, minWidth: '180px', padding: '16px', background: isLight ? '#F8FAFC' : '#0A0F0B', borderRadius: '12px', border: isLight ? '1px solid #E2E8F0' : '1px solid #1A241E' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: '#16A34A' }}>
                <Factory size={16} />
                <span style={{ fontSize: '12px', fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>PRODUCTION</span>
              </div>
              <div style={{ fontSize: '15px', fontWeight: 700, color: isLight ? '#0F172A' : '#FFFFFF' }}>
                {activeScenario === 'surge' ? 'Shift to Tier-2 Mills' : 'Expedite Air Freight'}
              </div>
            </div>

            <ArrowRight size={20} color={isLight ? '#CBD5E1' : '#2C3D32'} />

            {/* Step 3 */}
            <div style={{ flex: 1, minWidth: '180px', padding: '16px', background: isLight ? '#F8FAFC' : '#0A0F0B', borderRadius: '12px', border: isLight ? '1px solid #E2E8F0' : '1px solid #1A241E' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: '#16A34A' }}>
                <ShoppingCart size={16} />
                <span style={{ fontSize: '12px', fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>PROCUREMENT</span>
              </div>
              <div style={{ fontSize: '15px', fontWeight: 700, color: isLight ? '#0F172A' : '#FFFFFF' }}>
                {activeScenario === 'surge' ? 'Auto-Issue PO (+15K Units)' : 'Reallocate Supplier Limits'}
              </div>
            </div>
          </div>

          <div style={{ borderTop: isLight ? '1px solid #E2E8F0' : '1px solid #202E25', margin: '12px 0' }} />

          {/* Results summary */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <div style={{ fontSize: '12px', color: isLight ? '#64748B' : '#94A3B8', marginBottom: '4px' }}>Resulting Action</div>
              <div style={{ fontSize: '16px', fontWeight: 800, color: isLight ? '#0F172A' : '#FFFFFF' }}>
                {activeScenario === 'surge' ? 'Maintained 98% Fill Rate with +4% Cost' : 'Mitigated 12 Days Delay with +8% Freight Cost'}
              </div>
            </div>
            <NavLink to="/scenarios" style={{ textDecoration: 'none' }}>
              <GlowButton variant="secondary" size="md" icon={<ArrowRight size={15} />} iconPosition="right">
                Explore Scenarios
              </GlowButton>
            </NavLink>
          </div>
        </div>
      </CinematicCard>
    </section>
  );
};
