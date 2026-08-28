import React from 'react';
import { Bell, Eye, EyeOff, Sun, Moon, Compass } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { Badge } from '../ui/Badge';

export const TopBar: React.FC = () => {
  const { is3DEnabled, setIs3DEnabled, mode, toggleTheme, cameraParallax, setCameraParallax } = useTheme();
  const isLight = mode === 'light';

  return (
    <header
      className="glass-navbar"
      style={{
        height: '64px',
        position: 'sticky',
        top: 0,
        zIndex: 30,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 28px',
      }}
    >
      {/* Left status badge & ticker */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <Badge variant="cyan" pulse>
          3D ENGINE READY
        </Badge>
        <span
          style={{
            fontSize: '12px',
            color: isLight ? '#475569' : '#94A3B8',
            fontFamily: "'JetBrains Mono', monospace",
          }}
        >
          Theme: <strong style={{ textTransform: 'capitalize' }}>{mode}</strong> • 60 FPS • WebGL 2.0
        </span>
      </div>

      {/* Right Action Icons & Toggles */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {/* Parallax Toggle */}
        <button
          onClick={() => setCameraParallax(!cameraParallax)}
          title="Toggle Camera Parallax"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 10px',
            borderRadius: '8px',
            background: cameraParallax ? 'rgba(99, 102, 241, 0.15)' : 'rgba(255, 255, 255, 0.05)',
            border: cameraParallax ? '1px solid rgba(99, 102, 241, 0.4)' : '1px solid rgba(255, 255, 255, 0.1)',
            color: cameraParallax ? '#818CF8' : '#94A3B8',
            fontSize: '12px',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          <Compass size={14} />
          <span>Parallax {cameraParallax ? 'ON' : 'OFF'}</span>
        </button>

        {/* 3D Scene Toggle */}
        <button
          onClick={() => setIs3DEnabled(!is3DEnabled)}
          title="Toggle 3D Background"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 10px',
            borderRadius: '8px',
            background: is3DEnabled ? 'rgba(6, 182, 212, 0.15)' : 'rgba(255, 255, 255, 0.05)',
            border: is3DEnabled ? '1px solid rgba(6, 182, 212, 0.4)' : '1px solid rgba(255, 255, 255, 0.1)',
            color: is3DEnabled ? '#38BDF8' : '#94A3B8',
            fontSize: '12px',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          {is3DEnabled ? <Eye size={14} /> : <EyeOff size={14} />}
          <span>{is3DEnabled ? '3D Active' : '3D Muted'}</span>
        </button>

        {/* Theme Switcher Button */}
        <button
          onClick={toggleTheme}
          title={`Switch Theme (Current: ${mode})`}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 12px',
            borderRadius: '8px',
            background: isLight ? 'rgba(2, 132, 199, 0.12)' : 'rgba(245, 158, 11, 0.15)',
            border: isLight ? '1px solid rgba(2, 132, 199, 0.3)' : '1px solid rgba(245, 158, 11, 0.3)',
            color: isLight ? '#0284C7' : '#FBBF24',
            fontSize: '12px',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          {isLight ? <Moon size={14} /> : <Sun size={14} />}
          <span style={{ textTransform: 'capitalize' }}>
            {mode === 'light' ? 'Switch to Dark' : mode === 'dark' ? 'Switch to Light' : 'Switch to Light'}
          </span>
        </button>

        {/* Notification Bell */}
        <button
          style={{
            position: 'relative',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '8px',
            padding: '8px',
            color: '#94A3B8',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Bell size={16} />
          <span
            style={{
              position: 'absolute',
              top: '5px',
              right: '5px',
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: '#F43F5E',
              boxShadow: '0 0 6px #F43F5E',
            }}
          />
        </button>
      </div>
    </header>
  );
};
