import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useTheme } from '../hooks/useTheme';

interface DataParticleStreamProps {
  count?: number;
  color?: string;
  size?: number;
  speed?: number;
  radius?: number;
}

export const DataParticle: React.FC<DataParticleStreamProps> = ({
  count = 20,
  color,
  size = 0.04,
  speed = 0.02,
  radius = 12,
}) => {
  const { mode } = useTheme();
  const isLight = mode === 'light';

  const defaultColor = isLight ? '#15803D' : '#16A34A';
  const effectiveColor = color || defaultColor;

  const pointsRef = useRef<THREE.Points>(null);

  const { positions, velocities } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * radius * 2;
      pos[i * 3 + 1] = (Math.random() - 0.5) * (radius * 0.6);
      pos[i * 3 + 2] = (Math.random() - 0.5) * radius * 2;

      vel[i * 3] = (Math.random() - 0.5) * 0.005 * speed;
      vel[i * 3 + 1] = (Math.random() - 0.5) * 0.003 * speed;
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.005 * speed;
    }

    return { positions: pos, velocities: vel };
  }, [count, radius, speed]);

  useFrame((_state, delta) => {
    if (!pointsRef.current) return;
    pointsRef.current.rotation.y += delta * 0.005 * speed;

    const geo = pointsRef.current.geometry;
    const posAttr = geo.attributes.position as THREE.BufferAttribute;
    const array = posAttr.array as Float32Array;

    for (let i = 0; i < count; i++) {
      array[i * 3] += velocities[i * 3];
      array[i * 3 + 1] += velocities[i * 3 + 1];
      array[i * 3 + 2] += velocities[i * 3 + 2];

      if (Math.abs(array[i * 3]) > radius) array[i * 3] *= -0.95;
      if (Math.abs(array[i * 3 + 1]) > radius * 0.4) array[i * 3 + 1] *= -0.95;
      if (Math.abs(array[i * 3 + 2]) > radius) array[i * 3 + 2] *= -0.95;
    }

    posAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={size}
        color={effectiveColor}
        transparent
        opacity={isLight ? 0.2 : 0.25}
        depthWrite={false}
      />
    </points>
  );
};
