import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { useTheme } from '../hooks/useTheme';
import { PulseEffect } from './PulseEffect';
import type { SupplyChainNodeData } from '../types/three';

interface GlowingNodeProps {
  node: SupplyChainNodeData;
  isSelected?: boolean;
  onSelect?: (node: SupplyChainNodeData) => void;
  showPulse?: boolean;
}

const statusColorPalette: Record<string, { primary: string; glow: string; emissiveDark: string; emissiveLight: string }> = {
  optimal: { primary: '#16A34A', glow: 'rgba(16, 185, 129, 0.25)', emissiveDark: '#15803D', emissiveLight: '#16A34A' },
  warning: { primary: '#F59E0B', glow: 'rgba(245, 158, 11, 0.25)', emissiveDark: '#D97706', emissiveLight: '#F59E0B' },
  critical: { primary: '#F43F5E', glow: 'rgba(244, 63, 94, 0.25)', emissiveDark: '#E11D48', emissiveLight: '#F43F5E' },
  simulated: { primary: '#06B6D4', glow: 'rgba(6, 182, 212, 0.25)', emissiveDark: '#0891B2', emissiveLight: '#06B6D4' },
};

const getNodeColorPalette = (nodeName: string, originalStatusColor: any) => {
  const nameLower = nodeName.toLowerCase();
  if (nameLower.includes('demand')) {
    return { primary: '#06B6D4', glow: 'rgba(6, 182, 212, 0.5)', emissiveDark: '#0891B2', emissiveLight: '#06B6D4' }; // Cyan
  }
  if (nameLower.includes('forecast')) {
    return { primary: '#3B82F6', glow: 'rgba(59, 130, 246, 0.5)', emissiveDark: '#2563EB', emissiveLight: '#3B82F6' }; // Blue
  }
  if (nameLower.includes('s&op') || nameLower.includes('sop')) {
    return { primary: '#22C55E', glow: 'rgba(34, 197, 94, 0.5)', emissiveDark: '#16A34A', emissiveLight: '#22C55E' }; // Green
  }
  if (nameLower.includes('inventory')) {
    return { primary: '#14B8A6', glow: 'rgba(20, 184, 166, 0.5)', emissiveDark: '#0D9488', emissiveLight: '#14B8A6' }; // Teal
  }
  if (nameLower.includes('production') || nameLower.includes('capacity')) {
    return { primary: '#A855F7', glow: 'rgba(168, 85, 247, 0.5)', emissiveDark: '#9333EA', emissiveLight: '#A855F7' }; // Purple
  }
  if (nameLower.includes('procurement')) {
    return { primary: '#10B981', glow: 'rgba(16, 185, 129, 0.5)', emissiveDark: '#059669', emissiveLight: '#10B981' }; // Emerald
  }
  if (nameLower.includes('supplier')) {
    return { primary: '#F97316', glow: 'rgba(249, 115, 22, 0.5)', emissiveDark: '#EA580C', emissiveLight: '#F97316' }; // Orange
  }
  if (nameLower.includes('risk')) {
    return { primary: '#EF4444', glow: 'rgba(239, 68, 68, 0.5)', emissiveDark: '#DC2626', emissiveLight: '#EF4444' }; // Red
  }
  if (nameLower.includes('material')) {
    return { primary: '#EAB308', glow: 'rgba(234, 179, 8, 0.5)', emissiveDark: '#CA8A04', emissiveLight: '#EAB308' }; // Gold/Yellow
  }
  return originalStatusColor;
};

export const GlowingNode: React.FC<GlowingNodeProps> = ({
  node,
  isSelected = false,
  onSelect,
  showPulse = true,
}) => {
  const { mode, theme3D } = useTheme();
  const isLight = mode === 'light';

  const meshRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  const originalColors = statusColorPalette[node.status] || statusColorPalette.optimal;
  const colors = node.customColor || getNodeColorPalette(node.name, originalColors);
  const emissiveColor = isLight ? colors.emissiveLight : colors.emissiveDark;

  useFrame((_state, delta) => {
    if (ringRef.current) {
      ringRef.current.rotation.z += delta * 0.03;
      ringRef.current.rotation.x += delta * 0.01;
      const pulse = 1 + Math.sin(Date.now() * 0.001) * 0.015;
      ringRef.current.scale.set(pulse, pulse, pulse);
    }

    if (meshRef.current) {
      const targetScale = hovered || isSelected ? 1.15 : 1.0;
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), delta * 8);
    }
  });

  const shortName = node.name.replace(/^\d+\.\s*/, '').replace('Material Requirement', 'Materials');
  
  const defaultLabelPos: [number, number, number] = [0, 1.1, 0];
  const labelPos: [number, number, number] = node.labelOffset 
    ? [defaultLabelPos[0] + node.labelOffset[0], defaultLabelPos[1] + node.labelOffset[1], defaultLabelPos[2] + node.labelOffset[2]]
    : defaultLabelPos;

  return (
    <group position={node.position}>
      {/* Subtle pulse only on warning/selected nodes */}
      {(showPulse && (node.status === 'warning' || isSelected || hovered)) && (
        <PulseEffect position={[0, -0.2, 0]} color={colors.primary} maxRadius={hovered ? 2.0 : 1.5} speed={0.12} />
      )}

      {/* Central Core Mesh */}
      <mesh
        ref={meshRef}
        onClick={(e) => {
          e.stopPropagation();
          onSelect?.(node);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = 'auto';
        }}
      >
        {node.type === 'supplier' ? (
          <octahedronGeometry args={[0.55, 0]} />
        ) : node.type === 'warehouse' ? (
          <boxGeometry args={[0.75, 0.75, 0.75]} />
        ) : (
          <sphereGeometry args={[0.5, 32, 32]} />
        )}

        <meshStandardMaterial
          color={colors.primary}
          emissive={emissiveColor}
          emissiveIntensity={(hovered || isSelected ? 1.2 : 0.6) * theme3D.nodeEmissiveMultiplier}
          roughness={isLight ? 0.3 : 0.2}
          metalness={isLight ? 0.5 : 0.8}
        />
      </mesh>

      {/* Subtle Halo Ring */}
      <mesh ref={ringRef}>
        <torusGeometry args={[0.85, 0.02, 16, 64]} />
        <meshBasicMaterial
          color={colors.primary}
          transparent
          opacity={hovered || isSelected ? 0.7 : isLight ? 0.25 : 0.35}
        />
      </mesh>

      {/* Node Annotation Tag */}
      <Html
        position={labelPos}
        center
        distanceFactor={15}
        style={{ pointerEvents: 'none', zIndex: hovered || isSelected ? 20 : 10 }}
      >
        <div
          style={{
            background: isLight ? 'rgba(255, 255, 255, 0.95)' : 'rgba(9, 13, 11, 0.85)',
            backdropFilter: 'blur(8px)',
            border: `1px solid ${hovered || isSelected ? colors.primary : 'rgba(255, 255, 255, 0.1)'}`,
            borderRadius: '8px',
            padding: '6px 14px',
            whiteSpace: 'nowrap',
            fontSize: '12px',
            fontWeight: 700,
            color: isLight ? '#0F172A' : '#F8FAFC',
            boxShadow: hovered || isSelected ? `0 4px 16px ${colors.glow}, 0 0 0 1px ${colors.primary} inset` : '0 4px 12px rgba(0,0,0,0.4)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transform: hovered || isSelected ? 'scale(1.05) translateY(-2px)' : 'scale(1) translateY(0)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          <span
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: colors.primary,
              boxShadow: `0 0 8px ${colors.primary}`,
            }}
          />
          <span>{shortName}</span>
        </div>
      </Html>
    </group>
  );
};
