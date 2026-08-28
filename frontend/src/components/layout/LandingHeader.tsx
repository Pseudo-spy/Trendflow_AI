import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Layers, LogIn, Menu } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { GlowButton } from '../ui/GlowButton';
import { useMediaQuery } from '../../hooks/useMediaQuery';

const HeaderLink: React.FC<{ href: string; children: React.ReactNode; isLight: boolean }> = ({ href, children, isLight }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <a
      href={href}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        fontSize: '13px',
        fontWeight: 600,
        color: isHovered ? '#16A34A' : isLight ? '#475569' : '#94A3B8',
        textDecoration: 'none',
        transition: 'color 0.2s',
      }}
    >
      {children}
    </a>
  );
};

const RouterHeaderLink: React.FC<{ to: string; children: React.ReactNode; isLight: boolean }> = ({ to, children, isLight }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <NavLink
      to={to}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        fontSize: '13px',
        fontWeight: 600,
        color: isHovered ? '#16A34A' : isLight ? '#475569' : '#94A3B8',
        textDecoration: 'none',
        transition: 'color 0.2s',
      }}
    >
      {children}
    </NavLink>
  );
};

export const LandingHeader: React.FC = () => {
  const { mode } = useTheme();
  const isLight = mode === 'light';
  const isTablet = useMediaQuery('(max-width: 1024px)');

  return (
    <header
      className="glass-navbar"
      style={{
        height: '70px',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 40px',
        gap: '16px',
        width: '100%',
        boxSizing: 'border-box',
        borderBottom: isLight ? '1px solid rgba(15, 23, 42, 0.08)' : '1px solid rgba(255, 255, 255, 0.08)',
      }}
    >
      {/* Brand Identity */}
      <NavLink
        to="/home"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          textDecoration: 'none',
          flexShrink: 0,
        }}
      >
        <div
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #16A34A 0%, #15803D 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 16px rgba(22, 163, 74, 0.45)',
          }}
        >
          <Layers size={20} color="#FFFFFF" />
        </div>
        <div>
          <span
            style={{
              fontSize: '17px',
              fontWeight: 900,
              color: isLight ? '#0F172A' : '#F8FAFC',
              letterSpacing: '-0.02em',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}
          >
            TRENDFLOW AI
          </span>
          <div style={{ fontSize: '10px', color: isLight ? '#64748B' : '#94A3B8', fontWeight: 600 }}>
            Integrated S&OP + Procurement
          </div>
        </div>
      </NavLink>

      {/* Nav Links */}
      <nav
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '24px',
        }}
        className="hide-tablet"
      >
        <HeaderLink href="#platform" isLight={isLight}>Platform</HeaderLink>
        <HeaderLink href="#pipeline-flow" isLight={isLight}>How It Works</HeaderLink>
        <HeaderLink href="#capabilities" isLight={isLight}>Capabilities</HeaderLink>
        <RouterHeaderLink to="/dashboard" isLight={isLight}>Control Tower</RouterHeaderLink>
      </nav>

      {/* Action Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
        {isTablet && (
          <button
            style={{
              background: 'none',
              border: 'none',
              color: '#fff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '4px',
            }}
          >
            <Menu size={24} />
          </button>
        )}

        {/* Login Button */}
        <NavLink to="/login" style={{ textDecoration: 'none' }}>
          <GlowButton
            variant="primary"
            size="sm"
            icon={<LogIn size={13} />}
            glow
            style={{
              fontWeight: 800,
              fontSize: '12px',
              padding: '0 16px',
              height: '36px',
              letterSpacing: '0.03em',
            }}
          >
            LOG IN
          </GlowButton>
        </NavLink>
      </div>
    </header>
  );
};
