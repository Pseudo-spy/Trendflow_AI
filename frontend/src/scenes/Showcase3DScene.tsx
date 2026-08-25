import React, { useState } from 'react';
import {
  FloatingObject,
  HoverableObject,
  GlowingNode,
  ConnectionLine,
  DataParticle,
  OrbitingObject,
  PulseEffect,
  HologramGrid,
} from '../three';
import type { SupplyChainNodeData } from '../types/three';
import { useTheme } from '../hooks/useTheme';

export const showcaseNodes: SupplyChainNodeData[] = [
  {
    id: 'showcase-hub',
    name: 'TrendFlow AI Core Hub',
    type: 'factory',
    position: [0, 0.5, 0],
    status: 'optimal',
    capacity: 99,
    throughput: 45000,
    leadTimeDays: 2,
    riskScore: 8,
    city: 'Global AI Hub',
    country: 'Digital Twin',
  },
  {
    id: 'showcase-1',
    name: 'Alpha Mill (Taiwan)',
    type: 'supplier',
    position: [-6, 0.8, -3],
    status: 'optimal',
    capacity: 94,
    throughput: 12000,
    leadTimeDays: 7,
    riskScore: 14,
    city: 'Taipei',
    country: 'Taiwan',
  },
  {
    id: 'showcase-2',
    name: 'Beta Weaving (Vietnam)',
    type: 'supplier',
    position: [-7, -0.2, 4],
    status: 'warning',
    capacity: 78,
    throughput: 8400,
    leadTimeDays: 12,
    riskScore: 46,
    city: 'Hanoi',
    country: 'Vietnam',
  },
  {
    id: 'showcase-3',
    name: 'Euro Fulfillment DC',
    type: 'warehouse',
    position: [6, 1.2, -2],
    status: 'simulated',
    capacity: 88,
    throughput: 21000,
    leadTimeDays: 3,
    riskScore: 19,
    city: 'Frankfurt',
    country: 'Germany',
  },
  {
    id: 'showcase-4',
    name: 'Americas Pacific Gateway',
    type: 'distribution',
    position: [5.5, -0.5, 4],
    status: 'optimal',
    capacity: 96,
    throughput: 29000,
    leadTimeDays: 4,
    riskScore: 11,
    city: 'Seattle',
    country: 'USA',
  },
];

export const Showcase3DScene: React.FC = () => {
  const [selectedNode, setSelectedNode] = useState<SupplyChainNodeData | null>(showcaseNodes[0]);
  const { mode } = useTheme();
  const isLight = mode === 'light';

  return (
    <>
      {/* 3D Coordinate Grid */}
      <HologramGrid size={36} divisions={36} />

      {/* Ambient Particle Field */}
      <DataParticle count={180} radius={16} speed={0.25} />

      {/* Central Hero AI Core in Floating Object Wrapper */}
      <FloatingObject position={[0, 0.5, 0]} speed={1.8} floatIntensity={0.3} rotationSpeed={0.5}>
        <HoverableObject
          hoverScale={1.25}
          tooltipText="TrendFlow AI Optimization Engine"
          tooltipSubtext="MILP Solver Active • 60 FPS Digital Twin"
          onClick={() => setSelectedNode(showcaseNodes[0])}
        >
          <mesh>
            <dodecahedronGeometry args={[0.85, 0]} />
            <meshStandardMaterial
              color={isLight ? '#0284C7' : '#06B6D4'}
              emissive={isLight ? '#0369A1' : '#0891B2'}
              emissiveIntensity={isLight ? 0.6 : 1.4}
              roughness={0.15}
              metalness={0.85}
              wireframe={false}
            />
          </mesh>
        </HoverableObject>

        {/* Orbiting Satellites Around Central Hub */}
        <OrbitingObject radiusX={2.4} radiusZ={2.4} speed={1.4} tiltAngle={0.25}>
          <mesh>
            <octahedronGeometry args={[0.16, 0]} />
            <meshBasicMaterial color="#38BDF8" />
          </mesh>
        </OrbitingObject>

        <OrbitingObject radiusX={3.2} radiusZ={3.2} speed={-1.0} tiltAngle={-0.35}>
          <mesh>
            <sphereGeometry args={[0.12, 16, 16]} />
            <meshBasicMaterial color="#6366F1" />
          </mesh>
        </OrbitingObject>

        {/* Radar Pulse Wave */}
        <PulseEffect position={[0, -0.3, 0]} maxRadius={3.8} speed={1.2} />
      </FloatingObject>

      {/* Connection Arcs with Traveling Photon Packets */}
      <ConnectionLine
        start={showcaseNodes[1].position}
        end={[0, 0.5, 0]}
        packetCount={2}
        speed={1.5}
        color={isLight ? '#0284C7' : '#06B6D4'}
      />
      <ConnectionLine
        start={showcaseNodes[2].position}
        end={[0, 0.5, 0]}
        packetCount={1}
        speed={0.8}
        color="#F59E0B"
      />
      <ConnectionLine
        start={[0, 0.5, 0]}
        end={showcaseNodes[3].position}
        packetCount={2}
        speed={1.6}
        color={isLight ? '#4F46E5' : '#6366F1'}
      />
      <ConnectionLine
        start={[0, 0.5, 0]}
        end={showcaseNodes[4].position}
        packetCount={2}
        speed={1.8}
        color="#16A34A"
      />

      {/* Outer Nodes */}
      {showcaseNodes.slice(1).map((node) => (
        <GlowingNode
          key={node.id}
          node={node}
          isSelected={selectedNode?.id === node.id}
          onSelect={(n) => setSelectedNode(n)}
        />
      ))}
    </>
  );
};
