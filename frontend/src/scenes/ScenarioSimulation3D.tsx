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
import type { ScenarioParameters } from '../types/scenario';
import { useTheme } from '../hooks/useTheme';

interface ScenarioSimulation3DProps {
  params: ScenarioParameters;
  selectedNodeId: string | null;
  onSelectNode: (node: SupplyChainNodeData | null) => void;
}

export const ScenarioSimulation3D: React.FC<ScenarioSimulation3DProps> = ({
  params,
  selectedNodeId,
  onSelectNode,
}) => {
  const { mode } = useTheme();
  const isLight = mode === 'light';

  // Dynamic calculations for 3D visual weights
  const demandScaleMultiplier = Math.max(0.7, 1.0 + params.demandChangePct / 100);
  const particleSpeed = Math.max(1.0, 1.8 * (1.0 + params.demandChangePct / 100));
  const isHanoiDown = params.supplierAvailability === 'hanoi_offline';
  const isPortStrike = params.supplierAvailability === 'port_strike';
  const isPlantStrained = params.demandChangePct > 20 || params.plantCapacityPct < 85;

  const scenarioNodes: SupplyChainNodeData[] = [
    {
      id: 'node-demand',
      name: `1. Demand (${params.demandChangePct >= 0 ? '+' : ''}${params.demandChangePct}%)`,
      type: 'retail',
      position: [-7.0, 2.5, -1.0],
      status: params.demandChangePct > 25 ? 'warning' : 'optimal',
      capacity: Math.round(100 * demandScaleMultiplier),
      throughput: Math.round(184200 * demandScaleMultiplier),
      leadTimeDays: 0,
      riskScore: 6,
      city: 'Market Signal',
      country: 'Omnichannel',
    },
    {
      id: 'node-forecast',
      name: '2. Forecast Model',
      type: 'factory',
      position: [-4.2, 0.8, 1.8],
      status: 'optimal',
      capacity: 96,
      throughput: Math.round(181800 * demandScaleMultiplier),
      leadTimeDays: 1,
      riskScore: 8,
      city: 'LightGBM Ensemble',
      country: 'AI Prediction',
    },
    {
      id: 'node-production',
      name: `3. Production (${params.plantCapacityPct}% Cap)`,
      type: 'factory',
      position: [-1.4, -1.2, -1.2],
      status: isPlantStrained ? 'warning' : 'optimal',
      capacity: Math.min(100, Math.round((params.plantCapacityPct / 100) * 94)),
      throughput: Math.round(168000 * Math.min(demandScaleMultiplier, params.plantCapacityPct / 100)),
      leadTimeDays: 5,
      riskScore: isPlantStrained ? 45 : 12,
      city: 'Mega Assembly Line',
      country: 'Manufacturing',
    },
    {
      id: 'node-materials',
      name: `4. Materials (${params.materialPriceChangePct >= 0 ? '+' : ''}${params.materialPriceChangePct}% Cost)`,
      type: 'supplier',
      position: [1.4, -1.2, 1.2],
      status: params.materialPriceChangePct > 20 ? 'warning' : 'optimal',
      capacity: 92,
      throughput: Math.round(248500 * demandScaleMultiplier),
      leadTimeDays: 4,
      riskScore: params.materialPriceChangePct > 20 ? 36 : 14,
      city: 'BOM Supply Stream',
      country: 'Fabrics & Trims',
    },
    {
      id: 'node-suppliers',
      name: `5. Suppliers (${isHanoiDown ? 'Hanoi Offline' : isPortStrike ? 'Port Strike' : 'Active'})`,
      type: 'supplier',
      position: [4.2, 0.8, -1.8],
      status: isHanoiDown || isPortStrike ? 'critical' : 'optimal',
      capacity: isHanoiDown ? 72 : Math.round(params.supplierCapacityPct * 0.9),
      throughput: isHanoiDown ? 100000 : 125000,
      leadTimeDays: 7 + params.leadTimeChangeDays,
      riskScore: isHanoiDown ? 68 : isPortStrike ? 54 : 18,
      city: isHanoiDown ? 'Contingency Route' : 'Global Network',
      country: 'Tier-1 Vendors',
    },
    {
      id: 'node-procurement',
      name: '6. Procurement Solver',
      type: 'factory',
      position: [7.0, 2.5, -1.0],
      status: 'optimal',
      capacity: 99,
      throughput: Math.round(125000 * demandScaleMultiplier),
      leadTimeDays: 2,
      riskScore: 7,
      city: 'OR-Tools MILP',
      country: 'Optimization',
    },
    {
      id: 'node-risk',
      name: `7. Risk Radar (${isHanoiDown ? 'Elevated' : 'Nominal'})`,
      type: 'distribution',
      position: [0.0, 3.8, 0.0],
      status: isHanoiDown || isPlantStrained ? 'critical' : 'optimal',
      capacity: 88,
      throughput: 50000,
      leadTimeDays: 3,
      riskScore: isHanoiDown ? 62 : isPlantStrained ? 42 : 18,
      city: 'Threat Telemetry',
      country: 'Surveillance',
    },
  ];

  return (
    <>
      {/* Dynamic 3D Floor Grid */}
      <HologramGrid size={38} divisions={38} />

      {/* Ambient Particle Stream with dynamic count and speed */}
      <DataParticle count={Math.round(200 * demandScaleMultiplier)} radius={20} speed={0.25 * particleSpeed} />

      {/* Dynamic Sequential Conduit Beams */}
      {/* 1. Demand -> 2. Forecast */}
      <ConnectionLine
        start={scenarioNodes[0].position}
        end={scenarioNodes[1].position}
        packetCount={Math.round(3 * demandScaleMultiplier)}
        speed={2.0 * particleSpeed}
        color={params.demandChangePct > 20 ? '#38BDF8' : (isLight ? '#0284C7' : '#06B6D4')}
      />
      {/* 2. Forecast -> 3. Production */}
      <ConnectionLine
        start={scenarioNodes[1].position}
        end={scenarioNodes[2].position}
        packetCount={Math.round(3 * demandScaleMultiplier)}
        speed={1.8 * particleSpeed}
        color={isPlantStrained ? '#F59E0B' : (isLight ? '#4F46E5' : '#6366F1')}
      />
      {/* 3. Production -> 4. Materials */}
      <ConnectionLine
        start={scenarioNodes[2].position}
        end={scenarioNodes[3].position}
        packetCount={3}
        speed={1.8 * particleSpeed}
        color="#16A34A"
      />
      {/* 4. Materials -> 5. Suppliers */}
      <ConnectionLine
        start={scenarioNodes[3].position}
        end={scenarioNodes[4].position}
        packetCount={isHanoiDown ? 1 : 3}
        speed={isHanoiDown ? 0.8 : 2.0}
        color={isHanoiDown ? '#F43F5E' : '#F59E0B'}
      />
      {/* 5. Suppliers -> 6. Procurement */}
      <ConnectionLine
        start={scenarioNodes[4].position}
        end={scenarioNodes[5].position}
        packetCount={3}
        speed={2.2}
        color={isLight ? '#0284C7' : '#06B6D4'}
      />
      {/* 6. Procurement -> 7. Risk */}
      <ConnectionLine
        start={scenarioNodes[5].position}
        end={scenarioNodes[6].position}
        packetCount={2}
        speed={1.5}
        color={isHanoiDown ? '#F43F5E' : (isLight ? '#4F46E5' : '#6366F1')}
      />
      {/* 7. Risk -> 1. Demand (Closed Loop Feedback) */}
      <ConnectionLine
        start={scenarioNodes[6].position}
        end={scenarioNodes[0].position}
        packetCount={2}
        speed={1.5}
        color={isLight ? '#4F46E5' : '#6366F1'}
      />

      {/* Central Radar Pulse */}
      <PulseEffect position={[0, -0.8, 0]} maxRadius={5.5 * demandScaleMultiplier} speed={0.9 * particleSpeed} />

      {/* Render 7 Dynamic 3D Network Nodes */}
      {scenarioNodes.map((node, index) => {
        const isSelected = selectedNodeId === node.id;

        return (
          <FloatingObject
            key={node.id}
            position={[0, 0, 0]}
            speed={1.1 + (index % 3) * 0.2}
            floatIntensity={0.12}
            rotationSpeed={0.12}
          >
            <GlowingNode
              node={node}
              isSelected={isSelected}
              onSelect={(n) => onSelectNode(n)}
            />
          </FloatingObject>
        );
      })}
    </>
  );
};
