import React from 'react';
import { CinematicCard } from '../ui/CinematicCard';
import { 
  TrendingUp, 
  Layers, 
  Boxes, 
  Activity, 
  AlertTriangle, 
  CheckCircle2,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

const PendingKpiCard: React.FC<{ label: string; icon: React.ReactNode; glowColor: any }> = ({ label, icon, glowColor }) => (
  <CinematicCard glowColor={glowColor}>
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#07150E', border: '1px solid #1B3B2B', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#16A34A' }}>
          {icon}
        </div>
        <span style={{ fontSize: '13px', fontWeight: 600, color: '#86A795' }}>{label}</span>
      </div>
    </div>
    <div style={{ marginTop: '16px', fontSize: '14px', color: '#64748B', fontWeight: 500 }}>
      Backend Pending
    </div>
  </CinematicCard>
);

export const SopKpis: React.FC = () => {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '16px',
        marginBottom: '28px',
      }}
    >
      <PendingKpiCard label="Demand Requirement" icon={<TrendingUp size={16} />} glowColor="cyan" />
      <PendingKpiCard label="Material Requirement" icon={<Layers size={16} />} glowColor="indigo" />
      <PendingKpiCard label="Available Inventory" icon={<Boxes size={16} />} glowColor="emerald" />
      <PendingKpiCard label="Capacity Utilization" icon={<Activity size={16} />} glowColor="amber" />
      <PendingKpiCard label="Supply Gap" icon={<AlertTriangle size={16} />} glowColor="rose" />
      <PendingKpiCard label="Stockout Risk" icon={<AlertCircle size={16} />} glowColor="rose" />
      <PendingKpiCard label="Service Level" icon={<ShieldCheck size={16} />} glowColor="emerald" />
      <PendingKpiCard label="Plan Status" icon={<CheckCircle2 size={16} />} glowColor="cyan" />
    </div>
  );
};
