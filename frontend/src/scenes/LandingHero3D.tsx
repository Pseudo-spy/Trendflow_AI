import React, { useState } from 'react';
import { Html } from '@react-three/drei';
import {
  FloatingObject,
  HoverableObject,
  ConnectionLine,
  DataParticle,
  HologramGrid,
  SupplyChainNode3D,
  type SupplyChainMeshType,
} from '../three';
import { useTheme } from '../hooks/useTheme';

export interface SupplyChainHeroNode {
  id: string;
  name: string;
  category: string;
  meshType: SupplyChainMeshType;
  position: [number, number, number];
  color: string;
  badgeBorder: string;
  status: 'optimal' | 'warning' | 'critical' | 'simulated';
  capacity: string;
  quality: string;
  otif: string;
  leadTime: string;
  risk: string;
  description: string;
}

export const landingSupplyChainNodes: SupplyChainHeroNode[] = [
  {
    id: 'node-demand',
    name: '1. Demand Sensing',
    category: 'Omnichannel POS Stream',
    meshType: 'forecast',
    position: [-7.8, 2.2, -1.5],
    color: '#16A34A', // Green
    badgeBorder: 'rgba(22, 163, 74, 0.6)',
    status: 'optimal',
    capacity: '184.2K u/mo',
    quality: '99.4% Signal Integrity',
    otif: 'Node Telemetry',
    leadTime: '0 days',
    risk: 'Low (6/100)',
    description: 'Senses point-of-sale velocity, promotional elasticity, and trend virality signals.',
  },
  {
    id: 'node-forecast',
    name: '2. ML Forecast',
    category: 'LightGBM + Prophet Engine',
    meshType: 'forecast',
    position: [-5.6, 3.2, 1.8],
    color: '#15803D', // Dark Green
    badgeBorder: 'rgba(21, 128, 61, 0.6)',
    status: 'optimal',
    capacity: '48 SKU Clusters',
    quality: '96.8% Accuracy (MAPE 3.2%)',
    otif: '95% Confidence Band',
    leadTime: '1 day',
    risk: 'Low (8/100)',
    description: 'Generates probabilistic multi-horizon demand projections with seasonal decomposition.',
  },
  {
    id: 'node-sop',
    name: '3. S&OP Planning',
    category: 'Multi-Echelon Balancing',
    meshType: 'warehouse',
    position: [-2.8, 3.6, -2.5],
    color: '#16A34A', // Emerald Green
    badgeBorder: 'rgba(16, 185, 129, 0.6)',
    status: 'optimal',
    capacity: '94.2% Health',
    quality: '98.8% Fill Rate Target',
    otif: '5 Regional Fulfillment DCs',
    leadTime: '2 days',
    risk: 'Nominal (11/100)',
    description: 'Synchronizes gross market demand with factory capacity and regional safety stocks.',
  },
  {
    id: 'node-production',
    name: '4. Production Plant',
    category: 'Mega Assembly Facility',
    meshType: 'factory',
    position: [0.0, 3.4, 2.2],
    color: '#4ADE80', // Light Green
    badgeBorder: 'rgba(74, 222, 128, 0.6)',
    status: 'optimal',
    capacity: '168K u/mo (92.6% Cap)',
    quality: '99.1% Yield',
    otif: 'Line Balancing Active',
    leadTime: '5 days',
    risk: 'Moderate (14/100)',
    description: 'Executes Master Production Schedule (MPS) across automated garment assembly lines.',
  },
  {
    id: 'node-materials',
    name: '5. Materials BOM',
    category: 'Raw Yarn & Fabric Inventory',
    meshType: 'materials',
    position: [2.8, 3.6, -2.5],
    color: '#16A34A', // Green
    badgeBorder: 'rgba(22, 163, 74, 0.6)',
    status: 'optimal',
    capacity: '248.5K kg Organic Cotton',
    quality: 'OEKO-TEX Class 1',
    otif: 'Dynamic Buffer Stocked',
    leadTime: '4 days',
    risk: 'Nominal (12/100)',
    description: 'Explodes bill of materials (BOM) to determine exact raw fabric and trim quotas.',
  },
  {
    id: 'node-procurement',
    name: '6. Procurement',
    category: 'OR-Tools MILP Solver',
    meshType: 'procurement',
    position: [5.6, 3.2, 1.8],
    color: '#15803D', // Dark Green
    badgeBorder: 'rgba(21, 128, 61, 0.6)',
    status: 'optimal',
    capacity: '125K u Optimized',
    quality: '+$482.5K Cost Savings',
    otif: '842ms Solver Latency',
    leadTime: '2 days',
    risk: 'Low (7/100)',
    description: 'Mathematical linear programming finds global minimum landed procurement cost.',
  },
  {
    id: 'node-suppliers',
    name: '7. Suppliers',
    category: 'Tier-1 Qualified Mills',
    meshType: 'supplier',
    position: [7.8, 2.2, -1.5],
    color: '#4ADE80', // Light Green
    badgeBorder: 'rgba(74, 222, 128, 0.6)',
    status: 'optimal',
    capacity: '18 Audited Partners',
    quality: '97.4% OTIF Rate',
    otif: 'MOQ Tier Pricing Applied',
    leadTime: '6.4 days avg',
    risk: 'Low (16/100)',
    description: 'Dispatches allocated volume across certified mills in Taipei, Shenzhen, and Frankfurt.',
  },
  {
    id: 'node-logistics',
    name: '8. Logistics',
    category: 'Intermodal Transit Corridors',
    meshType: 'logistics',
    position: [3.8, -1.2, 2.5],
    color: '#16A34A', // Green
    badgeBorder: 'rgba(22, 163, 74, 0.6)',
    status: 'optimal',
    capacity: '12 Active Vessels / Carriers',
    quality: '99.2% Transit Integrity',
    otif: 'Fast-Track Priority Cleared',
    leadTime: '3 days',
    risk: 'Nominal (15/100)',
    description: 'Monitors container dwell, port congestion, and customs clearance telemetry.',
  },
  {
    id: 'node-risk',
    name: '9. Risk Radar',
    category: 'Surveillance & Auto-Mitigation',
    meshType: 'risk',
    position: [-3.8, -1.2, 2.5],
    color: '#EF4444', // Red for Risk
    badgeBorder: 'rgba(239, 68, 68, 0.6)',
    status: 'warning',
    capacity: '18.4 Composite Index',
    quality: 'AIS & Weather Scanned',
    otif: 'Automated Contingency Reroute',
    leadTime: '4 days',
    risk: 'Elevated Alert (28/100)',
    description: 'Scans geopolitical and meteorological alerts to trigger dynamic buffer rerouting.',
  },
];

interface LandingHero3DProps {
  onHoverNode?: (node: SupplyChainHeroNode | null) => void;
}

export const LandingHero3D: React.FC<LandingHero3DProps> = ({ onHoverNode }) => {
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const { mode } = useTheme();
  const isLight = mode === 'light';

  const handleNodeHover = (node: SupplyChainHeroNode | null) => {
    setHoveredNodeId(node?.id || null);
    onHoverNode?.(node);
  };

  return (
    <>
      {/* 3D Coordinate Floor Grid */}
      <HologramGrid size={44} divisions={44} />

      {/* Ambient Data Photon Particles */}
      <DataParticle count={240} radius={22} speed={0.26} />

      {/* Sequential Supply Flow Conduit Beams with distinct stage colors */}
      {/* 1. Demand -> 2. Forecast */}
      <ConnectionLine
        start={landingSupplyChainNodes[0].position}
        end={landingSupplyChainNodes[1].position}
        packetCount={3}
        speed={1.8}
        color={landingSupplyChainNodes[0].color}
      />
      {/* 2. Forecast -> 3. S&OP */}
      <ConnectionLine
        start={landingSupplyChainNodes[1].position}
        end={landingSupplyChainNodes[2].position}
        packetCount={3}
        speed={1.8}
        color={landingSupplyChainNodes[1].color}
      />
      {/* 3. S&OP -> 4. Production */}
      <ConnectionLine
        start={landingSupplyChainNodes[2].position}
        end={landingSupplyChainNodes[3].position}
        packetCount={3}
        speed={1.8}
        color={landingSupplyChainNodes[2].color}
      />
      {/* 4. Production -> 5. Materials */}
      <ConnectionLine
        start={landingSupplyChainNodes[3].position}
        end={landingSupplyChainNodes[4].position}
        packetCount={3}
        speed={1.8}
        color={landingSupplyChainNodes[3].color}
      />
      {/* 5. Materials -> 6. Procurement */}
      <ConnectionLine
        start={landingSupplyChainNodes[4].position}
        end={landingSupplyChainNodes[5].position}
        packetCount={3}
        speed={2.2}
        color={landingSupplyChainNodes[4].color}
      />
      {/* 6. Procurement -> 7. Suppliers */}
      <ConnectionLine
        start={landingSupplyChainNodes[5].position}
        end={landingSupplyChainNodes[6].position}
        packetCount={3}
        speed={2.0}
        color={landingSupplyChainNodes[5].color}
      />
      {/* 7. Suppliers -> 8. Logistics */}
      <ConnectionLine
        start={landingSupplyChainNodes[6].position}
        end={landingSupplyChainNodes[7].position}
        packetCount={3}
        speed={1.6}
        color={landingSupplyChainNodes[6].color}
      />
      {/* 8. Logistics -> 9. Risk */}
      <ConnectionLine
        start={landingSupplyChainNodes[7].position}
        end={landingSupplyChainNodes[8].position}
        packetCount={2}
        speed={1.4}
        color={landingSupplyChainNodes[7].color}
      />
      {/* 9. Risk -> 1. Demand (Closed Loop) */}
      <ConnectionLine
        start={landingSupplyChainNodes[8].position}
        end={landingSupplyChainNodes[0].position}
        packetCount={2}
        speed={1.4}
        color={landingSupplyChainNodes[8].color}
      />



      {/* Render 9 Supply Chain 3D Nodes with Distinct Colors & Visible Name Tags */}
      {landingSupplyChainNodes.map((node, index) => {
        const isHovered = hoveredNodeId === node.id;

        return (
          <FloatingObject
            key={node.id}
            position={node.position}
            speed={1.0 + (index % 3) * 0.25}
            floatIntensity={0.15}
            rotationSpeed={0.1}
          >
            <HoverableObject
              hoverScale={1.3}
              tooltipText={node.name}
              tooltipSubtext={`${node.category} • ${node.capacity}`}
              onHoverChange={(isHov) => handleNodeHover(isHov ? node : null)}
            >
              <SupplyChainNode3D
                meshType={node.meshType}
                color={node.color}
                status={node.status}
                isHovered={isHovered}
              />
            </HoverableObject>

            {/* Permanent Visible Stage Name Tag */}
            <Html position={[0, -0.9, 0]} center distanceFactor={16} style={{ pointerEvents: 'none' }}>
              <div
                style={{
                  background: isLight ? 'rgba(255, 255, 255, 0.95)' : 'rgba(7, 12, 24, 0.9)',
                  backdropFilter: 'blur(8px)',
                  border: `1px solid ${node.badgeBorder}`,
                  boxShadow: `0 0 10px ${node.color}55`,
                  borderRadius: '16px',
                  padding: '2px 8px',
                  whiteSpace: 'nowrap',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <span
                  style={{
                    width: '5px',
                    height: '5px',
                    borderRadius: '50%',
                    backgroundColor: node.color,
                    boxShadow: `0 0 6px ${node.color}`,
                  }}
                />
                <span
                  style={{
                    fontSize: '10px',
                    fontWeight: 800,
                    color: node.color,
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                  }}
                >
                  {node.name}
                </span>
              </div>
            </Html>
          </FloatingObject>
        );
      })}
    </>
  );
};
