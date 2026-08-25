import React from 'react';
import { Shield } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

export const UserProfileBadge: React.FC = () => {
  const { mode } = useTheme();
  const isLight = mode === 'light';

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '4px 10px 4px 6px',
        borderRadius: '10px',
        background: isLight ? '#F0FDF4' : '#07150E',
        border: isLight ? '1px solid #D1FAE5' : '1px solid #162E20',
      }}
    >
      <div
        style={{
          width: '28px',
          height: '28px',
          borderRadius: '8px',
          background: 'linear-gradient(135deg, #16A34A 0%, #15803D 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#FFFFFF',
          fontWeight: 700,
          fontSize: '11px',
          boxShadow: '0 0 10px rgba(16, 185, 129, 0.4)',
        }}
      >
        P4
      </div>

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ fontSize: '12px', fontWeight: 700, color: isLight ? '#064E3B' : '#F0FDF4' }}>
            Lead Planner
          </span>
          <Shield size={10} color="#16A34A" />
        </div>
        <span style={{ fontSize: '10px', color: isLight ? '#15803D' : '#86A795' }}>
          SCM Command
        </span>
      </div>
    </div>
  );
};
