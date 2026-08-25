import React, { useState, useEffect } from 'react';
import { CinematicCard } from '../ui/CinematicCard';
import { Badge } from '../ui/Badge';
import { Layers } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { runSopEngine, type MaterialRequirementContract } from '../../services/api/sopApi';
import { LoadingState, ErrorState, EmptyState } from '../ui/States';

export const BomExplosionModule: React.FC = () => {
  const { mode } = useTheme();
  const isLight = mode === 'light';
  
  const [data, setData] = useState<MaterialRequirementContract | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await runSopEngine({ sku: 'TW001', target_date: '2026-10-15' });
      setData(res);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch BOM data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const handleSopRun = () => loadData();
    window.addEventListener('sop-run-completed', handleSopRun);
    return () => window.removeEventListener('sop-run-completed', handleSopRun);
  }, []);

  if (loading) return <LoadingState message="Exploding Bill of Materials..." />;
  if (error) return <ErrorState error={error} onRetry={loadData} />;
  if (!data) return <EmptyState title="No BOM Data" message="Run the S&OP engine to view requirements." />;

  return (
    <CinematicCard
      title="Material Requirements (BOM Explosion)"
      subtitle="Exploded raw material requirements derived from Master Production Schedule production runs"
      icon={<Layers size={18} color="#06B6D4" />}
      glowColor="cyan"
      headerAction={<Badge variant="cyan">99.1% Coverage</Badge>}
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
              <th style={{ padding: '8px 10px' }}>BOM Component</th>
              <th style={{ padding: '8px 10px' }}>Unit Usage</th>
              <th style={{ padding: '8px 10px' }}>Gross Req.</th>
              <th style={{ padding: '8px 10px' }}>On-Hand Stock</th>
              <th style={{ padding: '8px 10px' }}>Net Shortage</th>
              <th style={{ padding: '8px 10px' }}>Procurement Sync</th>
            </tr>
          </thead>
          <tbody>
              <tr
                style={{
                  borderBottom: isLight ? '1px solid rgba(15, 23, 42, 0.04)' : '1px solid rgba(255, 255, 255, 0.04)',
                }}
              >
                <td style={{ padding: '10px 10px', fontWeight: 700, color: isLight ? '#0F172A' : '#F8FAFC' }}>
                  {data.material_id}
                </td>
                <td style={{ padding: '10px 10px', color: '#94A3B8', fontFamily: "'JetBrains Mono', monospace" }}>
                  N/A
                </td>
                <td style={{ padding: '10px 10px', color: isLight ? '#0F172A' : '#F8FAFC', fontFamily: "'JetBrains Mono', monospace" }}>
                  {data.required_quantity.toLocaleString()}
                </td>
                <td style={{ padding: '10px 10px', color: '#94A3B8', fontFamily: "'JetBrains Mono', monospace" }}>
                  N/A
                </td>
                <td style={{ padding: '10px 10px', color: '#F43F5E', fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>
                  N/A
                </td>
                <td style={{ padding: '10px 10px' }}>
                  <Badge variant={data.priority === 'HIGH' ? 'rose' : 'cyan'}>
                    {data.plant_id} ({data.priority})
                  </Badge>
                </td>
              </tr>
          </tbody>
        </table>
      </div>
    </CinematicCard>
  );
};
