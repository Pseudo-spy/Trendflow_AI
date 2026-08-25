import React, { useState, useEffect } from 'react';
import { CinematicCard } from '../ui/CinematicCard';
import { Badge } from '../ui/Badge';
import { ShieldCheck } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { predictRisk, type RiskPredictionResponse } from '../../services/api/riskApi';
import { LoadingState, ErrorState, EmptyState } from '../ui/States';

const DEFAULT_RISK_QUERIES = [
  { supplier_id: 'SUP001', material_id: 'MAT001' },
  { supplier_id: 'SUP002', material_id: 'MAT002' },
  { supplier_id: 'SUP003', material_id: 'MAT003' },
  { supplier_id: 'SUP004', material_id: 'MAT004' },
  { supplier_id: 'SUP005', material_id: 'MAT005' },
  { supplier_id: 'SUP006', material_id: 'MAT006' },
];

export const SupplierRiskTable: React.FC = () => {
  const { mode } = useTheme();
  const isLight = mode === 'light';
  const [data, setData] = useState<RiskPredictionResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadRiskData = async () => {
    try {
      setLoading(true);
      setError(null);
      // Fetch predictions concurrently for the default queries
      const promises = DEFAULT_RISK_QUERIES.map(q => predictRisk(q));
      const results = await Promise.all(promises);
      setData(results);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch risk predictions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRiskData();
  }, []);

  if (loading) {
    return <LoadingState message="Running Risk Prediction Models..." />;
  }

  if (error) {
    return <ErrorState error={error} onRetry={loadRiskData} />;
  }

  if (data.length === 0) {
    return <EmptyState title="No Risk Data" message="No supplier risk data available at this time." />;
  }

  return (
    <CinematicCard
      title="Partner Disruption Telemetry & Vulnerability Matrix"
      subtitle="Real-time multi-factor risk scores aggregating geopolitical, climate, port congestion, and financial signals"
      icon={<ShieldCheck size={18} color="#16A34A" />}
      glowColor="emerald"
      headerAction={<Badge variant="emerald">{data.length} Partner Nodes Monitored</Badge>}
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
              <th style={{ padding: '8px 10px' }}>Vendor Facility</th>
              <th style={{ padding: '8px 10px' }}>Region</th>
              <th style={{ padding: '8px 10px' }}>Geo Risk</th>
              <th style={{ padding: '8px 10px' }}>Port / Climate</th>
              <th style={{ padding: '8px 10px' }}>Lead Variance</th>
              <th style={{ padding: '8px 10px' }}>Risk Index</th>
              <th style={{ padding: '8px 10px' }}>Mitigation State</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => {
              let badgeColor: 'emerald' | 'amber' | 'rose' = 'emerald';
              let actionText = 'Normal Flow';
              
              if (row.risk_level === 'HIGH') {
                badgeColor = 'rose';
                actionText = 'High Alert / Reroute';
              } else if (row.risk_level === 'MEDIUM') {
                badgeColor = 'amber';
                actionText = 'Monitor / Buffer';
              }

              return (
                <tr
                  key={idx}
                  style={{
                    borderBottom: isLight ? '1px solid rgba(15, 23, 42, 0.04)' : '1px solid rgba(255, 255, 255, 0.04)',
                  }}
                >
                  <td style={{ padding: '10px 10px', fontWeight: 700, color: isLight ? '#0F172A' : '#F8FAFC' }}>
                    {row.supplier_id} (N/A)
                  </td>
                  <td style={{ padding: '10px 10px', color: '#94A3B8' }}>
                    N/A
                  </td>
                  <td style={{ padding: '10px 10px', color: isLight ? '#0F172A' : '#F8FAFC' }}>
                    N/A
                  </td>
                  <td style={{ padding: '10px 10px', color: '#64748B', fontWeight: 400 }}>
                    N/A ({Math.round(row.delay_probability * 100)}% Delay Prob)
                  </td>
                  <td style={{ padding: '10px 10px', color: '#94A3B8', fontFamily: "'JetBrains Mono', monospace" }}>
                    ±{row.predicted_delay_days} days
                  </td>
                  <td style={{ padding: '10px 10px', fontWeight: 800, color: row.risk_score > 30 ? '#F43F5E' : '#16A34A', fontFamily: "'JetBrains Mono', monospace" }}>
                    {Math.round(row.risk_score)} / 100
                  </td>
                  <td style={{ padding: '10px 10px' }}>
                    <Badge variant={badgeColor}>
                      {actionText}
                    </Badge>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </CinematicCard>
  );
};
