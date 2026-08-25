import React from 'react';
import { useTheme } from '../hooks/useTheme';

export const CinematicBackground: React.FC = () => {
  const { mode } = useTheme();
  const isLight = mode === 'light';

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 0,
        overflow: 'hidden',
        backgroundColor: isLight ? '#F8FAFC' : '#040705',
        transition: 'background-color 0.25s ease',
      }}
    >
      {/* Subtle Solid Green Ambient Lighting */}
      <div
        style={{
          position: 'absolute',
          top: '-10%',
          left: '20%',
          width: '60vw',
          height: '40vh',
          background: isLight
            ? 'radial-gradient(ellipse at center, rgba(16, 185, 129, 0.03) 0%, transparent 70%)'
            : 'radial-gradient(ellipse at center, rgba(16, 185, 129, 0.03) 0%, transparent 70%)',
        }}
      />
    </div>
  );
};
