import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/layout/Sidebar';
import { Header } from '../components/layout/Header';
import { CinematicBackground } from './CinematicBackground';
import { useMediaQuery } from '../hooks/useMediaQuery';

export const AppLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const isTablet = useMediaQuery('(max-width: 1024px)');

  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Persistent Single 3D Scene Background */}
      <CinematicBackground />

      {/* Global Brand Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} isTablet={isTablet} />

      {/* Backdrop for mobile sidebar */}
      {isTablet && isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(4px)',
            zIndex: 40,
          }}
        />
      )}

      {/* Main Content Area */}
      <div
        style={{
          flex: 1,
          marginLeft: isTablet ? '0px' : '270px',
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          position: 'relative',
          zIndex: 10,
          width: isTablet ? '100%' : 'calc(100% - 270px)',
        }}
      >
        <Header onMenuClick={() => setIsSidebarOpen(true)} isTablet={isTablet} />

        <main
          style={{
            flex: 1,
            padding: '24px 28px',
            maxWidth: '1600px',
            width: '100%',
            margin: '0 auto',
            position: 'relative',
          }}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};
