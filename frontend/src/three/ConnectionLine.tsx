import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { QuadraticBezierLine } from '@react-three/drei';
import * as THREE from 'three';
import { useTheme } from '../hooks/useTheme';

interface ConnectionLineProps {
  start: [number, number, number];
  end: [number, number, number];
  color?: string;
  speed?: number;
  heightOffset?: number;
  packetCount?: number;
  lineWidth?: number;
}

export const ConnectionLine: React.FC<ConnectionLineProps> = ({
  start,
  end,
  color,
  speed = 0.35,
  heightOffset = 1.8,
  packetCount = 1,
  lineWidth = 1.2,
}) => {
  const { mode } = useTheme();
  const isLight = mode === 'light';

  const defaultColor = isLight ? '#15803D' : '#16A34A';
  const effectiveColor = color || defaultColor;

  const packetsRef = useRef<(THREE.Mesh | null)[]>([]);

  const { curve, midPoint } = useMemo(() => {
    const vStart = new THREE.Vector3(...start);
    const vEnd = new THREE.Vector3(...end);
    const mid = new THREE.Vector3().addVectors(vStart, vEnd).multiplyScalar(0.5);

    const distance = vStart.distanceTo(vEnd);
    mid.y += Math.max(heightOffset, distance * 0.25);

    const qCurve = new THREE.QuadraticBezierCurve3(vStart, mid, vEnd);
    return { curve: qCurve, midPoint: [mid.x, mid.y, mid.z] as [number, number, number] };
  }, [start, end, heightOffset]);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime() * speed * 0.25;
    for (let i = 0; i < packetCount; i++) {
      const mesh = packetsRef.current[i];
      if (!mesh) continue;
      const offset = (time + i / packetCount) % 1;
      const pos = curve.getPoint(offset);
      mesh.position.copy(pos);
    }
  });

  return (
    <group>
      {/* 3D Curved Arc Line */}
      <QuadraticBezierLine
        start={start}
        end={end}
        mid={midPoint}
        color={effectiveColor}
        lineWidth={lineWidth}
        transparent
        opacity={isLight ? 0.35 : 0.2}
      />

      {/* Traveling Data Packets */}
      {Array.from({ length: packetCount }).map((_, idx) => (
        <mesh
          key={idx}
          ref={(el) => {
            packetsRef.current[idx] = el;
          }}
        >
          <sphereGeometry args={[0.06, 12, 12]} />
          <meshBasicMaterial
            color={isLight ? '#047857' : '#FFFFFF'}
            transparent
            opacity={0.7}
          />
        </mesh>
      ))}
    </group>
  );
};
