import React, { useState } from 'react';
import { SceneCanvas } from '../../three/SceneCanvas';
const ScenarioSimulation3D = React.lazy(() => import('../../scenes/ScenarioSimulation3D').then(m => ({ default: m.ScenarioSimulation3D })));
import type { SupplyChainNodeData } from '../../types/three';
import type { ScenarioParameters } from '../../types/scenario';
import { Badge } from '../ui/Badge';
import { Compass, Sliders } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { useMediaQuery } from '../../hooks/useMediaQuery';

interface ScenarioHeroProps {
  params: ScenarioParameters;
  isSimulating: boolean;
}

export const ScenarioHero: React.FC<ScenarioHeroProps> = ({
  params,
  isSimulating,
}) => {
  const [selectedNode, setSelectedNode] = useState<SupplyChainNodeData | null>(null);
  const { mode, cameraParallax, setCameraParallax } = useTheme();
  const isLight = mode === 'light';
  const isMobile = useMediaQuery('(max-width: 768px)');

  return (
    <div
      style={{
        position: 'relative',
        borderRadius: '20px',
        background: isLight
          ? 'linear-gradient(145deg, rgba(255, 255, 255, 0.95) 0%, rgba(241, 245, 249, 0.9) 100%)'
          : 'linear-gradient(145deg, rgba(23, 34, 59, 0.85) 0%, rgba(7, 12, 24, 0.95) 100%)',
        border: isLight ? '1px solid rgba(2, 132, 199, 0.25)' : '1px solid rgba(6, 182, 212, 0.35)',
        boxShadow: isLight
          ? '0 20px 50px rgba(2, 132, 199, 0.1)'
          : '0 20px 50px rgba(0, 0, 0, 0.7), 0 0 35px rgba(6, 182, 212, 0.15)',
        overflow: 'hidden',
        marginBottom: '28px',
        padding: '20px 24px',
      }}
    >
      {/* Top Specular Ambient Line */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '2px',
          background: 'linear-gradient(90deg, transparent, #06B6D4, #6366F1, #16A34A, transparent)',
        }}
      />

      {/* Header Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '16px',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #06B6D4 0%, #6366F1 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 15px rgba(6, 182, 212, 0.4)',
            }}
          >
            <Sliders size={20} color="#FFFFFF" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 800, color: isLight ? '#0F172A' : '#F8FAFC' }}>
                Spatial Scenario Simulation Engine
              </h2>
              <Badge variant={isSimulating ? 'amber' : 'cyan'} pulse={isSimulating}>
                {isSimulating ? 'RECALCULATING...' : 'LIVE 3D SIMULATION'}
              </Badge>
            </div>
            <p style={{ fontSize: '11px', color: '#94A3B8' }}>
              Real-time 3D network reacting dynamically to Demand, Production, Material & Supplier stress tests
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={() => setCameraParallax(!cameraParallax)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '8px',
              background: cameraParallax ? 'rgba(99, 102, 241, 0.15)' : 'rgba(255, 255, 255, 0.05)',
              border: cameraParallax ? '1px solid rgba(99, 102, 241, 0.4)' : '1px solid rgba(255, 255, 255, 0.1)',
              color: cameraParallax ? '#818CF8' : '#94A3B8',
              fontSize: '11px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            <Compass size={13} />
            <span>Mouse Parallax: {cameraParallax ? 'ON' : 'OFF'}</span>
          </button>
        </div>
      </div>

      {/* Main 3D Canvas Area */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: isMobile ? '200px' : '280px',
          borderRadius: '14px',
          overflow: 'hidden',
          background: isLight ? 'rgba(241, 245, 249, 0.7)' : 'rgba(3, 7, 18, 0.8)',
          border: isLight ? '1px solid rgba(15, 23, 42, 0.1)' : '1px solid rgba(6, 182, 212, 0.25)',
          boxShadow: '0 10px 30px rgba(0,0,0,0.5) inset',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '12px',
            left: '14px',
            zIndex: 10,
            pointerEvents: 'none',
            background: 'rgba(7, 12, 24, 0.85)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(6, 182, 212, 0.3)',
            borderRadius: '8px',
            padding: '4px 10px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <span
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: '#06B6D4',
              boxShadow: '0 0 6px #06B6D4',
            }}
          />
          <span style={{ fontSize: '10px', fontWeight: 600, color: '#F8FAFC' }}>
            Adjust controls below to witness real-time 3D node scaling & photon velocity recalculation
          </span>
        </div>

        {selectedNode && (
          <div
            style={{
              position: 'absolute',
              bottom: '14px',
              right: '14px',
              zIndex: 10,
              background: 'rgba(7, 12, 24, 0.9)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(6, 182, 212, 0.4)',
              borderRadius: '10px',
              padding: '10px 14px',
              maxWidth: '280px',
              boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
            }}
          >
            <div style={{ fontSize: '12px', fontWeight: 800, color: '#06B6D4', marginBottom: '2px' }}>
              {selectedNode.name}
            </div>
            <div style={{ fontSize: '11px', color: '#94A3B8' }}>
              {selectedNode.city} • {selectedNode.country}
            </div>
            <div style={{ fontSize: '11px', color: '#16A34A', marginTop: '4px', fontFamily: "'JetBrains Mono', monospace" }}>
              Throughput: {selectedNode.throughput.toLocaleString()} u
            </div>
          </div>
        )}

        <SceneCanvas
          enableOrbit={true}
          enableParallax={cameraParallax}
          cameraPosition={[0, 5, 17]}
          fov={44}
        >
          <React.Suspense fallback={null}>
            <ScenarioSimulation3D
              params={params}
              selectedNodeId={selectedNode?.id || null}
              onSelectNode={setSelectedNode}
            />
          </React.Suspense>
        </SceneCanvas>
      </div>
    </div>
  );
};
