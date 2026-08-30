import React, { useState } from 'react';
import { SceneCanvas } from '../../three/SceneCanvas';
import { sopPipelineStages } from '../../scenes/mock3DData';
const SopPipeline3D = React.lazy(() => import('../../scenes/SopPipeline3D').then(m => ({ default: m.SopPipeline3D })));
import type { SupplyChainNodeData } from '../../types/three';
import { Badge } from '../ui/Badge';
import {
  Compass,
  Boxes,
} from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { useMediaQuery } from '../../hooks/useMediaQuery';

export const SopPipelineHero: React.FC = () => {
  const [selectedStage, setSelectedStage] = useState<SupplyChainNodeData | null>(sopPipelineStages[0]);
  const { mode, cameraParallax, setCameraParallax } = useTheme();
  const isLight = mode === 'light';
  const isMobile = useMediaQuery('(max-width: 768px)');

  const activeStage = selectedStage || sopPipelineStages[0];

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
          : '0 20px 50px rgba(0, 0, 0, 0.7), 0 0 30px rgba(6, 182, 212, 0.15)',
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
              background: 'linear-gradient(135deg, #16A34A 0%, #06B6D4 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 15px rgba(16, 185, 129, 0.4)',
            }}
          >
            <Boxes size={20} color="#FFFFFF" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 800, color: isLight ? '#0F172A' : '#F8FAFC' }}>
                Dimensional S&OP Planning Pipeline
              </h2>
              <Badge variant="emerald" pulse>
                CLOSED LOOP
              </Badge>
            </div>
            <p style={{ fontSize: '11px', color: '#94A3B8' }}>
              Demand → Forecast → Inventory → Production → Capacity → Material Requirement
            </p>
          </div>
        </div>

        {/* View Controls */}
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

      {/* Main 3D Canvas & Stage Inspector */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'minmax(0, 1fr) 320px',
          gap: '16px',
          minHeight: '280px',
        }}
      >
        {/* 3D WebGL Canvas */}
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
                backgroundColor: '#16A34A',
                boxShadow: '0 0 6px #16A34A',
              }}
            />
            <span style={{ fontSize: '10px', fontWeight: 600, color: '#F8FAFC' }}>
              Interactive 3D S&OP Flow • Click any stage to inspect balance metrics
            </span>
          </div>

          <SceneCanvas
            enableOrbit={true}
            enableParallax={cameraParallax}
            cameraPosition={[0, 4, 16]}
            fov={44}
          >
            <React.Suspense fallback={null}>
              <SopPipeline3D
                selectedStage={selectedStage}
                onSelectStage={setSelectedStage}
              />
            </React.Suspense>
          </SceneCanvas>
        </div>

        {/* Stage Inspector HUD */}
        <div
          style={{
            borderRadius: '14px',
            background: isLight ? 'rgba(255, 255, 255, 0.9)' : 'rgba(11, 17, 32, 0.85)',
            border: isLight ? '1px solid rgba(15, 23, 42, 0.12)' : '1px solid rgba(16, 185, 129, 0.3)',
            padding: '18px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={{ fontSize: '10px', fontWeight: 800, color: '#16A34A', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Pipeline Stage Inspector
              </span>
              <Badge variant="emerald">
                SYNCHRONIZED
              </Badge>
            </div>

            <h3 style={{ fontSize: '17px', fontWeight: 800, color: isLight ? '#0F172A' : '#F8FAFC', marginBottom: '2px' }}>
              {activeStage.name}
            </h3>
            <p style={{ fontSize: '11px', color: '#94A3B8', marginBottom: '14px' }}>
              {activeStage.city} • {activeStage.country}
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '14px' }}>
              <div style={{ padding: '10px', borderRadius: '8px', background: isLight ? 'rgba(15, 23, 42, 0.04)' : 'rgba(255, 255, 255, 0.04)' }}>
                <div style={{ fontSize: '10px', color: '#64748B' }}>Stage Throughput</div>
                <div style={{ fontSize: '15px', fontWeight: 800, color: '#16A34A', fontFamily: "'JetBrains Mono', monospace" }}>
                  {activeStage.throughput.toLocaleString()} u
                </div>
              </div>
              <div style={{ padding: '10px', borderRadius: '8px', background: isLight ? 'rgba(15, 23, 42, 0.04)' : 'rgba(255, 255, 255, 0.04)' }}>
                <div style={{ fontSize: '10px', color: '#64748B' }}>Capacity Load</div>
                <div style={{ fontSize: '15px', fontWeight: 800, color: '#06B6D4', fontFamily: "'JetBrains Mono', monospace" }}>
                  {activeStage.capacity}%
                </div>
              </div>
            </div>

            <div
              style={{
                padding: '10px 12px',
                borderRadius: '8px',
                background: isLight ? 'rgba(16, 185, 129, 0.06)' : 'rgba(16, 185, 129, 0.08)',
                border: isLight ? '1px solid rgba(16, 185, 129, 0.15)' : '1px solid rgba(16, 185, 129, 0.2)',
                fontSize: '11px',
                color: isLight ? '#047857' : '#34D399',
                lineHeight: '1.4',
              }}
            >
              <strong>Constraint Status:</strong> No bottleneck detected. Line pacing aligns with Q3 aggregate plan.
            </div>
          </div>


        </div>
      </div>

      {/* Stage Selector Ribbon */}
      <div style={{ display: 'flex', gap: '8px', marginTop: '14px', overflowX: 'auto', paddingBottom: '4px' }}>
        {sopPipelineStages.map((stage) => {
          const isSelected = activeStage.id === stage.id;
          return (
            <button
              key={stage.id}
              onClick={() => setSelectedStage(stage)}
              style={{
                padding: '6px 12px',
                borderRadius: '8px',
                background: isSelected
                  ? isLight
                    ? 'rgba(16, 185, 129, 0.15)'
                    : 'rgba(16, 185, 129, 0.2)'
                  : isLight
                  ? 'rgba(15, 23, 42, 0.04)'
                  : 'rgba(255, 255, 255, 0.04)',
                border: isSelected
                  ? '1px solid #16A34A'
                  : isLight
                  ? '1px solid rgba(15, 23, 42, 0.08)'
                  : '1px solid rgba(255, 255, 255, 0.08)',
                color: isSelected ? (isLight ? '#15803D' : '#34D399') : (isLight ? '#475569' : '#94A3B8'),
                fontSize: '11px',
                fontWeight: isSelected ? 700 : 500,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease',
              }}
            >
              {stage.name}
            </button>
          );
        })}
      </div>
    </div>
  );
};
