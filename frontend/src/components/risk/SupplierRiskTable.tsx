import React from 'react';
import { CinematicCard } from '../ui/CinematicCard';
import { Badge } from '../ui/Badge';
import { ShieldCheck } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { type RiskPredictionResponse } from '../../services/api/riskApi';
import { EmptyState } from '../ui/States';

interface SupplierRiskTableProps {
  data: RiskPredictionResponse[];
}

export const SupplierRiskTable: React.FC<SupplierRiskTableProps> = ({ data }) => {
  const { mode } = useTheme();
  const isLight = mode === 'light';

  const formatPredictionDate = (value?: string | null) => {
    if (!value) return '—';
    const [year, month, day] = value.split('-');
    if (!year || !month || !day) return value;
    return `${day}-${month}-${year}`;
  };

  return (
    <CinematicCard
      title="Analyzed Results"
      subtitle="Current session risk analyses."
      icon={<ShieldCheck size={18} color="#16A34A" />}
      glowColor="emerald"
      headerAction={<Badge variant="emerald">{data.length} Nodes Analyzed</Badge>}
    >
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
          <thead>
            <tr
              style={{
                borderBottom: isLight ? '1px solid rgba(15, 23, 42, 0.1)' : '1px solid rgba(255, 255, 255, 0.08)',
                textAlign: 'left',
                color: '#64748B',
                fontSize: '11px',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              <th style={{ padding: '8px 10px' }}>Supplier ID</th>
              <th style={{ padding: '8px 10px' }}>Prediction Date</th>
              <th style={{ padding: '8px 10px' }}>Quality Risk</th>
              <th style={{ padding: '8px 10px' }}>Delivery Risk</th>
              <th style={{ padding: '8px 10px' }}>Risk Score</th>
              <th style={{ padding: '8px 10px' }}>Risk Level</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ padding: '40px 0' }}>
                  <EmptyState title="No Risk Data" message="No supplier risk data available. Select a supplier and material to run an analysis." />
                </td>
              </tr>
            ) : (
              data.map((row, idx) => {
                let badgeColor: 'emerald' | 'amber' | 'rose' = 'emerald';
                
                if (row.risk_level === 'HIGH') {
                  badgeColor = 'rose';
                } else if (row.risk_level === 'MEDIUM') {
                  badgeColor = 'amber';
                }

                return (
                  <tr
                    key={idx}
                    style={{
                      borderBottom: isLight ? '1px solid rgba(15, 23, 42, 0.04)' : '1px solid rgba(255, 255, 255, 0.04)',
                    }}
                  >
                    <td style={{ padding: '10px 10px', fontWeight: 700, color: isLight ? '#0F172A' : '#F8FAFC' }}>
                      {row.supplier_id}
                    </td>
                    <td style={{ padding: '10px 10px', color: isLight ? '#0F172A' : '#F8FAFC' }}>
                      {formatPredictionDate(row.prediction_date)}
                    </td>
                    <td style={{ padding: '10px 10px', color: '#64748B', fontWeight: 400 }}>
                      {row.quality_risk}
                    </td>
                    <td style={{ padding: '10px 10px', color: '#94A3B8', fontFamily: "'JetBrains Mono', monospace" }}>
                      {row.delivery_risk}
                    </td>
                    <td style={{ padding: '10px 10px', fontWeight: 800, color: row.risk_score > 0.5 ? '#F43F5E' : '#16A34A', fontFamily: "'JetBrains Mono', monospace" }}>
                      {row.risk_score}
                    </td>
                    <td style={{ padding: '10px 10px' }}>
                      <Badge variant={badgeColor}>
                        {row.risk_level}
                      </Badge>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </CinematicCard>
  );
};
