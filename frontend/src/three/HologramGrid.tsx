import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useTheme } from '../hooks/useTheme';
import { useReducedMotion } from 'framer-motion';

interface HologramGridProps {
  size?: number;
  divisions?: number;
}

export const HologramGrid: React.FC<HologramGridProps> = ({
  size = 40,
  divisions = 40,
}) => {
  const { theme3D, mode } = useTheme();
  const isLight = mode === 'light';

  const groupRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  const prefersReducedMotion = useReducedMotion();

  useFrame((_state, delta) => {
    if (ringRef.current && !prefersReducedMotion) {
      ringRef.current.rotation.z += delta * 0.008;
    }
  });

  return (
    <group ref={groupRef} position={[0, -2.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      {/* Dynamic Grid Floor */}
      <gridHelper
        args={[size, divisions, theme3D.gridPrimary, theme3D.gridSecondary]}
        rotation={[Math.PI / 2, 0, 0]}
      />

      {/* Radar Concentric Rings */}
      <mesh ref={ringRef} position={[0, 0, 0.02]}>
        <ringGeometry args={[6, 6.05, 64]} />
        <meshBasicMaterial
          color={theme3D.gridPrimary}
          transparent
          opacity={isLight ? 0.2 : 0.35}
          side={THREE.DoubleSide}
        />
      </mesh>

      <mesh position={[0, 0, 0.01]}>
        <ringGeometry args={[12, 12.06, 64]} />
        <meshBasicMaterial
          color={isLight ? '#4F46E5' : '#6366F1'}
          transparent
          opacity={isLight ? 0.15 : 0.2}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
};
