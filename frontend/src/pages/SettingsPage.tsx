import React from 'react';
import { PageTransitionLayout } from '../layouts/PageTransitionLayout';
import { PageHeader } from '../components/ui/PageHeader';
import { CinematicCard } from '../components/ui/CinematicCard';
import { Eye, Cpu } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

export const SettingsPage: React.FC = () => {
  const { is3DEnabled, setIs3DEnabled, performanceMode, setPerformanceMode } = useTheme();

  return (
    <PageTransitionLayout>
      <PageHeader
        title="System Settings & Preferences"
        subtitle="Graphics rendering, 3D visualization fidelity, and backend connection configs"
        badgeText="System"
        badgeVariant="cyan"
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
        <CinematicCard
          title="3D Spatial Engine"
          subtitle="Configure Three.js WebGL background scene"
          icon={<Eye size={20} />}
          glowColor="cyan"
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '16px' }}>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 600, color: '#F8FAFC' }}>Enable 3D Scene</div>
              <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '2px' }}>
                Renders interactive 3D supply chain nodes and particle clouds
              </div>
            </div>
            <input
              type="checkbox"
              checked={is3DEnabled}
              onChange={(e) => setIs3DEnabled(e.target.checked)}
              style={{ width: '20px', height: '20px', accentColor: '#06B6D4', cursor: 'pointer' }}
            />
          </div>
        </CinematicCard>

        <CinematicCard
          title="Performance Tuning"
          subtitle="Optimize frame rates for lower power devices"
          icon={<Cpu size={20} />}
          glowColor="indigo"
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '16px' }}>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 600, color: '#F8FAFC' }}>Performance Mode</div>
              <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '2px' }}>
                Reduces particle count and shader blur for higher FPS
              </div>
            </div>
            <input
              type="checkbox"
              checked={performanceMode}
              onChange={(e) => setPerformanceMode(e.target.checked)}
              style={{ width: '20px', height: '20px', accentColor: '#6366F1', cursor: 'pointer' }}
            />
          </div>
        </CinematicCard>
      </div>
    </PageTransitionLayout>
  );
};
