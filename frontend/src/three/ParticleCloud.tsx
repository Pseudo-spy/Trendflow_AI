import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { ParticleConfig } from '../types/three';

export const ParticleCloud: React.FC<ParticleConfig> = ({
  count = 30,
  spread = 30,
  color = '#16A34A',
  size = 0.04,
  speed = 0.015,
}) => {
  const pointsRef = useRef<THREE.Points>(null);

  const { positions, velocities } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * spread;
      pos[i * 3 + 1] = (Math.random() - 0.5) * spread;
      pos[i * 3 + 2] = (Math.random() - 0.5) * spread;

      vel[i * 3] = (Math.random() - 0.5) * 0.005 * speed;
      vel[i * 3 + 1] = (Math.random() - 0.5) * 0.005 * speed;
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.005 * speed;
    }

    return { positions: pos, velocities: vel };
  }, [count, spread, speed]);

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

      const halfSpread = spread / 2;
      if (Math.abs(array[i * 3]) > halfSpread) array[i * 3] *= -0.95;
      if (Math.abs(array[i * 3 + 1]) > halfSpread) array[i * 3 + 1] *= -0.95;
      if (Math.abs(array[i * 3 + 2]) > halfSpread) array[i * 3 + 2] *= -0.95;
    }

    posAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={size}
        color={color}
        transparent
        opacity={0.3}
        depthWrite={false}
      />
    </points>
  );
};
