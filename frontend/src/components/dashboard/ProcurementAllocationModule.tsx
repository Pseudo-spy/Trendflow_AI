import React from 'react';
import { CinematicCard } from '../ui/CinematicCard';
import { Badge } from '../ui/Badge';
import { Cpu } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { type OptimizationResponse } from '../../services/api/procurementApi';

interface ProcurementAllocationModuleProps {
  latestProcurementResult?: OptimizationResponse | null;
}

export const ProcurementAllocationModule: React.FC<ProcurementAllocationModuleProps> = ({ latestProcurementResult }) => {
  const { mode } = useTheme();
  const isLight = mode === 'light';

  return (
    <CinematicCard
      title="Procurement Volume Allocation"
      subtitle="Latest procurement optimization run results."
      icon={<Cpu size={18} color="#6366F1" />}
      glowColor="indigo"
      headerAction={<Badge variant="indigo">Latest Procurement</Badge>}
    >
      {!latestProcurementResult ? (
        <div style={{ padding: '24px', textAlign: 'center', color: '#64748B', fontSize: '13px' }}>
          No procurement allocation run this session.
        </div>
      ) : (
        <div style={{ marginTop: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', background: isLight ? 'rgba(99, 102, 241, 0.05)' : 'rgba(99, 102, 241, 0.1)', padding: '12px', borderRadius: '8px' }}>
             <div>
               <div style={{ fontSize: '10px', color: '#64748B' }}>Total Allocated</div>
               <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#6366F1' }}>{latestProcurementResult.total_allocated.toLocaleString()}</div>
             </div>
             <div>
               <div style={{ fontSize: '10px', color: '#64748B' }}>Total Cost</div>
               <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#F59E0B' }}>${latestProcurementResult.total_cost.toLocaleString()}</div>
             </div>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: isLight ? '1px solid rgba(15, 23, 42, 0.1)' : '1px solid rgba(255, 255, 255, 0.1)', textAlign: 'left', color: isLight ? '#64748B' : '#94A3B8', fontSize: '11px', textTransform: 'uppercase' }}>
                <th style={{ padding: '8px 4px' }}>Supplier ID</th>
                <th style={{ padding: '8px 4px' }}>Allocated Qty</th>
                <th style={{ padding: '8px 4px' }}>Unit Price</th>
              </tr>
            </thead>
            <tbody>
              {latestProcurementResult.allocation.map((alloc, idx) => (
                <tr key={idx} style={{ borderBottom: isLight ? '1px solid rgba(15, 23, 42, 0.05)' : '1px solid rgba(255, 255, 255, 0.05)' }}>
                  <td style={{ padding: '12px 4px', fontSize: '12px', fontWeight: 600, color: isLight ? '#0F172A' : '#F8FAFC' }}>
                    {alloc.supplier_id}
                  </td>
                  <td style={{ padding: '12px 4px', fontSize: '12px', color: isLight ? '#334155' : '#CBD5E1', fontFamily: "'JetBrains Mono', monospace" }}>
                    {alloc.quantity.toLocaleString()}
                  </td>
                  <td style={{ padding: '12px 4px', fontSize: '12px', color: isLight ? '#334155' : '#CBD5E1' }}>
                    ${alloc.unit_price.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </CinematicCard>
  );
};
