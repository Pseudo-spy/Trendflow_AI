import React from 'react';
import { useTheme } from '../hooks/useTheme';

interface LightingSetupProps {
  showHelpers?: boolean;
}

export const LightingSetup: React.FC<LightingSetupProps> = () => {
  const { theme3D, mode } = useTheme();

  const isLight = mode === 'light';

  return (
    <>
      {/* Dynamic Ambient Background Illumination */}
      <ambientLight
        color={theme3D.ambientColor}
        intensity={theme3D.ambientIntensity}
      />

      {/* Main Studio Key Light */}
      <directionalLight
        position={[12, 16, 10]}
        intensity={theme3D.keyLightIntensity}
        color={theme3D.keyLightColor}
        castShadow
      />

      {/* Soft Secondary Fill Light */}
      <directionalLight
        position={[-10, 8, -6]}
        intensity={isLight ? 0.8 : 0.4}
        color={isLight ? '#CBD5E1' : '#1E293B'}
      />

      {/* Cyber Cyan Accent Light */}
      <pointLight
        position={[-10, 6, -4]}
        intensity={isLight ? 1.2 : 2.2}
        distance={35}
        color={isLight ? '#0284C7' : '#06B6D4'}
      />

      {/* Radiant Indigo/Violet Rim Spotlight */}
      <pointLight
        position={[10, -4, -6]}
        intensity={theme3D.rimLightIntensity}
        distance={30}
        color={theme3D.rimLightColor}
      />

      {/* Subtle Ground Bounce Light */}
      <pointLight
        position={[0, -5, 4]}
        intensity={isLight ? 0.6 : 1.2}
        distance={20}
        color={isLight ? '#6366F1' : '#16A34A'}
      />
    </>
  );
};
