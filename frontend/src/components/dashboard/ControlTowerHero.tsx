import React, { useState } from 'react';
import { SceneCanvas } from '../../three/SceneCanvas';
import { controlTowerNodes } from '../../scenes/mock3DData';
const ControlTowerHero3D = React.lazy(() => import('../../scenes/ControlTowerHero3D').then(m => ({ default: m.ControlTowerHero3D })));
import type { SupplyChainNodeData } from '../../types/three';
import { Badge } from '../ui/Badge';
import { GlowButton } from '../ui/GlowButton';
import {
  Compass,
  Layers,
  Sparkles,
} from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { useMediaQuery } from '../../hooks/useMediaQuery';

export const ControlTowerHero: React.FC = () => {
  const [selectedNode, setSelectedNode] = useState<SupplyChainNodeData | null>(controlTowerNodes[0]);
  const [cameraParallax, setCameraParallax] = useState(true);
  const { mode } = useTheme();
  const isLight = mode === 'light';
  const isMobile = useMediaQuery('(max-width: 768px)');

  const activeNode = selectedNode || controlTowerNodes[0];

  return (
    <div
      style={{
        position: 'relative',
        borderRadius: '14px',
        background: isLight ? '#FFFFFF' : '#090D0B',
        border: isLight ? '1px solid #D1FAE5' : '1px solid #16241C',
        boxShadow: isLight
          ? '0 1px 3px rgba(0, 0, 0, 0.05), 0 4px 12px rgba(0, 0, 0, 0.05)'
          : '0 1px 3px rgba(0, 0, 0, 0.8), 0 6px 16px rgba(0, 0, 0, 0.6)',
        overflow: 'hidden',
        marginBottom: '28px',
        padding: '20px 24px',
      }}
    >
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
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #16A34A 0%, #15803D 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 14px rgba(16, 185, 129, 0.45)',
            }}
          >
            <Layers size={20} color="#FFFFFF" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 style={{ fontSize: '17px', fontWeight: 800, color: isLight ? '#064E3B' : '#F0FDF4' }}>
                Spatial Supply Chain Digital Twin
              </h2>
              <Badge variant="cyan" pulse={false}>
                SIMULATION VIEW
              </Badge>
            </div>

            <p style={{ fontSize: '11px', color: isLight ? '#15803D' : '#86A795' }}>
              Interactive 3D network with OR-Tools solver mapping & dynamic photon streams representing material flows.
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
              background: cameraParallax ? '#071A11' : isLight ? '#F0FDF4' : '#040705',
              border: cameraParallax ? '1px solid #16A34A' : isLight ? '1px solid #D1FAE5' : '1px solid #162E20',
              color: cameraParallax ? '#16A34A' : isLight ? '#047857' : '#86A795',
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

      {/* Main 3D Canvas Area with Integrated Node Telemetry Inspector */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'minmax(0, 1fr) 340px',
          gap: '16px',
          minHeight: '280px',
        }}
      >
        {/* 3D WebGL Viewport */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: isMobile ? '200px' : '280px',
            borderRadius: '14px',
            overflow: 'hidden',
            background: isLight ? '#F8FAFC' : '#000000',
            border: isLight ? '1px solid #D1FAE5' : '1px solid #16241C',
            boxShadow: '0 2px 8px rgba(0,0,0,0.4) inset',
          }}
        >
          {/* Top Instruction Pill */}
          <div
            style={{
              position: 'absolute',
              top: '12px',
              left: '14px',
              zIndex: 10,
              pointerEvents: 'none',
              background: isLight ? '#FFFFFF' : '#07120C',
              border: isLight ? '1px solid #D1FAE5' : '1px solid #162E20',
              boxShadow: '0 2px 6px rgba(0,0,0,0.5)',
              borderRadius: '6px',
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
            <span style={{ fontSize: '10px', fontWeight: 600, color: isLight ? '#064E3B' : '#F0FDF4' }}>
              Click a node to view details
            </span>
          </div>

          <SceneCanvas
            enableOrbit={true}
            enableParallax={cameraParallax}
            cameraPosition={[0, 7.5, 24]}
            fov={44}
          >
            <React.Suspense fallback={null}>
              <ControlTowerHero3D
                selectedNode={selectedNode}
                hoveredNode={null}
                onSelectNode={setSelectedNode}
              />
            </React.Suspense>
          </SceneCanvas>
        </div>

        {/* Live Node Telemetry Inspector HUD */}
        <div
          style={{
            borderRadius: '10px',
            background: isLight ? '#F0FDF4' : '#040705',
            border: isLight ? '1px solid #D1FAE5' : '1px solid #16241C',
            padding: '18px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxShadow: '0 1px 4px rgba(0,0,0,0.4)',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ fontSize: '10px', fontWeight: 800, color: '#16A34A', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Node Telemetry Inspector
              </span>
              <Badge variant={activeNode.status === 'optimal' ? 'emerald' : 'amber'}>
                {activeNode.status.toUpperCase()}
              </Badge>
            </div>

            <h3 style={{ fontSize: '17px', fontWeight: 800, color: isLight ? '#064E3B' : '#F0FDF4', marginBottom: '2px' }}>
              {activeNode.name}
            </h3>
            <p style={{ fontSize: '11px', color: isLight ? '#15803D' : '#86A795', marginBottom: '16px' }}>
              {activeNode.city} • {activeNode.country}
            </p>

            {/* Telemetry Metrics Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' }}>
              <div
                style={{
                  padding: '10px',
                  borderRadius: '6px',
                  background: isLight ? '#FFFFFF' : '#090D0B',
                  border: isLight ? '1px solid #D1FAE5' : '1px solid #16241C',
                }}
              >
                <div style={{ fontSize: '10px', color: isLight ? '#047857' : '#86A795' }}>Capacity Load</div>
                <div style={{ fontSize: '15px', fontWeight: 800, color: '#16A34A', fontFamily: "'JetBrains Mono', monospace" }}>
                  {activeNode.capacity}%
                </div>
              </div>

              <div
                style={{
                  padding: '10px',
                  borderRadius: '6px',
                  background: isLight ? '#FFFFFF' : '#090D0B',
                  border: isLight ? '1px solid #D1FAE5' : '1px solid #16241C',
                }}
              >
                <div style={{ fontSize: '10px', color: isLight ? '#047857' : '#86A795' }}>Risk Score</div>
                <div
                  style={{
                    fontSize: '15px',
                    fontWeight: 800,
                    color: activeNode.riskScore < 30 ? '#16A34A' : activeNode.riskScore < 60 ? '#F59E0B' : '#EF4444',
                    fontFamily: "'JetBrains Mono', monospace",
                  }}
                >
                  {activeNode.riskScore}/100
                </div>
              </div>
            </div>

            {/* Telemetry Status Rows */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
                <span style={{ color: isLight ? '#047857' : '#86A795' }}>Role in Pipeline</span>
                <span style={{ fontWeight: 700, color: isLight ? '#064E3B' : '#F0FDF4', textTransform: 'capitalize' }}>
                  {activeNode.type} Node
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
                <span style={{ color: isLight ? '#047857' : '#86A795' }}>Solver State</span>
                <span style={{ fontWeight: 700, color: '#16A34A' }}>Synchronized</span>
              </div>
            </div>
          </div>

          <div style={{ marginTop: '16px' }}>
            <GlowButton
              variant="primary"
              size="lg"
              icon={<Sparkles size={18} />}
              style={{
                width: '100%',
                fontWeight: 700,
              }}
            >
              Analyze {activeNode.name}
            </GlowButton>
          </div>
        </div>
      </div>

      {/* Node Selector Ribbon */}
      <div style={{ display: 'flex', gap: '8px', marginTop: '16px', overflowX: 'auto', paddingBottom: '4px' }}>
        {controlTowerNodes.map((node, index) => {
          const isSelected = activeNode.id === node.id;
          return (
            <button
              key={node.id}
              onClick={() => setSelectedNode(node)}
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
              {index + 1}. {node.name.replace(/^\d+\.\s*/, '')}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ControlTowerHero;
