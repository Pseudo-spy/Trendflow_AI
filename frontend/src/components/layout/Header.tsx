import React, { useState } from 'react';
import { Bell, Play, Menu } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { GlowButton } from '../ui/GlowButton';
import { ThemeToggle } from '../ui/ThemeToggle';
import { SearchBar } from '../ui/SearchBar';
import { PlanningPeriodBadge } from '../ui/PlanningPeriodBadge';
import { UserProfileBadge } from '../ui/UserProfileBadge';
import { QuickPlanningModal } from './QuickPlanningModal';

interface HeaderProps {
  onMenuClick?: () => void;
  isTablet?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick, isTablet }) => {
  const [isPlanningModalOpen, setIsPlanningModalOpen] = useState(false);
  const [hasUnreadAlerts, setHasUnreadAlerts] = useState(true);
  const { mode } = useTheme();
  const isLight = mode === 'light';

  return (
    <>
      <header
        className="glass-navbar"
        style={{
          height: '68px',
          position: 'sticky',
          top: 0,
          zIndex: 30,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 20px',
          gap: '12px',
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        {/* Left Section: Planning Period & Global Search */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            flex: '1 1 auto',
            minWidth: 0,
            overflow: 'hidden',
          }}
        >
          {isTablet && (
            <button
              onClick={onMenuClick}
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
          <div style={{ flexShrink: 0 }}>
            <PlanningPeriodBadge />
          </div>
          <div className="hide-mobile" style={{ flex: '1 1 auto', maxWidth: '280px', minWidth: '140px' }}>
            <SearchBar />
          </div>
        </div>

        {/* Right Section: Notifications, Theme Switcher, User Profile & RUN PLANNING CTA */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            flexShrink: 0,
          }}
        >
          {/* Theme Switcher (Animated Moon ↔ Sun) */}
          <div style={{ flexShrink: 0 }}>
            <ThemeToggle />
          </div>

          {/* Notifications Bell */}
          <button
            onClick={() => setHasUnreadAlerts(false)}
            title="System & Risk Notifications"
            style={{
              position: 'relative',
              width: '34px',
              height: '34px',
              borderRadius: '9px',
              background: isLight ? 'rgba(15, 23, 42, 0.04)' : 'rgba(255, 255, 255, 0.05)',
              border: isLight ? '1px solid rgba(15, 23, 42, 0.1)' : '1px solid rgba(255, 255, 255, 0.1)',
              color: isLight ? '#475569' : '#94A3B8',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease',
              flexShrink: 0,
            }}
          >
            <Bell size={15} />
            {hasUnreadAlerts && (
              <span
                style={{
                  position: 'absolute',
                  top: '6px',
                  right: '6px',
                  width: '7px',
                  height: '7px',
                  borderRadius: '50%',
                  backgroundColor: '#F43F5E',
                  boxShadow: '0 0 8px #F43F5E',
                }}
              />
            )}
          </button>

          {/* User Profile Badge */}
          <div style={{ flexShrink: 0 }}>
            <UserProfileBadge />
          </div>

          {/* Primary CTA: RUN PLANNING */}
          <div style={{ flexShrink: 0 }}>
            <GlowButton
              variant="primary"
              size="md"
              icon={<Play size={13} fill="currentColor" />}
              glow
              onClick={() => setIsPlanningModalOpen(true)}
              style={{
                fontWeight: 800,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                fontSize: '11px',
                padding: '0 14px',
                height: '36px',
                whiteSpace: 'nowrap',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              RUN PLANNING
            </GlowButton>
          </div>
        </div>
      </header>

      {/* Quick Planning Run Modal */}
      <QuickPlanningModal
        isOpen={isPlanningModalOpen}
        onClose={() => setIsPlanningModalOpen(false)}
      />
    </>
  );
};

export default Header;
