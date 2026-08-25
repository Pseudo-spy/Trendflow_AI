import React, { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useTheme } from '../hooks/useTheme';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { useReducedMotion } from 'framer-motion';

interface CameraRigProps {
  basePosition?: [number, number, number];
  intensity?: number;
  damping?: number;
}

export const CameraRig: React.FC<CameraRigProps> = ({
  basePosition = [0, 6, 18],
  intensity = 0.15,
  damping = 0.05,
}) => {
  const { camera, pointer } = useThree();
  const { cameraParallax } = useTheme();
  const isMobile = useMediaQuery('(max-width: 768px)');
  const prefersReducedMotion = useReducedMotion();
  const shouldParallax = cameraParallax && !isMobile && !prefersReducedMotion;
  
  const targetVec = useRef(new THREE.Vector3(...basePosition));

  useFrame(() => {
    if (!shouldParallax) {
      camera.position.lerp(new THREE.Vector3(...basePosition), damping);
      camera.lookAt(0, 0, 0);
      return;
    }

    // Smooth parallax calculation based on pointer [-1 to 1]
    const targetX = basePosition[0] + pointer.x * intensity * 2.5;
    const targetY = basePosition[1] + pointer.y * intensity * 1.5;
    const targetZ = basePosition[2];

    targetVec.current.set(targetX, targetY, targetZ);
    camera.position.lerp(targetVec.current, damping);
    camera.lookAt(0, 0, 0);
  });

  return null;
};
