import React from 'react';
import {
  FloatingObject,
  HoverableObject,
  GlowingNode,
  ConnectionLine,
  DataParticle,
  HologramGrid,
} from '../three';
import type { SupplyChainNodeData } from '../types/three';
import { useTheme } from '../hooks/useTheme';

import { controlTowerNodes } from './mock3DData';

interface ControlTowerHero3DProps {
  selectedNode: SupplyChainNodeData | null;
  hoveredNode: SupplyChainNodeData | null;
  onSelectNode: (node: SupplyChainNodeData | null) => void;
}

export const ControlTowerHero3D: React.FC<ControlTowerHero3DProps> = ({
  selectedNode,
  hoveredNode,
  onSelectNode,
}) => {
  const { mode } = useTheme();
  const isLight = mode === 'light';
  const activeNodeId = hoveredNode?.id || selectedNode?.id;

  return (
    <>
      {/* 3D Grid Floor */}
      <HologramGrid size={44} divisions={44} />

      {/* Very sparse ambient particles */}
      <DataParticle count={30} radius={22} speed={0.03} />

      {/* Central Core — minimal motion, no orbiting satellites, no pulse */}
      <FloatingObject position={[0, 0.4, 0]} speed={0.4} floatIntensity={0.04} rotationSpeed={0.02}>
        <HoverableObject
          hoverScale={1.08}
          tooltipText="TRENDFLOW AI COMMAND CORE"
          tooltipSubtext="Autonomous S&OP & MILP Allocation Engine"
          onClick={() => onSelectNode(null)}
        >
          {/* Outer Wireframe Icosahedron */}
          <mesh>
            <icosahedronGeometry args={[1.15, 1]} />
            <meshStandardMaterial
              color={isLight ? '#15803D' : '#16A34A'}
              emissive={isLight ? '#047857' : '#15803D'}
              emissiveIntensity={isLight ? 0.3 : 0.5}
              roughness={0.3}
              metalness={0.7}
              wireframe={true}
            />
          </mesh>

          {/* Inner Core Sphere */}
          <mesh>
            <sphereGeometry args={[0.7, 32, 32]} />
            <meshStandardMaterial
              color={isLight ? '#047857' : '#15803D'}
              emissive={isLight ? '#064E3B' : '#047857'}
              emissiveIntensity={isLight ? 0.4 : 0.6}
              roughness={0.2}
              metalness={0.8}
            />
          </mesh>
        </HoverableObject>
      </FloatingObject>

      {/* 1→2 */}
      <ConnectionLine
        start={controlTowerNodes[0].position}
        end={controlTowerNodes[1].position}
        packetCount={1}
        speed={activeNodeId === 'node-demand' || activeNodeId === 'node-forecast' ? 0.6 : 0.35}
        color="#06B6D4" // Demand Cyan
      />
      {/* 2→3 */}
      <ConnectionLine
        start={controlTowerNodes[1].position}
        end={controlTowerNodes[2].position}
        packetCount={1}
        speed={activeNodeId === 'node-forecast' || activeNodeId === 'node-sop' ? 0.6 : 0.35}
        color="#3B82F6" // Forecast Blue
      />
      {/* 3→4 */}
      <ConnectionLine
        start={controlTowerNodes[2].position}
        end={controlTowerNodes[3].position}
        packetCount={1}
        speed={activeNodeId === 'node-sop' || activeNodeId === 'node-inventory' ? 0.6 : 0.35}
        color="#22C55E" // S&OP Green
      />
      {/* 4→5 */}
      <ConnectionLine
        start={controlTowerNodes[3].position}
        end={controlTowerNodes[4].position}
        packetCount={1}
        speed={activeNodeId === 'node-inventory' || activeNodeId === 'node-production' ? 0.6 : 0.35}
        color="#14B8A6" // Inventory Teal
      />
      {/* 5→6 */}
      <ConnectionLine
        start={controlTowerNodes[4].position}
        end={controlTowerNodes[5].position}
        packetCount={1}
        speed={activeNodeId === 'node-production' || activeNodeId === 'node-materials' ? 0.6 : 0.35}
        color="#A855F7" // Production Purple
      />
      {/* 6→7 */}
      <ConnectionLine
        start={controlTowerNodes[5].position}
        end={controlTowerNodes[6].position}
        packetCount={1}
        speed={activeNodeId === 'node-materials' || activeNodeId === 'node-suppliers' ? 0.6 : 0.35}
        color="#8B5CF6" // Materials Violet
      />
      {/* 7→8 */}
      <ConnectionLine
        start={controlTowerNodes[6].position}
        end={controlTowerNodes[7].position}
        packetCount={1}
        speed={activeNodeId === 'node-suppliers' || activeNodeId === 'node-procurement' ? 0.6 : 0.35}
        color="#F97316" // Suppliers Orange
      />
      {/* 8→9 */}
      <ConnectionLine
        start={controlTowerNodes[7].position}
        end={controlTowerNodes[8].position}
        packetCount={1}
        speed={activeNodeId === 'node-procurement' || activeNodeId === 'node-risk' ? 0.6 : 0.35}
        color="#10B981" // Procurement Emerald
      />
      {/* 9→1 (Closed Loop) */}
      <ConnectionLine
        start={controlTowerNodes[8].position}
        end={controlTowerNodes[0].position}
        packetCount={1}
        speed={activeNodeId === 'node-risk' || activeNodeId === 'node-demand' ? 0.6 : 0.35}
        color="#EF4444" // Risk Red
      />

      {/* Render all 9 Pipeline Nodes — minimal float */}
      {controlTowerNodes.map((node) => {
        const isSelected = selectedNode?.id === node.id;
        const isHovered = hoveredNode?.id === node.id;

        return (
          <FloatingObject
            key={node.id}
            position={[0, 0, 0]}
            speed={0.4}
            floatIntensity={0.03}
            rotationSpeed={0.02}
          >
            <GlowingNode
              node={node}
              isSelected={isSelected || isHovered}
              onSelect={(n) => onSelectNode(n)}
            />
          </FloatingObject>
        );
      })}
    </>
  );
};
