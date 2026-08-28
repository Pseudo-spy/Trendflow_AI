import React, { useRef, type ReactNode } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useReducedMotion } from 'framer-motion';

interface OrbitingObjectProps {
  children?: ReactNode;
  center?: [number, number, number];
  radiusX?: number;
  radiusZ?: number;
  speed?: number;
  tiltAngle?: number;
  orbitLine?: boolean;
  orbitLineColor?: string;
}

export const OrbitingObject: React.FC<OrbitingObjectProps> = ({
  children,
  center = [0, 0, 0],
  radiusX = 2.5,
  radiusZ = 2.5,
  speed = 0.05,
  tiltAngle = 0.2,
  orbitLine = true,
  orbitLineColor = 'rgba(16, 185, 129, 0.15)',
}) => {
  const prefersReducedMotion = useReducedMotion();
  const satelliteRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!satelliteRef.current) return;
    
    // Stop continuous animation if user prefers reduced motion
    if (prefersReducedMotion) {
      // Position statically based on an initial time = 0
      const staticT = 0;
      const x = center[0] + Math.cos(staticT) * radiusX;
      const z = center[2] + Math.sin(staticT) * radiusZ;
      const y = center[1] + Math.sin(staticT) * radiusZ * Math.sin(tiltAngle);
      satelliteRef.current.position.set(x, y, z);
      return;
    }

    const t = clock.getElapsedTime() * speed * 0.2;

    const x = center[0] + Math.cos(t) * radiusX;
    const z = center[2] + Math.sin(t) * radiusZ;
    const y = center[1] + Math.sin(t) * radiusZ * Math.sin(tiltAngle);

    satelliteRef.current.position.set(x, y, z);
    satelliteRef.current.rotation.y += 0.001;
  });

  return (
    <group>
      {/* Visual Orbit Track Line */}
      {orbitLine && (
        <mesh position={center} rotation={[Math.PI / 2 + tiltAngle, 0, 0]}>
          <ringGeometry args={[radiusX - 0.015, radiusX + 0.015, 64]} />
          <meshBasicMaterial
            color={orbitLineColor}
            transparent
            opacity={0.15}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}

      {/* Orbiting Satellite Node Group */}
      <group ref={satelliteRef}>
        {children || (
          <mesh>
            <sphereGeometry args={[0.12, 16, 16]} />
            <meshStandardMaterial
              color="#16A34A"
              emissive="#15803D"
              emissiveIntensity={0.5}
              roughness={0.3}
            />
          </mesh>
        )}
      </group>
    </group>
  );
};
