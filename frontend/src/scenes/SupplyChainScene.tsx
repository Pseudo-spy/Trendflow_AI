import React, { useState } from 'react';
import {
  FloatingObject,
  GlowingNode,
  ConnectionLine,
  DataParticle,
  OrbitingObject,
  HologramGrid,
} from '../three';
import type { SupplyChainNodeData, SupplyChainConnection } from '../types/three';
import { useTheme } from '../hooks/useTheme';

export const sampleSupplyChainNodes: SupplyChainNodeData[] = [
  {
    id: 'node-1',
    name: 'Pacific Mills',
    type: 'supplier',
    position: [-7, 0.5, -4],
    status: 'optimal',
    capacity: 92,
    throughput: 14500,
    leadTimeDays: 8,
    riskScore: 12,
    city: 'Taipei',
    country: 'Taiwan',
  },
  {
    id: 'node-2',
    name: 'SilkRoad Weaving',
    type: 'supplier',
    position: [-8, -0.2, 3],
    status: 'warning',
    capacity: 76,
    throughput: 9200,
    leadTimeDays: 14,
    riskScore: 48,
    city: 'Hanoi',
    country: 'Vietnam',
  },
  {
    id: 'node-3',
    name: 'MegaHub Factory',
    type: 'factory',
    position: [-1, 1.2, 0],
    status: 'optimal',
    capacity: 98,
    throughput: 38000,
    leadTimeDays: 5,
    riskScore: 18,
    city: 'Shenzhen',
    country: 'China',
  },
  {
    id: 'node-4',
    name: 'Euro Logistics Hub',
    type: 'warehouse',
    position: [5, 0.8, -3],
    status: 'simulated',
    capacity: 88,
    throughput: 24000,
    leadTimeDays: 3,
    riskScore: 22,
    city: 'Rotterdam',
    country: 'Netherlands',
  },
  {
    id: 'node-5',
    name: 'Americas Gateway DC',
    type: 'distribution',
    position: [6, -0.4, 4],
    status: 'optimal',
    capacity: 95,
    throughput: 31000,
    leadTimeDays: 4,
    riskScore: 15,
    city: 'Los Angeles',
    country: 'USA',
  },
];

export const sampleConnections: SupplyChainConnection[] = [
  { id: 'conn-1', fromNodeId: 'node-1', toNodeId: 'node-3', flowVolume: 12000, status: 'active', color: '#06B6D4' },
  { id: 'conn-2', fromNodeId: 'node-2', toNodeId: 'node-3', flowVolume: 7800, status: 'delayed', color: '#F59E0B' },
  { id: 'conn-3', fromNodeId: 'node-3', toNodeId: 'node-4', flowVolume: 19000, status: 'optimized', color: '#6366F1' },
  { id: 'conn-4', fromNodeId: 'node-3', toNodeId: 'node-5', flowVolume: 22000, status: 'active', color: '#16A34A' },
];

interface SupplyChainSceneProps {
  nodes?: SupplyChainNodeData[];
  connections?: SupplyChainConnection[];
  selectedNodeId?: string | null;
  onNodeSelect?: (node: SupplyChainNodeData) => void;
}

export const SupplyChainScene: React.FC<SupplyChainSceneProps> = ({
  nodes = sampleSupplyChainNodes,
  connections = sampleConnections,
  selectedNodeId = null,
  onNodeSelect,
}) => {
  const [internalSelectedId, setInternalSelectedId] = useState<string | null>(selectedNodeId);
  const { mode } = useTheme();
  const isLight = mode === 'light';

  const handleSelect = (node: SupplyChainNodeData) => {
    setInternalSelectedId(node.id);
    onNodeSelect?.(node);
  };

  const centerNode = nodes.find((n) => n.type === 'factory') || nodes[2];

  return (
    <>
      <HologramGrid size={34} divisions={34} />
      <DataParticle count={200} radius={18} speed={0.18} />

      {/* Orbiting Satellite on primary factory hub */}
      {centerNode && (
        <OrbitingObject
          center={centerNode.position}
          radiusX={1.8}
          radiusZ={1.8}
          speed={1.5}
          orbitLineColor={isLight ? 'rgba(2, 132, 199, 0.2)' : 'rgba(6, 182, 212, 0.25)'}
        />
      )}

      {/* Render 3D Arcs connecting nodes with active data packets */}
      {connections.map((conn) => {
        const fromNode = nodes.find((n) => n.id === conn.fromNodeId);
        const toNode = nodes.find((n) => n.id === conn.toNodeId);

        if (!fromNode || !toNode) return null;

        return (
          <ConnectionLine
            key={conn.id}
            start={fromNode.position}
            end={toNode.position}
            color={conn.color}
            packetCount={conn.status === 'delayed' ? 1 : 2}
            speed={conn.status === 'delayed' ? 0.6 : 1.4}
          />
        );
      })}

      {/* Render 3D Supply Chain Nodes wrapped in gentle floating */}
      {nodes.map((node, index) => (
        <FloatingObject
          key={node.id}
          position={[0, 0, 0]}
          speed={1.2 + (index % 3) * 0.3}
          floatIntensity={0.08}
          rotationSpeed={0.1}
        >
          <GlowingNode
            node={node}
            isSelected={node.id === (selectedNodeId ?? internalSelectedId)}
            onSelect={handleSelect}
          />
        </FloatingObject>
      ))}
    </>
  );
};
