import React, { useMemo } from 'react';
import {
  FloatingObject,
  HoverableObject,
  GlowingNode,
  ConnectionLine,
  DataParticle,
  PulseEffect,
  HologramGrid,
} from '../three';
import { useTheme } from '../hooks/useTheme';
import type { OptimizationResponse } from '../services/api/procurementApi';
import type { Procurement3DSupplier } from '../components/procurement/ProcurementHero';
import type { SupplyChainNodeData } from '../types/three';

interface ProcurementAllocation3DProps {
  suppliers: Procurement3DSupplier[];
  result: OptimizationResponse | null;
  selectedSupplierId: string | null;
  onSelectSupplier: (id: string | null) => void;
}

export const ProcurementAllocation3D: React.FC<ProcurementAllocation3DProps> = ({
  suppliers,
  result,
  selectedSupplierId,
  onSelectSupplier,
}) => {
  const { mode } = useTheme();
  const isLight = mode === 'light';

  // Helper to determine the visual packet count (thickness) based on percentage
  const getPacketCount = (percentage: number) => {
    return Math.max(1, Math.ceil(percentage / 15)); // roughly 1 to 6 packets max
  };

  // Helper to determine flow speed based on percentage
  const getSpeed = (percentage: number) => {
    return 1.2 + (percentage / 100) * 0.8; // 1.2x to 2.0x
  };

  const getLineColor = (percentage: number) => {
    if (percentage > 30) return isLight ? '#0284C7' : '#06B6D4';
    if (percentage > 15) return '#16A34A';
    if (percentage > 5) return '#F59E0B';
    return isLight ? '#4F46E5' : '#6366F1';
  };

  // Distinct color palette for up to 8 suppliers
  const distinctColors = [
    { primary: '#10B981', glow: 'rgba(16, 185, 129, 0.5)', emissiveDark: '#059669', emissiveLight: '#10B981' }, // Emerald
    { primary: '#8B5CF6', glow: 'rgba(139, 92, 246, 0.5)', emissiveDark: '#6D28D9', emissiveLight: '#8B5CF6' }, // Violet
    { primary: '#F59E0B', glow: 'rgba(245, 158, 11, 0.5)', emissiveDark: '#B45309', emissiveLight: '#F59E0B' }, // Amber
    { primary: '#EC4899', glow: 'rgba(236, 72, 153, 0.5)', emissiveDark: '#BE185D', emissiveLight: '#EC4899' }, // Pink
    { primary: '#0EA5E9', glow: 'rgba(14, 165, 233, 0.5)', emissiveDark: '#0369A1', emissiveLight: '#0EA5E9' }, // Sky
    { primary: '#F43F5E', glow: 'rgba(244, 63, 94, 0.5)', emissiveDark: '#BE123C', emissiveLight: '#F43F5E' }, // Rose
    { primary: '#14B8A6', glow: 'rgba(20, 184, 166, 0.5)', emissiveDark: '#0F766E', emissiveLight: '#14B8A6' }, // Teal
    { primary: '#F97316', glow: 'rgba(249, 115, 22, 0.5)', emissiveDark: '#C2410C', emissiveLight: '#F97316' }, // Orange
  ];

  // Derive visual-only nodes for the shared GlowingNode component
  // without exposing fake business data to the rest of the application.
  const visualNodes = useMemo(() => {
    return suppliers.map((supp, index): SupplyChainNodeData => {
      // VISUAL COLOR ONLY thresholding for GlowingNode component
      const visualStatus = supp.riskScore <= 0.20 ? 'optimal' : supp.riskScore <= 0.50 ? 'warning' : 'critical';
      const nodeColor = distinctColors[index % distinctColors.length];
      
      return {
        id: supp.supplierId,
        name: supp.supplierId,
        type: 'supplier',
        position: supp.position,
        status: visualStatus,
        customColor: nodeColor,
        
        // Blanking out unused fields so they don't render fake data
        capacity: 0,
        throughput: 0,
        leadTimeDays: 0,
        riskScore: 0,
        city: '',
        country: '',
      };
    });
  }, [suppliers]);

  return (
    <>
      {/* Coordinate Floor Grid */}
      <HologramGrid size={36} divisions={36} />

      {/* Ambient Data Particles */}
      <DataParticle count={220} radius={18} speed={0.25} />

      {/* Central Order Allocation Hub */}
      <FloatingObject position={[0, 0, 0]} speed={1.2} floatIntensity={0.15} rotationSpeed={0.3}>
        <HoverableObject
          hoverScale={1.2}
          tooltipText={result ? "PROCUREMENT ALLOCATION HUB" : "AWAITING ALLOCATION"}
          tooltipSubtext={result ? `${result.total_allocated.toLocaleString()} Units Allocated • ${result.total_cost.toLocaleString()} Cost` : "Run Procurement to visualize"}
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
      {suppliers.map((supp) => {
        const percentage = supp.percentage;
        const isSelected = selectedSupplierId === supp.supplierId;
        
        return (
          <ConnectionLine
            key={`line-${supp.supplierId}`}
            start={[0, 0, 0]}
            end={supp.position}
            packetCount={isSelected ? getPacketCount(percentage) + 1 : getPacketCount(percentage)}
            speed={isSelected ? getSpeed(percentage) + 0.5 : getSpeed(percentage)}
            color={getLineColor(percentage)}
          />
        );
      })}

      {/* Render Dynamic Supplier 3D Nodes */}
      {visualNodes.map((vNode, index) => {
        const isSelected = selectedSupplierId === vNode.id;

        return (
          <FloatingObject
            key={vNode.id}
            position={[0, 0, 0]}
            speed={1.1 + (index % 3) * 0.25}
            floatIntensity={0.12}
            rotationSpeed={0.12}
          >
            <GlowingNode
              node={vNode}
              isSelected={isSelected}
              onSelect={(s) => onSelectSupplier(s?.id || null)}
            />
          </FloatingObject>
        );
      })}
    </>
  );
};
