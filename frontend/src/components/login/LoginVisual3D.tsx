import React from 'react';
import { Html } from '@react-three/drei';
import {
  FloatingObject,
  HoverableObject,
  ConnectionLine,
  DataParticle,
  HologramGrid,
  SupplyChainNode3D,
} from '../../three';
import { useTheme } from '../../hooks/useTheme';

export const LoginVisual3D: React.FC = () => {
  const { mode } = useTheme();
  const isLight = mode === 'light';

  // 6 distinct stages perfectly proportioned to fit comfortably inside the showcase frame
  const nodes = [
    {
      id: '1',
      name: 'Factory',
      stageNum: '1',
      type: 'factory' as const,
      pos: [-2.5, 0.85, 0] as [number, number, number],
      color: '#3B82F6', // Blue
      badgeBorder: 'rgba(59, 130, 246, 0.4)',
    },
    {
      id: '2',
      name: 'Warehouse',
      stageNum: '2',
      type: 'warehouse' as const,
      pos: [0.0, 1.75, 0] as [number, number, number],
      color: '#FACC15', // Yellow
      badgeBorder: 'rgba(250, 204, 21, 0.4)',
    },
    {
      id: '3',
      name: 'Materials',
      stageNum: '3',
      type: 'materials' as const,
      pos: [2.5, 0.85, 0] as [number, number, number],
      color: '#F97316', // Orange
      badgeBorder: 'rgba(249, 115, 22, 0.4)',
    },
    {
      id: '4',
      name: 'Suppliers',
      stageNum: '4',
      type: 'supplier' as const,
      pos: [2.5, -1.45, 0] as [number, number, number],
      color: '#8B5CF6', // Purple
      badgeBorder: 'rgba(139, 92, 246, 0.4)',
    },
    {
      id: '5',
      name: 'Procurement',
      stageNum: '5',
      type: 'procurement' as const,
      pos: [0.0, -2.35, 0] as [number, number, number],
      color: '#F43F5E', // Rose/Red
      badgeBorder: 'rgba(244, 63, 94, 0.4)',
    },
    {
      id: '6',
      name: 'Distribution',
      stageNum: '6',
      type: 'logistics' as const,
      pos: [-2.5, -1.45, 0] as [number, number, number],
      color: '#06B6D4', // Cyan
      badgeBorder: 'rgba(6, 182, 212, 0.4)',
    },
  ];

  return (
    <>
      <HologramGrid size={24} divisions={24} />

      {/* Very sparse ambient particles */}
      <DataParticle count={20} radius={12} speed={0.03} />

      {/* Sequential Loop Connection Lines — single packet, slow */}
      {nodes.map((node, idx) => {
        const nextNode = nodes[(idx + 1) % nodes.length];
        return (
          <ConnectionLine
            key={idx}
            start={node.pos}
            end={nextNode.pos}
            packetCount={1}
            speed={0.3}
            color={node.color}
          />
        );
      })}

      {/* Central Command Core — minimal float, no pulse */}
      <FloatingObject position={[0, -0.3, 0]} speed={0.4} floatIntensity={0.03} rotationSpeed={0.02}>
        <HoverableObject hoverScale={1.08} tooltipText="TRENDFLOW Core" tooltipSubtext="Autonomous Intelligence Engine">
          <SupplyChainNode3D meshType="decision" color="#16A34A" status="optimal" />
        </HoverableObject>
        <Html position={[0, -0.8, 0]} center distanceFactor={14} style={{ pointerEvents: 'none' }}>
          <div
            style={{
              background: '#07120C',
              border: '1px solid #16241C',
              borderRadius: '20px',
              padding: '3px 10px',
              whiteSpace: 'nowrap',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              boxShadow: '0 2px 6px rgba(0,0,0,0.4)',
            }}
          >
            <span
              style={{
                width: '5px',
                height: '5px',
                borderRadius: '50%',
                backgroundColor: '#16A34A',
              }}
            />
            <span style={{ fontSize: '11px', fontWeight: 800, color: '#F0FDF4', letterSpacing: '0.02em' }}>
              TRENDFLOW Core
            </span>
          </div>
        </Html>
      </FloatingObject>

      {/* Render 6 Stages — minimal float, no glow labels */}
      {nodes.map((node) => (
        <FloatingObject
          key={node.id}
          position={node.pos}
          speed={0.4}
          floatIntensity={0.03}
          rotationSpeed={0.02}
        >
          <HoverableObject hoverScale={1.08} tooltipText={node.name} tooltipSubtext={`Stage ${node.stageNum} in closed-loop SCM`}>
            <SupplyChainNode3D meshType={node.type} color={node.color} status="optimal" />
          </HoverableObject>

          {/* Stage Name Tag — solid, no glow */}
          <Html position={[0, -0.75, 0]} center distanceFactor={14} style={{ pointerEvents: 'none' }}>
            <div
              style={{
                background: isLight ? 'rgba(255, 255, 255, 0.95)' : '#07120C',
                border: `1px solid ${node.badgeBorder}`,
                borderRadius: '16px',
                padding: '3px 9px',
                whiteSpace: 'nowrap',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
              }}
            >
              <span
                style={{
                  width: '5px',
                  height: '5px',
                  borderRadius: '50%',
                  backgroundColor: node.color,
                }}
              />
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 800,
                  color: node.color,
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                }}
              >
                {node.name}
              </span>
            </div>
          </Html>
        </FloatingObject>
      ))}
    </>
  );
};
