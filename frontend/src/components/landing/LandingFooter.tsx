import React from 'react';
import { NavLink } from 'react-router-dom';
import { Layers, ShieldCheck } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

export const LandingFooter: React.FC = () => {
  const { mode } = useTheme();
  const isLight = mode === 'light';

  return (
    <footer
      style={{
        marginTop: '32px',
        paddingTop: '36px',
        paddingBottom: '24px',
        borderTop: isLight ? '1px solid rgba(15, 23, 42, 0.1)' : '1px solid rgba(255, 255, 255, 0.08)',
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '28px',
          marginBottom: '32px',
        }}
      >
        {/* Brand & Mission */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #16A34A 0%, #15803D 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Layers size={18} color="#FFFFFF" />
            </div>
            <span style={{ fontSize: '16px', fontWeight: 900, color: isLight ? '#0F172A' : '#F8FAFC' }}>
              TRENDFLOW AI
            </span>
          </div>
          <p style={{ fontSize: '12px', color: '#94A3B8', lineHeight: '1.6' }}>
            Integrated S&OP + Procurement Intelligence. Powered by Machine Learning, Google OR-Tools MILP Solver, and Three.js Spatial Twin.
          </p>
        </div>

        {/* Core Modules */}
        <div>
          <div style={{ fontSize: '12px', fontWeight: 800, color: isLight ? '#0F172A' : '#F8FAFC', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '12px' }}>
            Core Modules
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <NavLink to="/dashboard" style={{ fontSize: '13px', color: isLight ? '#475569' : '#94A3B8', textDecoration: 'none' }}>
              Executive Dashboard
            </NavLink>
            <NavLink to="/demand-planning" style={{ fontSize: '13px', color: isLight ? '#475569' : '#94A3B8', textDecoration: 'none' }}>
              Demand Planning
            </NavLink>
            <NavLink to="/sop" style={{ fontSize: '13px', color: isLight ? '#475569' : '#94A3B8', textDecoration: 'none' }}>
              S&OP Planning
            </NavLink>
            <NavLink to="/procurement" style={{ fontSize: '13px', color: isLight ? '#475569' : '#94A3B8', textDecoration: 'none' }}>
              Procurement Optimizer
            </NavLink>
          </div>
        </div>

        {/* Operations & Risk */}
        <div>
          <div style={{ fontSize: '12px', fontWeight: 800, color: isLight ? '#0F172A' : '#F8FAFC', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '12px' }}>
            Operations & Risk
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <NavLink to="/suppliers" style={{ fontSize: '13px', color: isLight ? '#475569' : '#94A3B8', textDecoration: 'none' }}>
              Supplier Management
            </NavLink>
            <NavLink to="/risk" style={{ fontSize: '13px', color: isLight ? '#475569' : '#94A3B8', textDecoration: 'none' }}>
              Disruption Risk Radar
            </NavLink>
            <NavLink to="/scenarios" style={{ fontSize: '13px', color: isLight ? '#475569' : '#94A3B8', textDecoration: 'none' }}>
              Scenario Studio
            </NavLink>
          </div>
        </div>

        {/* Platform Architecture */}
        <div>
          <div style={{ fontSize: '12px', fontWeight: 800, color: isLight ? '#0F172A' : '#F8FAFC', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '12px' }}>
            Platform Architecture
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {['Three.js', 'R3F', 'Framer Motion', 'Google OR-Tools', 'FastAPI', 'LightGBM'].map((tech, idx) => (
              <span
                key={idx}
                style={{
                  fontSize: '10px',
                  fontWeight: 700,
                  padding: '3px 8px',
                  borderRadius: '6px',
                  background: isLight ? 'rgba(15, 23, 42, 0.05)' : 'rgba(255, 255, 255, 0.06)',
                  color: isLight ? '#15803D' : '#4ADE80',
                  fontFamily: "'JetBrains Mono', monospace",
                }}
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div
        style={{
          paddingTop: '20px',
          borderTop: isLight ? '1px solid rgba(15, 23, 42, 0.06)' : '1px solid rgba(255, 255, 255, 0.06)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          fontSize: '11px',
          color: '#64748B',
        }}
      >
        <div>
          © 2026 TRENDFLOW AI • Integrated S&OP + Procurement Intelligence
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <ShieldCheck size={13} color="#16A34A" />
          <span>Enterprise Autonomous Supply Chain Intelligence Platform</span>
        </div>
      </div>
    </footer>
  );
};
