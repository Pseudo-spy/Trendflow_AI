import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
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

  const nodeRefs = useRef<Record<string, React.MutableRefObject<THREE.Group | null>>>({});
  if (Object.keys(nodeRefs.current).length === 0) {
    controlTowerNodes.forEach(node => {
      nodeRefs.current[node.id] = { current: null };
    });
  }

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    controlTowerNodes.forEach((node, i) => {
      const ref = nodeRefs.current[node.id];
      if (ref && ref.current) {
        // Highly obvious single elliptical orbit for all 9 nodes to avoid overlapping
        const speed = 0.10;
        const radiusX = 10.0;
        const radiusZ = 3.5;

        const totalNodes = controlTowerNodes.length; // 9
        const baseAngle = (i / totalNodes) * Math.PI * 2;
        const angle = baseAngle + t * speed;

        // Base planar elliptical position
        const x = Math.cos(angle) * radiusX;
        const z = Math.sin(angle) * radiusZ;

        // Tilt the orbit plane dramatically on the Z axis and add a small sine wave for visual interest
        const yTilt = z * 0.35; // Nodes further back go much lower, front go much higher
        const yWave = Math.sin(angle * 4) * 0.25;
        const targetY = yTilt + yWave;

        ref.current.position.set(x, targetY, z);

        // Depth-based scaling: node gets larger as it moves closer to the camera (+Z)
        const normalizedZ = (z + radiusZ) / (2 * radiusZ);
        const minScale = 0.90;
        const maxScale = 1.20;
        const targetScale = THREE.MathUtils.lerp(minScale, maxScale, normalizedZ);

        // Smoothly interpolate the scale
        ref.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
      }
    });
  });

  return (
    <>
      {/* 3D Grid Floor */}
      <HologramGrid size={44} divisions={44} />

      {/* Very sparse ambient particles */}
      <DataParticle count={30} radius={22} speed={0.03} />

      {/* Central Core — elevated above the operational network */}
      <FloatingObject position={[0, 4.5, 0]} speed={0.8} floatIntensity={0.12} rotationSpeed={0.02}>
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

      {/* Render all 9 Pipeline Nodes — with orbiting positions */}
      {controlTowerNodes.map((node) => {
        const isSelected = selectedNode?.id === node.id;
        const isHovered = hoveredNode?.id === node.id;

        // Ensure the inner glowing node is zeroed out, so our animated wrapper controls absolute world position
        const centeredNode = { ...node, position: [0, 0, 0] as [number, number, number] };

        return (
          <group key={node.id} ref={nodeRefs.current[node.id]} position={node.position}>
            <FloatingObject
              position={[0, 0, 0]}
              speed={0.4}
              floatIntensity={0.03}
              rotationSpeed={0.02}
            >
              <group scale={1.10}>
                <GlowingNode
                  node={centeredNode}
                  isSelected={isSelected || isHovered}
                  onSelect={() => onSelectNode(node)}
                />
              </group>
            </FloatingObject>
          </group>
        );
      })}
    </>
  );
};
