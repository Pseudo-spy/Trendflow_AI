import React, { Suspense, type ReactNode } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useTheme } from '../hooks/useTheme';
import { CameraRig } from './CameraRig';
import { LightingSetup } from './LightingSetup';

export interface SceneCanvasProps {
  children?: ReactNode;
  enableOrbit?: boolean;
  enableParallax?: boolean;
  cameraPosition?: [number, number, number];
  fov?: number;
  className?: string;
  autoRotate?: boolean;
}

export const SceneCanvas: React.FC<SceneCanvasProps> = ({
  children,
  enableOrbit = true,
  enableParallax = true,
  cameraPosition = [0, 6, 18],
  fov = 45,
  className = 'w-full h-full',
  autoRotate = false,
}) => {
  const { theme3D, performanceMode } = useTheme();

  return (
    <div
      className={className}
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        background: 'transparent',
      }}
    >
      <Canvas
        camera={{ position: cameraPosition, fov }}
        gl={{
          antialias: !performanceMode,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        dpr={performanceMode ? [1, 1] : [1, 2]}
      >
        {/* Ambient Fog matching theme */}
        <fog attach="fog" args={[theme3D.fogColor, theme3D.fogNear, theme3D.fogFar]} />

        {/* Dynamic Studio Lighting Rig */}
        <LightingSetup />

        {/* Smooth Camera Parallax Rig */}
        <CameraRig basePosition={cameraPosition} enabled={enableParallax} />

        <Suspense fallback={null}>
          {children}

          {/* User Orbit Controls (when dragging) */}
          {enableOrbit && (
            <OrbitControls
              enableDamping
              dampingFactor={0.05}
              maxPolarAngle={Math.PI / 2 + 0.05}
              minDistance={5}
              maxDistance={35}
              autoRotate={autoRotate}
              autoRotateSpeed={0.08}
            />
          )}
        </Suspense>
      </Canvas>
    </div>
  );
};
