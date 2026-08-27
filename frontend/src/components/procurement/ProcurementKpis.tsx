import React from 'react';
import { CinematicCard } from '../ui/CinematicCard';
import { DollarSign, Layers, CheckCircle2, Users, Target, Clock } from 'lucide-react';
import { type OptimizationResponse } from '../../services/api/procurementApi';
import { useTheme } from '../../hooks/useTheme';

interface ProcurementKpisProps {
  data: OptimizationResponse | null;
}

export const ProcurementKpis: React.FC<ProcurementKpisProps> = ({ data }) => {
  const { mode } = useTheme();
  const isLight = mode === 'light';

  if (!data) {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', marginBottom: '28px' }}>
        <div style={{ padding: '20px', borderRadius: '12px', background: isLight ? '#F8FAFC' : 'rgba(255, 255, 255, 0.03)', border: isLight ? '1px solid #E2E8F0' : '1px solid rgba(255, 255, 255, 0.08)', textAlign: 'center', color: '#64748B', fontSize: '13px' }}>
          No procurement allocation active. Run allocation to compute KPIs.
        </div>
      </div>
    );
  }

  const suppliersUsed = data.allocation.length;

  let leadTimeDisplay = '—';
  if (data.allocation.length === 1) {
    const val = data.allocation[0].lead_time_days;
    if (val !== undefined && val !== null) {
      leadTimeDisplay = `${val} day${val === 1 ? '' : 's'}`;
    }
  } else {
    const val = data.weighted_lead_time_days;
    if (val !== undefined && val !== null) {
      const rounded = Math.round(val);
      leadTimeDisplay = `${rounded} day${rounded === 1 ? '' : 's'}`;
    }
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
      </CinematicCard>

      <CinematicCard glowColor="emerald">
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: isLight ? 'rgba(16, 185, 129, 0.1)' : 'rgba(16, 185, 129, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10B981' }}>
              <CheckCircle2 size={16} />
            </div>
            <span style={{ fontSize: '13px', fontWeight: 600, color: isLight ? '#475569' : '#94A3B8' }}>Total Allocated</span>
          </div>
        </div>
        <div style={{ marginTop: '16px', fontSize: '24px', fontWeight: 800, color: isLight ? '#0F172A' : '#F8FAFC', fontFamily: "'JetBrains Mono', monospace" }}>
          {data.total_allocated.toLocaleString()}
        </div>
      </CinematicCard>

      <CinematicCard glowColor="amber">
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: isLight ? 'rgba(245, 158, 11, 0.1)' : 'rgba(245, 158, 11, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#F59E0B' }}>
              <DollarSign size={16} />
            </div>
            <span style={{ fontSize: '13px', fontWeight: 600, color: isLight ? '#475569' : '#94A3B8' }}>Total Cost</span>
          </div>
        </div>
        <div style={{ marginTop: '16px', fontSize: '24px', fontWeight: 800, color: isLight ? '#0F172A' : '#F8FAFC', fontFamily: "'JetBrains Mono', monospace" }}>
          {data.total_cost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
      </CinematicCard>

      <CinematicCard glowColor="indigo">
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: isLight ? 'rgba(99, 102, 241, 0.1)' : 'rgba(99, 102, 241, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6366F1' }}>
              <Users size={16} />
            </div>
            <span style={{ fontSize: '13px', fontWeight: 600, color: isLight ? '#475569' : '#94A3B8' }}>Suppliers Used</span>
          </div>
        </div>
        <div style={{ marginTop: '16px', fontSize: '24px', fontWeight: 800, color: isLight ? '#0F172A' : '#F8FAFC', fontFamily: "'JetBrains Mono', monospace" }}>
          {suppliersUsed}
        </div>
      </CinematicCard>

      <CinematicCard glowColor="amber">
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: isLight ? 'rgba(245, 158, 11, 0.1)' : 'rgba(245, 158, 11, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#F59E0B' }}>
              <Clock size={16} />
            </div>
            <span style={{ fontSize: '13px', fontWeight: 600, color: isLight ? '#475569' : '#94A3B8' }}>Lead Time</span>
          </div>
        </div>
        <div style={{ marginTop: '16px', fontSize: '24px', fontWeight: 800, color: isLight ? '#0F172A' : '#F8FAFC', fontFamily: "'JetBrains Mono', monospace" }}>
          {leadTimeDisplay}
        </div>
      </CinematicCard>

      <CinematicCard glowColor="emerald">
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: isLight ? 'rgba(16, 185, 129, 0.1)' : 'rgba(16, 185, 129, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10B981' }}>
              <CheckCircle2 size={16} />
            </div>
            <span style={{ fontSize: '13px', fontWeight: 600, color: isLight ? '#475569' : '#94A3B8' }}>Supplier Status</span>
          </div>
        </div>
        <div style={{ marginTop: '16px', fontSize: '24px', fontWeight: 800, color: isLight ? '#0F172A' : '#F8FAFC', fontFamily: "'JetBrains Mono', monospace" }}>
          {data.status ? `✓ ${data.status}` : '—'}
        </div>
      </CinematicCard>

      <CinematicCard glowColor="cyan">
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: isLight ? 'rgba(6, 182, 212, 0.1)' : 'rgba(6, 182, 212, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#06B6D4' }}>
              <Target size={16} />
            </div>
            <span style={{ fontSize: '13px', fontWeight: 600, color: isLight ? '#475569' : '#94A3B8' }}>Optimality Score</span>
          </div>
        </div>
        <div style={{ marginTop: '16px', fontSize: '24px', fontWeight: 800, color: isLight ? '#0F172A' : '#F8FAFC', fontFamily: "'JetBrains Mono', monospace" }}>
          {data.objective_value !== undefined && data.objective_value !== null ? data.objective_value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '—'}
        </div>
      </CinematicCard>
    </div>
  );
};
