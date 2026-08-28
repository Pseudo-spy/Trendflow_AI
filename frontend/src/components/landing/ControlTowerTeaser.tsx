import React from 'react';
import { NavLink } from 'react-router-dom';
import { GlowButton } from '../ui/GlowButton';
import { Badge } from '../ui/Badge';
import { ArrowRight } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

export const ControlTowerTeaser: React.FC = () => {
  const { mode } = useTheme();
  const isLight = mode === 'light';

  return (
    <section style={{ marginBottom: '80px' }}>
      <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 48px' }}>
        <Badge variant="emerald" pulse>
          CONTROL TOWER
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
          ONE CONTROL TOWER. EVERY DECISION CONNECTED.
        </h2>
        <p style={{ fontSize: '16px', color: isLight ? '#475569' : '#94A3B8', lineHeight: '1.6' }}>
          Monitor demand, inventory, production, materials, procurement, suppliers, and risk in real-time from a single pane of glass.
        </p>
      </div>

      <div
        style={{
          position: 'relative',
          maxWidth: '1000px',
          margin: '0 auto',
          borderRadius: '24px',
          overflow: 'hidden',
          boxShadow: isLight ? '0 20px 40px rgba(0,0,0,0.1)' : '0 20px 60px rgba(0,0,0,0.5)',
          border: isLight ? '1px solid #E2E8F0' : '1px solid #202E25',
          background: isLight ? '#FFFFFF' : '#101612',
          padding: '8px',
        }}
      >
        {/* Mockup Frame */}
        <div
          style={{
            borderRadius: '16px',
            overflow: 'hidden',
            position: 'relative',
            width: '100%',
            aspectRatio: '16/9',
            backgroundImage: 'url(https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop)',
            backgroundSize: 'cover',
            backgroundPosition: 'top center',
            filter: isLight ? 'contrast(1.1) brightness(0.95)' : 'contrast(1.15) brightness(0.85)',
          }}
        />

        {/* Overlay CTA Container */}
        <div
          style={{
            position: 'absolute',
            bottom: '40px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: isLight ? 'rgba(255, 255, 255, 0.9)' : 'rgba(10, 15, 11, 0.9)',
            backdropFilter: 'blur(12px)',
            padding: '24px 32px',
            borderRadius: '16px',
            border: isLight ? '1px solid #E2E8F0' : '1px solid #16A34A',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '16px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: isLight ? '#0F172A' : '#FFFFFF' }}>
              Launch Full Control Tower
            </h3>
            <p style={{ fontSize: '13px', color: isLight ? '#475569' : '#94A3B8', marginTop: '4px' }}>
              Access full S&OP reconciliation and risk telemetry.
            </p>
          </div>
          <NavLink to="/dashboard" style={{ textDecoration: 'none' }}>
            <GlowButton variant="primary" size="lg" icon={<ArrowRight size={16} />} iconPosition="right">
              OPEN CONTROL TOWER
            </GlowButton>
          </NavLink>
        </div>
      </div>
    </section>
  );
};
