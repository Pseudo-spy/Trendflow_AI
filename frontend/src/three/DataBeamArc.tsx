import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { QuadraticBezierLine } from '@react-three/drei';
import * as THREE from 'three';

interface DataBeamArcProps {
  start: [number, number, number];
  end: [number, number, number];
  color?: string;
  speed?: number;
  heightOffset?: number;
}

export const DataBeamArc: React.FC<DataBeamArcProps> = ({
  start,
  end,
  color = '#16A34A',
  speed = 0.4,
  heightOffset = 1.8,
}) => {
  const particleRef = useRef<THREE.Mesh>(null);

  const { curve, midPoint } = useMemo(() => {
    const vStart = new THREE.Vector3(...start);
    const vEnd = new THREE.Vector3(...end);
    const mid = new THREE.Vector3().addVectors(vStart, vEnd).multiplyScalar(0.5);
    
    // Elevate middle point for curved parabolic trajectory
    const distance = vStart.distanceTo(vEnd);
    mid.y += Math.max(heightOffset, distance * 0.25);

    const qCurve = new THREE.QuadraticBezierCurve3(vStart, mid, vEnd);

    return { curve: qCurve, midPoint: [mid.x, mid.y, mid.z] as [number, number, number] };
  }, [start, end, heightOffset]);

  useFrame(({ clock }) => {
    if (!particleRef.current) return;
    const t = (clock.getElapsedTime() * speed * 0.3) % 1;
    const position = curve.getPoint(t);
    particleRef.current.position.copy(position);
  });

  return (
    <group>
      {/* 3D Curved Arc Line */}
      <QuadraticBezierLine
        start={start}
        end={end}
        mid={midPoint}
        color={color}
        lineWidth={1.2}
        transparent
        opacity={0.25}
      />

      {/* Traveling Data Packet */}
      <mesh ref={particleRef}>
        <sphereGeometry args={[0.07, 16, 16]} />
        <meshBasicMaterial
          color="#FFFFFF"
          transparent
          opacity={0.7}
        />
      </mesh>
    </group>
  );
};
