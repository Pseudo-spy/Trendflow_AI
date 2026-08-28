import React, { useRef, useState, type ReactNode } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

interface HoverableObjectProps {
  children: ReactNode;
  hoverScale?: number;
  tooltipText?: string;
  tooltipSubtext?: string;
  onClick?: () => void;
  onHoverChange?: (hovered: boolean) => void;
  position?: [number, number, number];
}

export const HoverableObject: React.FC<HoverableObjectProps> = ({
  children,
  hoverScale = 1.08,
  tooltipText,
  tooltipSubtext,
  onClick,
  onHoverChange,
  position = [0, 0, 0],
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((_state, delta) => {
    if (!groupRef.current) return;
    const targetScale = hovered ? hoverScale : 1.0;
    groupRef.current.scale.lerp(
      new THREE.Vector3(targetScale, targetScale, targetScale),
      delta * 8
    );
  });

  const handlePointerOver = (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    setHovered(true);
    document.body.style.cursor = 'pointer';
    onHoverChange?.(true);
  };

  const handlePointerOut = () => {
    setHovered(false);
    document.body.style.cursor = 'auto';
    onHoverChange?.(false);
  };

  return (
    <group
      ref={groupRef}
      position={position}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
    >
      {children}

      {/* Solid tooltip on hover — no glow */}
      {hovered && tooltipText && (
        <Html position={[0, 1.0, 0]} center distanceFactor={14} style={{ pointerEvents: 'none' }}>
          <div
            style={{
              background: '#07120C',
              border: '1px solid #16241C',
              borderRadius: '6px',
              padding: '4px 10px',
              whiteSpace: 'nowrap',
              color: '#F0FDF4',
              fontSize: '11px',
              fontWeight: 600,
              boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
            }}
          >
            <div>{tooltipText}</div>
            {tooltipSubtext && (
              <div style={{ color: '#86A795', fontSize: '9px', marginTop: '2px' }}>
                {tooltipSubtext}
              </div>
            )}
          </div>
        </Html>
      )}
    </group>
  );
};
