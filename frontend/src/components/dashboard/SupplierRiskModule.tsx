import React from 'react';
import { CinematicCard } from '../ui/CinematicCard';
import { Badge } from '../ui/Badge';
import { AlertTriangle } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { type SupplierItem } from '../../services/api/suppliersApi';
import { type RiskPredictionResponse } from '../../services/api/riskApi';

interface SupplierRiskModuleProps {
  suppliers?: SupplierItem[];
  latestRiskResult?: RiskPredictionResponse | null;
}

export const SupplierRiskModule: React.FC<SupplierRiskModuleProps> = ({ suppliers = [], latestRiskResult }) => {
  const { mode } = useTheme();
  const isLight = mode === 'light';

  const highRiskCount = suppliers.filter(s => s.risk_level === 'HIGH').length;
  const medRiskCount = suppliers.filter(s => s.risk_level === 'MEDIUM').length;
  const lowRiskCount = suppliers.filter(s => s.risk_level === 'LOW').length;

  const formatPredictionDate = (value?: string | null) => {
    if (!value) return '—';
    const [year, month, day] = value.split('-');
    if (!year || !month || !day) return value;
    return `${day}-${month}-${year}`;
  };

  return (
    <CinematicCard
      title="Global Supplier Risk"
      subtitle="Current backend supplier risk overview."
      icon={<AlertTriangle size={18} color="#F43F5E" />}
      glowColor="rose"
      headerAction={<Badge variant="rose">Risk Overview</Badge>}
    >
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '16px', marginTop: '12px' }}>
        <div style={{ background: isLight ? 'rgba(244, 63, 94, 0.05)' : 'rgba(244, 63, 94, 0.1)', padding: '10px', borderRadius: '8px', textAlign: 'center' }}>
          <div style={{ fontSize: '10px', color: '#F43F5E', fontWeight: 600 }}>High Risk</div>
          <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#F43F5E' }}>{highRiskCount}</div>
        </div>
        <div style={{ background: isLight ? 'rgba(245, 158, 11, 0.05)' : 'rgba(245, 158, 11, 0.1)', padding: '10px', borderRadius: '8px', textAlign: 'center' }}>
          <div style={{ fontSize: '10px', color: '#F59E0B', fontWeight: 600 }}>Medium Risk</div>
          <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#F59E0B' }}>{medRiskCount}</div>
        </div>
        <div style={{ background: isLight ? 'rgba(16, 185, 129, 0.05)' : 'rgba(16, 185, 129, 0.1)', padding: '10px', borderRadius: '8px', textAlign: 'center' }}>
          <div style={{ fontSize: '10px', color: '#10B981', fontWeight: 600 }}>Low Risk</div>
          <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#10B981' }}>{lowRiskCount}</div>
        </div>
      </div>

      {latestRiskResult && (
        <div style={{ borderTop: isLight ? '1px solid rgba(15, 23, 42, 0.1)' : '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '16px' }}>
          <div style={{ fontSize: '12px', fontWeight: 600, color: isLight ? '#0F172A' : '#F8FAFC', marginBottom: '8px' }}>
            Latest Risk Analysis
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: isLight ? '#334155' : '#CBD5E1', marginBottom: '4px' }}>
            <span>Supplier: {latestRiskResult.supplier_id}</span>
            <span>Date: {formatPredictionDate(latestRiskResult.prediction_date)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: isLight ? '#334155' : '#CBD5E1' }}>
            <span>Risk Score: <strong>{latestRiskResult.risk_score}</strong></span>
            <span><Badge variant={latestRiskResult.risk_level === 'HIGH' ? 'rose' : latestRiskResult.risk_level === 'MEDIUM' ? 'amber' : 'emerald'}>{latestRiskResult.risk_level}</Badge></span>
          </div>
        </div>
      )}
    </CinematicCard>
  );
};
