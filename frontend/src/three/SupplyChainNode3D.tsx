import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useTheme } from '../hooks/useTheme';

export type SupplyChainMeshType =
  | 'factory'
  | 'warehouse'
  | 'supplier'
  | 'materials'
  | 'logistics'
  | 'forecast'
  | 'procurement'
  | 'risk'
  | 'decision';

interface SupplyChainNode3DProps {
  meshType: SupplyChainMeshType;
  status?: 'optimal' | 'warning' | 'critical' | 'simulated';
  color?: string;
  isHovered?: boolean;
}

export const SupplyChainNode3D: React.FC<SupplyChainNode3DProps> = ({
  meshType,
  status = 'optimal',
  color,
  isHovered = false,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const orbitalRef = useRef<THREE.Mesh>(null);
  const { mode } = useTheme();
  const isLight = mode === 'light';

  // Status-driven emissive color mapping
  const statusColors = {
    optimal: '#06B6D4',
    warning: '#F59E0B',
    critical: '#F43F5E',
    simulated: '#6366F1',
  };

  const primaryColor = color || statusColors[status];
  const emissiveIntensity = isHovered ? 1.0 : isLight ? 0.4 : 0.5;

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * (isHovered ? 0.04 : 0.015);
    }
    if (orbitalRef.current) {
      orbitalRef.current.rotation.z += delta * 0.03;
      orbitalRef.current.rotation.x += delta * 0.02;
    }
  });

  return (
    <group ref={groupRef}>
      {/* 1. FACTORY / PRODUCTION PLANT */}
      {meshType === 'factory' && (
        <group>
          {/* Main Factory Building */}
          <mesh position={[0, -0.1, 0]}>
            <boxGeometry args={[1.0, 0.7, 0.9]} />
            <meshStandardMaterial
              color={primaryColor}
              emissive={primaryColor}
              emissiveIntensity={emissiveIntensity * 0.6}
              roughness={0.2}
              metalness={0.7}
            />
          </mesh>
          {/* Smokestack 1 */}
          <mesh position={[-0.25, 0.45, -0.2]}>
            <cylinderGeometry args={[0.08, 0.1, 0.5, 12]} />
            <meshStandardMaterial color={primaryColor} emissive={primaryColor} emissiveIntensity={emissiveIntensity * 1.2} />
          </mesh>
          {/* Smokestack 2 */}
          <mesh position={[0.15, 0.35, -0.2]}>
            <cylinderGeometry args={[0.07, 0.09, 0.35, 12]} />
            <meshStandardMaterial color={primaryColor} emissive={primaryColor} emissiveIntensity={emissiveIntensity * 1.2} />
          </mesh>
          {/* Gabled Roof Detail */}
          <mesh position={[0, 0.32, 0.15]} rotation={[0, 0, Math.PI / 4]}>
            <boxGeometry args={[0.3, 0.3, 0.55]} />
            <meshStandardMaterial color="#FFFFFF" wireframe={true} />
          </mesh>
        </group>
      )}

      {/* 2. WAREHOUSE / INVENTORY DISTRIBUTION HUB */}
      {meshType === 'warehouse' && (
        <group>
          {/* Main Warehouse Base */}
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[1.1, 0.65, 1.1]} />
            <meshStandardMaterial
              color={primaryColor}
              emissive={primaryColor}
              emissiveIntensity={emissiveIntensity * 0.6}
              roughness={0.3}
              metalness={0.6}
            />
          </mesh>
          {/* Cargo Bay Door */}
          <mesh position={[0, -0.12, 0.56]}>
            <boxGeometry args={[0.45, 0.35, 0.04]} />
            <meshStandardMaterial color="#FFFFFF" emissive={primaryColor} emissiveIntensity={1.5} />
          </mesh>
          {/* Loading Dock Canopy */}
          <mesh position={[0, 0.12, 0.62]}>
            <boxGeometry args={[0.6, 0.05, 0.18]} />
            <meshStandardMaterial color={primaryColor} />
          </mesh>
        </group>
      )}

      {/* 3. SUPPLIER / RAW MATERIAL MILL */}
      {meshType === 'supplier' && (
        <group>
          {/* Raw Material Silo */}
          <mesh position={[-0.2, 0.1, 0]}>
            <cylinderGeometry args={[0.26, 0.26, 0.8, 16]} />
            <meshStandardMaterial
              color={primaryColor}
              emissive={primaryColor}
              emissiveIntensity={emissiveIntensity * 0.7}
              roughness={0.2}
              metalness={0.8}
            />
          </mesh>
          {/* Silo Cap */}
          <mesh position={[-0.2, 0.55, 0]}>
            <sphereGeometry args={[0.26, 16, 12]} />
            <meshStandardMaterial color={primaryColor} emissive={primaryColor} emissiveIntensity={emissiveIntensity} />
          </mesh>
          {/* Fabric Spool Secondary Block */}
          <mesh position={[0.25, -0.05, 0]}>
            <boxGeometry args={[0.5, 0.5, 0.5]} />
            <meshStandardMaterial color={primaryColor} wireframe={true} />
          </mesh>
        </group>
      )}

      {/* 4. MATERIALS / CARGO PACKAGE CRATE */}
      {meshType === 'materials' && (
        <group>
          {/* Base Pallet */}
          <mesh position={[0, -0.25, 0]}>
            <boxGeometry args={[0.9, 0.1, 0.9]} />
            <meshStandardMaterial color="#94A3B8" roughness={0.8} />
          </mesh>
          {/* Stacked Cargo Crate 1 */}
          <mesh position={[-0.15, 0.05, -0.15]}>
            <boxGeometry args={[0.45, 0.45, 0.45]} />
            <meshStandardMaterial
              color={primaryColor}
              emissive={primaryColor}
              emissiveIntensity={emissiveIntensity * 0.7}
              roughness={0.2}
              metalness={0.5}
            />
          </mesh>
          {/* Stacked Cargo Crate 2 */}
          <mesh position={[0.2, 0.05, 0.1]}>
            <boxGeometry args={[0.4, 0.4, 0.4]} />
            <meshStandardMaterial color={primaryColor} emissive={primaryColor} emissiveIntensity={emissiveIntensity * 0.9} />
          </mesh>
          {/* Top Parcel */}
          <mesh position={[-0.05, 0.38, -0.05]}>
            <boxGeometry args={[0.3, 0.25, 0.3]} />
            <meshStandardMaterial color="#FFFFFF" wireframe={true} />
          </mesh>
        </group>
      )}

      {/* 5. LOGISTICS / CARGO FREIGHT TRANSPORT */}
      {meshType === 'logistics' && (
        <group>
          {/* Freight Trailer Body */}
          <mesh position={[0.1, 0.05, 0]}>
            <boxGeometry args={[0.85, 0.5, 0.45]} />
            <meshStandardMaterial
              color={primaryColor}
              emissive={primaryColor}
              emissiveIntensity={emissiveIntensity * 0.7}
              roughness={0.2}
              metalness={0.7}
            />
          </mesh>
          {/* Truck Cabin */}
          <mesh position={[-0.45, -0.05, 0]}>
            <boxGeometry args={[0.3, 0.35, 0.42]} />
            <meshStandardMaterial color={primaryColor} emissive={primaryColor} emissiveIntensity={emissiveIntensity * 1.3} />
          </mesh>
          {/* Wheels */}
          {[-0.35, 0.0, 0.35].map((x, i) => (
            <group key={i}>
              <mesh position={[x, -0.26, 0.24]} rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.1, 0.1, 0.06, 12]} />
                <meshStandardMaterial color="#334155" />
              </mesh>
              <mesh position={[x, -0.26, -0.24]} rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.1, 0.1, 0.06, 12]} />
                <meshStandardMaterial color="#334155" />
              </mesh>
            </group>
          ))}
        </group>
      )}

      {/* 6. FORECAST / AI PREDICTION CRYSTAL */}
      {meshType === 'forecast' && (
        <group>
          <mesh>
            <octahedronGeometry args={[0.65, 0]} />
            <meshStandardMaterial
              color={primaryColor}
              emissive={primaryColor}
              emissiveIntensity={emissiveIntensity * 1.2}
              roughness={0.1}
              metalness={0.8}
            />
          </mesh>
          <mesh ref={orbitalRef}>
            <torusGeometry args={[0.95, 0.03, 16, 48]} />
            <meshStandardMaterial color={primaryColor} emissive={primaryColor} emissiveIntensity={1.8} />
          </mesh>
        </group>
      )}

      {/* 7. RISK / RADAR SURVEILLANCE BEACON */}
      {meshType === 'risk' && (
        <group>
          <mesh>
            <dodecahedronGeometry args={[0.6, 0]} />
            <meshStandardMaterial
              color={primaryColor}
              emissive={primaryColor}
              emissiveIntensity={emissiveIntensity * 1.4}
              roughness={0.2}
              metalness={0.7}
            />
          </mesh>
          <mesh ref={orbitalRef} rotation={[Math.PI / 4, 0, 0]}>
            <ringGeometry args={[0.85, 0.95, 32]} />
            <meshBasicMaterial color={primaryColor} side={THREE.DoubleSide} wireframe={true} />
          </mesh>
        </group>
      )}

      {/* 8. PROCUREMENT / MILP OPTIMIZATION CORE */}
      {(meshType === 'procurement' || meshType === 'decision') && (
        <group>
          <mesh>
            <icosahedronGeometry args={[0.7, 1]} />
            <meshStandardMaterial
              color={primaryColor}
              emissive={primaryColor}
              emissiveIntensity={emissiveIntensity * 1.2}
              wireframe={true}
            />
          </mesh>
          <mesh>
            <sphereGeometry args={[0.42, 24, 24]} />
            <meshStandardMaterial
              color="#FFFFFF"
              emissive={primaryColor}
              emissiveIntensity={emissiveIntensity * 1.5}
            />
          </mesh>
        </group>
      )}
    </group>
  );
};
