import React from 'react';
import { CinematicCard } from '../ui/CinematicCard';
import { Layers, Calendar, Factory, AlertTriangle } from 'lucide-react';
import { type MaterialRequirementContract } from '../../services/api/sopApi';
import { useTheme } from '../../hooks/useTheme';
import { Badge } from '../ui/Badge';

interface SopKpisProps {
  data: MaterialRequirementContract | null;
}

export const SopKpis: React.FC<SopKpisProps> = ({ data }) => {
  const { mode } = useTheme();
  const isLight = mode === 'light';

  if (!data) {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', marginBottom: '28px' }}>
        <div style={{ padding: '20px', borderRadius: '12px', background: isLight ? '#F8FAFC' : 'rgba(255, 255, 255, 0.03)', border: isLight ? '1px solid #E2E8F0' : '1px solid rgba(255, 255, 255, 0.08)', textAlign: 'center', color: '#64748B', fontSize: '13px' }}>
          No material plan active. Run S&OP to compute KPIs.
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '16px',
        marginBottom: '28px',
      }}
    >
      <CinematicCard glowColor="cyan">
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: isLight ? 'rgba(6, 182, 212, 0.1)' : 'rgba(6, 182, 212, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#06B6D4' }}>
              <Layers size={16} />
            </div>
            <span style={{ fontSize: '13px', fontWeight: 600, color: isLight ? '#475569' : '#94A3B8' }}>Required Quantity</span>
          </div>
        </div>
        <div style={{ marginTop: '16px', fontSize: '24px', fontWeight: 800, color: isLight ? '#0F172A' : '#F8FAFC', fontFamily: "'JetBrains Mono', monospace" }}>
          {data.required_quantity.toLocaleString()}
        </div>
        <div style={{ fontSize: '12px', color: '#64748B', marginTop: '4px' }}>
          Material: <span style={{ fontWeight: 600, color: '#06B6D4' }}>{data.material_id}</span>
        </div>
      </CinematicCard>

      <CinematicCard glowColor="amber">
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: isLight ? 'rgba(245, 158, 11, 0.1)' : 'rgba(245, 158, 11, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#F59E0B' }}>
              <Calendar size={16} />
            </div>
            <span style={{ fontSize: '13px', fontWeight: 600, color: isLight ? '#475569' : '#94A3B8' }}>Target Date</span>
          </div>
        </div>
        <div style={{ marginTop: '16px', fontSize: '20px', fontWeight: 700, color: isLight ? '#0F172A' : '#F8FAFC', fontFamily: "'JetBrains Mono', monospace" }}>
          {data.required_date}
        </div>
      </CinematicCard>

      <CinematicCard glowColor="emerald">
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: isLight ? 'rgba(16, 185, 129, 0.1)' : 'rgba(16, 185, 129, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10B981' }}>
              <Factory size={16} />
            </div>
            <span style={{ fontSize: '13px', fontWeight: 600, color: isLight ? '#475569' : '#94A3B8' }}>Destination Plant</span>
          </div>
        </div>
        <div style={{ marginTop: '16px', fontSize: '20px', fontWeight: 700, color: isLight ? '#0F172A' : '#F8FAFC' }}>
          {data.plant_id}
        </div>
      </CinematicCard>

      <CinematicCard glowColor="rose">
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: isLight ? 'rgba(244, 63, 94, 0.1)' : 'rgba(244, 63, 94, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#F43F5E' }}>
              <AlertTriangle size={16} />
            </div>
            <span style={{ fontSize: '13px', fontWeight: 600, color: isLight ? '#475569' : '#94A3B8' }}>Priority Level</span>
          </div>
        </div>
        <div style={{ marginTop: '16px' }}>
          <Badge variant={data.priority === 'HIGH' ? 'rose' : (data.priority === 'MEDIUM' ? 'amber' : 'cyan')} pulse={data.priority === 'HIGH'}>
            {data.priority} PRIORITY
          </Badge>
        </div>
      </CinematicCard>
    </div>
  );
};
