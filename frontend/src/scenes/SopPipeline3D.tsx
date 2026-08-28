import React from 'react';
import {
  FloatingObject,
  GlowingNode,
  ConnectionLine,
  DataParticle,
  PulseEffect,
  HologramGrid,
} from '../three';
import type { SupplyChainNodeData } from '../types/three';
import { useTheme } from '../hooks/useTheme';

import { sopPipelineStages } from './mock3DData';

interface SopPipeline3DProps {
  selectedStage: SupplyChainNodeData | null;
  onSelectStage: (stage: SupplyChainNodeData | null) => void;
}

export const SopPipeline3D: React.FC<SopPipeline3DProps> = ({
  selectedStage,
  onSelectStage,
}) => {
  const { mode } = useTheme();
  const isLight = mode === 'light';

  return (
    <>
      {/* 3D Floor Grid */}
      <HologramGrid size={38} divisions={38} />

      {/* Ambient Data Particles */}
      <DataParticle count={200} radius={18} speed={0.3} />

      {/* Sequential S&OP Stage Conduits with Photon Flow */}
      {/* 1. Demand -> 2. Forecast */}
      <ConnectionLine
        start={sopPipelineStages[0].position}
        end={sopPipelineStages[1].position}
        packetCount={3}
        speed={2.0}
        color={isLight ? '#0284C7' : '#06B6D4'}
      />
      {/* 2. Forecast -> 3. Inventory */}
      <ConnectionLine
        start={sopPipelineStages[1].position}
        end={sopPipelineStages[2].position}
        packetCount={3}
        speed={2.0}
        color={isLight ? '#4F46E5' : '#6366F1'}
      />
      {/* 3. Inventory -> 4. Production */}
      <ConnectionLine
        start={sopPipelineStages[2].position}
        end={sopPipelineStages[3].position}
        packetCount={3}
        speed={2.0}
        color="#16A34A"
      />
      {/* 4. Production -> 5. Capacity */}
      <ConnectionLine
        start={sopPipelineStages[3].position}
        end={sopPipelineStages[4].position}
        packetCount={3}
        speed={2.0}
        color={isLight ? '#0284C7' : '#06B6D4'}
      />
      {/* 5. Capacity -> 6. Material Requirement */}
      <ConnectionLine
        start={sopPipelineStages[4].position}
        end={sopPipelineStages[5].position}
        packetCount={3}
        speed={2.0}
        color={isLight ? '#4F46E5' : '#6366F1'}
      />

      {/* Central Radar Pulse */}
      <PulseEffect position={[0, -1.2, 0]} maxRadius={6.0} speed={0.9} />

      {/* Render all 6 3D Pipeline Stages */}
      {sopPipelineStages.map((stage, index) => {
        const isSelected = selectedStage?.id === stage.id;

        return (
          <FloatingObject
            key={stage.id}
            position={[0, 0, 0]}
            speed={1.2 + (index % 3) * 0.3}
            floatIntensity={0.12}
            rotationSpeed={0.12}
          >
            <GlowingNode
              node={stage}
              isSelected={isSelected}
              onSelect={(s) => onSelectStage(s)}
            />
          </FloatingObject>
        );
      })}
    </>
  );
};
