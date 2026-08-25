import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useTheme } from '../hooks/useTheme';
import { useReducedMotion } from 'framer-motion';

interface PulseEffectProps {
  position?: [number, number, number];
  maxRadius?: number;
  speed?: number;
  color?: string;
}

export const PulseEffect: React.FC<PulseEffectProps> = ({
  position = [0, 0, 0],
  maxRadius = 2.0,
  speed = 0.15,
  color,
}) => {
  const { mode } = useTheme();
  const isLight = mode === 'light';

  const defaultColor = isLight ? '#15803D' : '#16A34A';
  const effectiveColor = color || defaultColor;

  const ringRef1 = useRef<THREE.Mesh>(null);
  const ringRef2 = useRef<THREE.Mesh>(null);

  const prefersReducedMotion = useReducedMotion();

  useFrame(({ clock }) => {
    if (prefersReducedMotion) {
      if (ringRef1.current) {
        ringRef1.current.scale.set(1.5, 1.5, 1);
        (ringRef1.current.material as THREE.MeshBasicMaterial).opacity = 0.05;
      }
      if (ringRef2.current) {
        ringRef2.current.scale.set(2.0, 2.0, 1);
        (ringRef2.current.material as THREE.MeshBasicMaterial).opacity = 0.02;
      }
      return;
    }

    const t = (clock.getElapsedTime() * speed) % 2;

    if (ringRef1.current) {
      const progress1 = (t / 2);
      const scale1 = 0.5 + progress1 * maxRadius;
      ringRef1.current.scale.set(scale1, scale1, 1);
      const mat1 = ringRef1.current.material as THREE.MeshBasicMaterial;
      mat1.opacity = Math.max(0, (1 - progress1) * 0.15);
    }

    if (ringRef2.current) {
      const progress2 = ((t + 1) % 2) / 2;
      const scale2 = 0.5 + progress2 * maxRadius;
      ringRef2.current.scale.set(scale2, scale2, 1);
      const mat2 = ringRef2.current.material as THREE.MeshBasicMaterial;
      mat2.opacity = Math.max(0, (1 - progress2) * 0.15);
    }
  });

  return (
    <group position={position} rotation={[-Math.PI / 2, 0, 0]}>
      {/* Expanding Ring 1 */}
      <mesh ref={ringRef1}>
        <ringGeometry args={[0.9, 0.95, 48]} />
        <meshBasicMaterial
          color={effectiveColor}
          transparent
          opacity={0.2}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Expanding Ring 2 (Staggered) */}
      <mesh ref={ringRef2}>
        <ringGeometry args={[0.9, 0.95, 48]} />
        <meshBasicMaterial
          color={effectiveColor}
          transparent
          opacity={0.2}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
};
