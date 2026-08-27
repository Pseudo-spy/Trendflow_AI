import React from 'react';
import { CinematicCard } from '../ui/CinematicCard';
import { ShieldAlert, AlertTriangle, ShieldCheck, Clock } from 'lucide-react';
import { type RiskPredictionResponse } from '../../services/api/riskApi';
import { useTheme } from '../../hooks/useTheme';
import { Badge } from '../ui/Badge';

interface RiskKpisProps {
  data: RiskPredictionResponse | null;
}

export const RiskKpis: React.FC<RiskKpisProps> = ({ data }) => {
  const { mode } = useTheme();
  const isLight = mode === 'light';

  if (!data) {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', marginBottom: '28px' }}>
        <div style={{ padding: '20px', borderRadius: '12px', background: isLight ? '#F8FAFC' : 'rgba(255, 255, 255, 0.03)', border: isLight ? '1px solid #E2E8F0' : '1px solid rgba(255, 255, 255, 0.08)', textAlign: 'center', color: '#64748B', fontSize: '13px' }}>
          No risk analysis active. Select a supplier and material to analyze risk.
        </div>
      </div>
    );
  }

  let levelColor = 'cyan';
  if (data.risk_level === 'HIGH') levelColor = 'rose';
  if (data.risk_level === 'MEDIUM') levelColor = 'amber';
  if (data.risk_level === 'LOW') levelColor = 'emerald';

  const formatPredictionDate = (value?: string | null) => {
    if (!value) return '—';
    const [year, month, day] = value.split('-');
    if (!year || !month || !day) return value;
    return `${day}-${month}-${year}`;
  };

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '16px',
        marginBottom: '28px',
      }}
    >
      <CinematicCard glowColor={data.risk_score > 0.5 ? "rose" : "emerald"}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: isLight ? 'rgba(16, 185, 129, 0.1)' : 'rgba(16, 185, 129, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10B981' }}>
              <ShieldCheck size={16} />
            </div>
            <span style={{ fontSize: '13px', fontWeight: 600, color: isLight ? '#475569' : '#94A3B8' }}>Risk Score</span>
          </div>
        </div>
        <div style={{ marginTop: '16px', fontSize: '24px', fontWeight: 800, color: isLight ? '#0F172A' : '#F8FAFC', fontFamily: "'JetBrains Mono', monospace" }}>
          {data.risk_score ?? '—'}
        </div>
      </CinematicCard>

      <CinematicCard glowColor={levelColor as any}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: isLight ? 'rgba(245, 158, 11, 0.1)' : 'rgba(245, 158, 11, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#F59E0B' }}>
              <AlertTriangle size={16} />
            </div>
            <span style={{ fontSize: '13px', fontWeight: 600, color: isLight ? '#475569' : '#94A3B8' }}>Risk Level</span>
          </div>
        </div>
        <div style={{ marginTop: '16px' }}>
          {data.risk_level ? (
            <Badge variant={levelColor as any}>{data.risk_level}</Badge>
          ) : (
            <span style={{ fontSize: '24px', fontWeight: 800, color: isLight ? '#0F172A' : '#F8FAFC', fontFamily: "'JetBrains Mono', monospace" }}>—</span>
          )}
        </div>
      </CinematicCard>

      <CinematicCard glowColor="cyan">
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: isLight ? 'rgba(6, 182, 212, 0.1)' : 'rgba(6, 182, 212, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#06B6D4' }}>
              <ShieldAlert size={16} />
            </div>
            <span style={{ fontSize: '13px', fontWeight: 600, color: isLight ? '#475569' : '#94A3B8' }}>Quality Risk</span>
          </div>
        </div>
        <div style={{ marginTop: '16px', fontSize: '24px', fontWeight: 800, color: isLight ? '#0F172A' : '#F8FAFC', fontFamily: "'JetBrains Mono', monospace" }}>
          {data.quality_risk ?? '—'}
        </div>
      </CinematicCard>

      <CinematicCard glowColor="indigo">
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: isLight ? 'rgba(99, 102, 241, 0.1)' : 'rgba(99, 102, 241, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6366F1' }}>
              <Clock size={16} />
            </div>
            <span style={{ fontSize: '13px', fontWeight: 600, color: isLight ? '#475569' : '#94A3B8' }}>Prediction Date</span>
          </div>
        </div>
        <div style={{ marginTop: '16px', fontSize: '24px', fontWeight: 800, color: isLight ? '#0F172A' : '#F8FAFC', fontFamily: "'JetBrains Mono', monospace" }}>
          {formatPredictionDate(data.prediction_date)}
        </div>
      </CinematicCard>
    </div>
  );
};
