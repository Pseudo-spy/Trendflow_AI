export type NodeType = 'supplier' | 'warehouse' | 'factory' | 'distribution' | 'retail';
export type NodeStatus = 'optimal' | 'warning' | 'critical' | 'simulated';

export interface SupplyChainNodeData {
  id: string;
  name: string;
  type: NodeType;
  position: [number, number, number];
  status: NodeStatus;
  capacity: number; // 0 - 100%
  throughput: number;
  leadTimeDays: number;
  riskScore: number; // 0 - 100
  city: string;
  country: string;
  labelOffset?: [number, number, number];
  customColor?: { primary: string; glow: string; emissiveDark: string; emissiveLight: string };
}

export interface SupplyChainConnection {
  id: string;
  fromNodeId: string;
  toNodeId: string;
  flowVolume: number;
  status: 'active' | 'delayed' | 'optimized';
  color?: string;
}

export interface ParticleConfig {
  count?: number;
  spread?: number;
  color?: string;
  size?: number;
  speed?: number;
}
