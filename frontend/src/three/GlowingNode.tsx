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

  const colors = statusColorPalette[node.status] || statusColorPalette.optimal;
  const emissiveColor = isLight ? colors.emissiveLight : colors.emissiveDark;

  useFrame((_state, delta) => {
    if (ringRef.current) {
      // Very slow rotation
      ringRef.current.rotation.z += delta * 0.03;
      ringRef.current.rotation.x += delta * 0.01;
      // Very subtle pulse
      const pulse = 1 + Math.sin(Date.now() * 0.001) * 0.015;
      ringRef.current.scale.set(pulse, pulse, pulse);
    }

    if (meshRef.current) {
      const targetScale = hovered || isSelected ? 1.12 : 1.0;
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), delta * 6);
    }
  });

  return (
    <group position={node.position}>
      {/* Subtle pulse only on warning/selected nodes */}
      {(showPulse && (node.status === 'warning' || isSelected)) && (
        <PulseEffect position={[0, -0.2, 0]} color={colors.primary} maxRadius={1.5} speed={0.1} />
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
          <octahedronGeometry args={[0.5, 0]} />
        ) : node.type === 'warehouse' ? (
          <boxGeometry args={[0.7, 0.7, 0.7]} />
        ) : (
          <sphereGeometry args={[0.45, 32, 32]} />
        )}

        <meshStandardMaterial
          color={colors.primary}
          emissive={emissiveColor}
          emissiveIntensity={(hovered || isSelected ? 0.9 : 0.4) * theme3D.nodeEmissiveMultiplier}
          roughness={isLight ? 0.4 : 0.3}
          metalness={isLight ? 0.4 : 0.7}
        />
      </mesh>

      {/* Subtle Halo Ring */}
      <mesh ref={ringRef}>
        <torusGeometry args={[0.75, 0.015, 16, 64]} />
        <meshBasicMaterial
          color={colors.primary}
          transparent
          opacity={hovered || isSelected ? 0.5 : isLight ? 0.15 : 0.2}
        />
      </mesh>

      {/* Node Annotation Tag */}
      <Html
        position={[0, 0.85, 0]}
        center
        distanceFactor={15}
        style={{ pointerEvents: 'none', transition: 'opacity 0.2s ease' }}
      >
        <div
          style={{
            background: isLight ? 'rgba(255, 255, 255, 0.95)' : '#07120C',
            border: `1px solid ${hovered || isSelected ? colors.primary : isLight ? '#D1FAE5' : '#16241C'}`,
            borderRadius: '6px',
            padding: '3px 8px',
            whiteSpace: 'nowrap',
            fontSize: '11px',
            fontWeight: 600,
            color: isLight ? '#064E3B' : '#F0FDF4',
            boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <span
            style={{
              width: '5px',
              height: '5px',
              borderRadius: '50%',
              backgroundColor: colors.primary,
            }}
          />
          <span>{node.name}</span>
          <span
            style={{
              color: isLight ? '#64748B' : '#86A795',
              fontSize: '9px',
              fontFamily: "'JetBrains Mono', monospace",
            }}
          >
            {node.city}
          </span>
        </div>
      </Html>
    </group>
  );
};
