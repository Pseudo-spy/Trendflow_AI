import React from 'react';

export const LightingRig: React.FC = () => {
  return (
    <>
      {/* Ambient background lighting */}
      <ambientLight intensity={0.4} color="#0B1120" />
      
      {/* Main key light */}
      <directionalLight
        position={[10, 15, 10]}
        intensity={1.2}
        color="#F8FAFC"
        castShadow
      />
      
      {/* Neon Cyber Cyan Fill Light */}
      <pointLight
        position={[-12, 8, -6]}
        intensity={2.0}
        distance={35}
        color="#06B6D4"
      />
      
      {/* Radiant Indigo Rim Light */}
      <pointLight
        position={[12, -4, -8]}
        intensity={2.5}
        distance={35}
        color="#6366F1"
      />
      
      {/* Emerald Accent Uplight */}
      <pointLight
        position={[0, -6, 5]}
        intensity={1.5}
        distance={25}
        color="#16A34A"
      />
    </>
  );
};
