import React, { useRef, type ReactNode } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useReducedMotion } from 'framer-motion';

interface FloatingObjectProps {
  children: ReactNode;
  position?: [number, number, number];
  speed?: number; // Speed of floating oscillation
  rotationSpeed?: number; // Speed of continuous rotation
  floatIntensity?: number; // Height delta of floating motion
  rotationAxis?: 'y' | 'x' | 'z' | 'all';
}

export const FloatingObject: React.FC<FloatingObjectProps> = ({
  children,
  position = [0, 0, 0],
  speed = 0.3,
  rotationSpeed = 0.02,
  floatIntensity = 0.03,
  rotationAxis = 'y',
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const initialY = position[1];

  const prefersReducedMotion = useReducedMotion();

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    
    // Stop continuous animation if user prefers reduced motion
    if (prefersReducedMotion) {
      groupRef.current.position.y = initialY;
      return;
    }

    const t = clock.getElapsedTime();

    // Very subtle sinusoidal floating
    groupRef.current.position.y = initialY + Math.sin(t * speed) * floatIntensity;

    // Minimal rotation drift
    if (rotationAxis === 'y' || rotationAxis === 'all') {
      groupRef.current.rotation.y += 0.001 * rotationSpeed;
    }
    if (rotationAxis === 'x' || rotationAxis === 'all') {
      groupRef.current.rotation.x = Math.sin(t * 0.3 * speed) * 0.02;
    }
    if (rotationAxis === 'z' || rotationAxis === 'all') {
      groupRef.current.rotation.z = Math.cos(t * 0.3 * speed) * 0.015;
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {children}
    </group>
  );
};
