import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

export interface TabItem {
  id: string;
  label: string;
  count?: number;
  icon?: React.ReactNode;
}

interface GlowTabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (tabId: string) => void;
  className?: string;
}

export const GlowTabs: React.FC<GlowTabsProps> = ({
  tabs,
  activeTab,
  onChange,
  className,
}) => {
  return (
    <div
      className={cn('inline-flex p-1 rounded-xl glass-panel relative gap-1', className)}
      style={{
        background: 'rgba(11, 17, 32, 0.65)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
      }}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            style={{
              position: 'relative',
              padding: '6px 14px',
              fontSize: '13px',
              fontWeight: 600,
              color: isActive ? '#FFFFFF' : '#94A3B8',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: 'transparent',
              border: 'none',
              transition: 'color 0.2s ease',
              zIndex: 1,
            }}
          >
            {tab.icon && <span style={{ display: 'flex', alignItems: 'center' }}>{tab.icon}</span>}
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span
                style={{
                  fontSize: '11px',
                  padding: '1px 6px',
                  borderRadius: '10px',
                  background: isActive ? 'rgba(6, 182, 212, 0.3)' : 'rgba(255, 255, 255, 0.1)',
                  color: isActive ? '#38BDF8' : '#64748B',
                }}
              >
                {tab.count}
              </span>
            )}

            {isActive && (
              <motion.div
                layoutId="activeTabPill"
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.25) 0%, rgba(99, 102, 241, 0.25) 100%)',
                  border: '1px solid rgba(6, 182, 212, 0.5)',
                  borderRadius: '8px',
                  boxShadow: '0 0 15px rgba(6, 182, 212, 0.3)',
                  zIndex: -1,
                }}
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
};
