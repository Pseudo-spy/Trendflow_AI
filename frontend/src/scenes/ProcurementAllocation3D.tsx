import React from 'react';
import {
  FloatingObject,
  HoverableObject,
  GlowingNode,
  ConnectionLine,
  DataParticle,
  PulseEffect,
  HologramGrid,
} from '../three';
import type { SupplyChainNodeData } from '../types/three';
import { useTheme } from '../hooks/useTheme';

import { procurementSuppliers } from './mock3DData';

interface ProcurementAllocation3DProps {
  selectedSupplier: SupplyChainNodeData | null;
  onSelectSupplier: (supp: SupplyChainNodeData | null) => void;
}

export const ProcurementAllocation3D: React.FC<ProcurementAllocation3DProps> = ({
  selectedSupplier,
  onSelectSupplier,
}) => {
  const { mode } = useTheme();
  const isLight = mode === 'light';

  return (
    <>
      {/* Coordinate Floor Grid */}
      <HologramGrid size={36} divisions={36} />

      {/* Ambient Data Particles */}
      <DataParticle count={220} radius={18} speed={0.25} />

      {/* Central Order Allocation Hub: 125,000 Units */}
      <FloatingObject position={[0, 0, 0]} speed={1.2} floatIntensity={0.15} rotationSpeed={0.3}>
        <HoverableObject
          hoverScale={1.2}
          tooltipText="OR-TOOLS ORDER DISPATCH HUB"
          tooltipSubtext="125,000 Units Allocated • $2.20M Spend"
          onClick={() => onSelectSupplier(null)}
        >
          <mesh>
            <octahedronGeometry args={[1.0, 0]} />
            <meshStandardMaterial
              color={isLight ? '#0284C7' : '#06B6D4'}
              emissive={isLight ? '#0369A1' : '#0891B2'}
              emissiveIntensity={isLight ? 0.8 : 1.8}
              roughness={0.2}
              metalness={0.8}
              wireframe={true}
            />
          </mesh>
          <mesh>
            <sphereGeometry args={[0.55, 32, 32]} />
            <meshStandardMaterial
              color={isLight ? '#4F46E5' : '#6366F1'}
              emissive={isLight ? '#4338CA' : '#4F46E5'}
              emissiveIntensity={isLight ? 0.9 : 2.0}
            />
          </mesh>
        </HoverableObject>
        <PulseEffect position={[0, -0.2, 0]} maxRadius={4.5} speed={1.0} />
      </FloatingObject>

      {/* Allocation Energy Beams from Central Hub to Each Supplier */}
      {/* Central -> Supplier A (Taipei: 38.4% - Thick 4 packet flow) */}
      <ConnectionLine
        start={[0, 0, 0]}
        end={procurementSuppliers[0].position}
        packetCount={selectedSupplier?.id === 'supp-taipei' ? 5 : 4}
        speed={selectedSupplier?.id === 'supp-taipei' ? 2.8 : 1.8}
        color={isLight ? '#0284C7' : '#06B6D4'}
      />
      {/* Central -> Supplier B (Shenzhen: 28.8% - 3 packet flow) */}
      <ConnectionLine
        start={[0, 0, 0]}
        end={procurementSuppliers[1].position}
        packetCount={selectedSupplier?.id === 'supp-shenzhen' ? 5 : 3}
        speed={selectedSupplier?.id === 'supp-shenzhen' ? 2.8 : 1.6}
        color="#16A34A"
      />
      {/* Central -> Supplier C (Hanoi: 19.2% - 2 packet flow) */}
      <ConnectionLine
        start={[0, 0, 0]}
        end={procurementSuppliers[2].position}
        packetCount={selectedSupplier?.id === 'supp-hanoi' ? 5 : 2}
        speed={selectedSupplier?.id === 'supp-hanoi' ? 2.8 : 1.4}
        color="#F59E0B"
      />
      {/* Central -> Supplier D (Frankfurt: 8.0% - 2 packet flow) */}
      <ConnectionLine
        start={[0, 0, 0]}
        end={procurementSuppliers[3].position}
        packetCount={selectedSupplier?.id === 'supp-frankfurt' ? 5 : 2}
        speed={selectedSupplier?.id === 'supp-frankfurt' ? 2.8 : 1.4}
        color={isLight ? '#4F46E5' : '#6366F1'}
      />
      {/* Central -> Supplier E (Americas: 5.6% - 1 packet flow) */}
      <ConnectionLine
        start={[0, 0, 0]}
        end={procurementSuppliers[4].position}
        packetCount={selectedSupplier?.id === 'supp-americas' ? 5 : 1}
        speed={selectedSupplier?.id === 'supp-americas' ? 2.8 : 1.2}
        color="#06B6D4"
      />

      {/* Render 5 Supplier 3D Nodes */}
      {procurementSuppliers.map((supp, index) => {
        const isSelected = selectedSupplier?.id === supp.id;

        return (
          <FloatingObject
            key={supp.id}
            position={[0, 0, 0]}
            speed={1.1 + (index % 3) * 0.25}
            floatIntensity={0.12}
            rotationSpeed={0.12}
          >
            <GlowingNode
              node={supp}
              isSelected={isSelected}
              onSelect={(s) => onSelectSupplier(s)}
            />
          </FloatingObject>
        );
      })}
    </>
  );
};
