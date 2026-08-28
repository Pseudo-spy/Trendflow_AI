import React, { useState } from 'react';
import { Play, Menu } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { GlowButton } from '../ui/GlowButton';
import { SearchBar } from '../ui/SearchBar';
import { QuickPlanningModal } from './QuickPlanningModal';
import { type MaterialRequirementContract } from '../../services/api/sopApi';

interface HeaderProps {
  onMenuClick?: () => void;
  isTablet?: boolean;
  onSopPlanningComplete?: (result: MaterialRequirementContract) => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick, isTablet, onSopPlanningComplete }) => {
  const [isPlanningModalOpen, setIsPlanningModalOpen] = useState(false);
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
        {/* Left Section: Global Search */}
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
                color: isLight ? '#000' : '#fff',
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
          <div className="hide-mobile" style={{ flex: '1 1 auto', maxWidth: '400px', minWidth: '140px' }}>
            <SearchBar />
          </div>
        </div>

        {/* Right Section: Primary CTA: RUN PLANNING */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            flexShrink: 0,
          }}
        >
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
        onPlanningComplete={(result) => {
          if (onSopPlanningComplete) {
            onSopPlanningComplete(result);
          }
        }}
      />
    </>
  );
};

export default Header;

