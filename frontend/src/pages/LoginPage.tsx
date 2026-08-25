import React from 'react';
import { PageTransitionLayout } from '../layouts/PageTransitionLayout';
import { SceneCanvas } from '../three/SceneCanvas';
import { LoginVisual3D } from '../components/login/LoginVisual3D';
import { LoginForm } from '../components/login/LoginForm';
import { Layers } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { useMediaQuery } from '../hooks/useMediaQuery';

export const LoginPage: React.FC = () => {
  const { mode } = useTheme();
  const isLight = mode === 'light';
  const isTablet = useMediaQuery('(max-width: 1024px)');
  const isMobile = useMediaQuery('(max-width: 768px)');

  return (
    <PageTransitionLayout>
      {/* Full Page Container with Solid Black and Smart Warehouse Background */}
      <div
        style={{
          minHeight: '100vh',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          backgroundColor: '#000000',
        }}
      >
        {/* User-Selected Photorealistic Smart Warehouse Background Image */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url('/images/login_warehouse_ai.jpg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center 35%',
            backgroundRepeat: 'no-repeat',
            opacity: isLight ? 0.5 : 0.75,
            filter: 'brightness(0.9) contrast(1.1)',
            zIndex: 0,
          }}
        />

        {/* Solid Dark Enterprise Overlay with Subtle Forest-Green Ambient Accent */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: isLight
              ? 'linear-gradient(135deg, rgba(248, 250, 252, 0.75) 0%, rgba(240, 253, 244, 0.85) 100%)'
              : 'radial-gradient(ellipse at center, rgba(4, 10, 7, 0.4) 0%, rgba(0, 0, 0, 0.85) 100%)',
            zIndex: 1,
          }}
        />

        {/* Foreground Split-Screen Grid */}
        <div
          style={{
            position: 'relative',
            zIndex: 10,
            width: '100%',
            maxWidth: '1500px',
            minHeight: '100vh',
            display: 'grid',
            gridTemplateColumns: isTablet ? '1fr' : 'minmax(380px, 1.25fr) minmax(340px, 1fr)',
            padding: '24px',
            gap: '28px',
            alignItems: 'center',
            boxSizing: 'border-box',
            overflowY: isTablet ? 'auto' : 'visible',
          }}
          className="login-page-grid"
        >
          {/* Left Side: 3D Supply Chain Visual Showcase with Solid Black & Green Frame */}
          {(!isMobile || !isTablet) && (
          <div
            style={{
              position: 'relative',
              height: '100%',
              minHeight: '620px',
              borderRadius: '20px',
              overflow: 'hidden',
              background: isLight
                ? '#FFFFFF'
                : 'linear-gradient(145deg, #070D0A 0%, #030604 100%)',
              border: isLight ? '1px solid #D1FAE5' : '1px solid #162B1F',
              boxShadow: isLight
                ? '0 10px 30px rgba(0, 0, 0, 0.08)'
                : '0 20px 50px rgba(0, 0, 0, 0.9), 0 0 25px rgba(16, 185, 129, 0.12)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              padding: '28px 32px',
            }}
          >
            {/* Panel Internal Warehouse Texture Overlay */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: `url('/images/login_warehouse_ai.jpg')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center 35%',
                opacity: 0.25,
                mixBlendMode: 'luminosity',
                pointerEvents: 'none',
                zIndex: 0,
              }}
            />

            {/* Top Brand Header */}
            <div style={{ position: 'relative', zIndex: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    background: 'linear-gradient(135deg, #16A34A 0%, #15803D 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 0 16px rgba(16, 185, 129, 0.45)',
                  }}
                >
                  <Layers size={20} color="#FFFFFF" />
                </div>
                <span
                  style={{
                    fontSize: '20px',
                    fontWeight: 900,
                    color: isLight ? '#064E3B' : '#F0FDF4',
                    letterSpacing: '-0.02em',
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                  }}
                >
                  TRENDFLOW AI
                </span>
              </div>
              <p style={{ fontSize: '12px', color: isLight ? '#047857' : '#86A795', maxWidth: '380px' }}>
                Integrated S&OP + Procurement Intelligence. Synchronize ML forecasts with mathematical MILP optimization.
              </p>
            </div>

            {/* Embedded Real 3D Canvas */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                zIndex: 1,
              }}
            >
              <SceneCanvas
                enableOrbit={true}
                enableParallax={true}
                cameraPosition={[0, -0.2, 11.5]}
                fov={38}
              >
                <LoginVisual3D />
              </SceneCanvas>
            </div>
            </div>
          )}

          {/* Right Side: Glassmorphism Login Form */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '16px',
              position: 'relative',
              zIndex: 10,
            }}
          >
            <LoginForm />
          </div>
        </div>
      </div>
    </PageTransitionLayout>
  );
};

export default LoginPage;
