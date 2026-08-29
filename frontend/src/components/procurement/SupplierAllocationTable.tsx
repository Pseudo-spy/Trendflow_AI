import React from 'react';
import { CinematicCard } from '../ui/CinematicCard';
import { Badge } from '../ui/Badge';
import { Cpu } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { type SupplierAllocationDetail } from '../../services/api/procurementApi';

import { EmptyState } from '../ui/States';

interface SupplierAllocationTableProps {
  data: SupplierAllocationDetail[] | null;
}

export const SupplierAllocationTable: React.FC<SupplierAllocationTableProps> = ({ data }) => {
  const { mode } = useTheme();
  const isLight = mode === 'light';

  return (
    <CinematicCard
      title="Supplier Allocation"
      subtitle="Current allocation by supplier."
      icon={<Cpu size={18} color="#6366F1" />}
      glowColor="indigo"
      headerAction={<Badge variant="cyan">Allocation Result</Badge>}
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
              <th style={{ padding: '8px 10px' }}>Supplier Name</th>
              <th style={{ padding: '8px 10px' }}>Quantity</th>
              <th style={{ padding: '8px 10px' }}>Allocation %</th>
              <th style={{ padding: '8px 10px' }}>Unit Price</th>
              <th style={{ padding: '8px 10px' }}>Allocated Cost</th>
              <th style={{ padding: '8px 10px' }}>Lead Time</th>
              <th style={{ padding: '8px 10px' }}>Risk Score</th>
            </tr>
          </thead>
          <tbody>
            {!data || data.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ padding: '40px 0' }}>
                  <EmptyState 
                    title="No supplier allocation available" 
                    message="Run procurement allocation to generate supplier breakdown."
                  />
                </td>
              </tr>
            ) : (
              data.map((row, idx) => {
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
                    <td style={{ padding: '10px 10px', fontWeight: 600, color: isLight ? '#475569' : '#94A3B8' }}>
                      {row.supplier_name || '—'}
                    </td>
                    <td style={{ padding: '10px 10px', fontWeight: 800, color: isLight ? '#0F172A' : '#F8FAFC', fontFamily: "'JetBrains Mono', monospace" }}>
                      {row.quantity?.toLocaleString() || '0'}
                    </td>
                    <td style={{ padding: '10px 10px', color: '#06B6D4', fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>
                      {row.percentage}%
                    </td>
                    <td style={{ padding: '10px 10px', color: isLight ? '#0F172A' : '#F8FAFC', fontWeight: 600, fontFamily: "'JetBrains Mono', monospace" }}>
                      {row.unit_price?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
                    </td>
                    <td style={{ padding: '10px 10px', color: '#16A34A', fontWeight: 800, fontFamily: "'JetBrains Mono', monospace" }}>
                      {row.total_cost?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
                    </td>
                    <td style={{ padding: '10px 10px', fontWeight: 600, color: isLight ? '#475569' : '#94A3B8' }}>
                      {row.lead_time_days !== undefined ? `${row.lead_time_days} days` : '—'}
                    </td>
                    <td style={{ padding: '10px 10px', color: row.risk_score > 0.5 ? '#F43F5E' : '#16A34A', fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>
                      {row.risk_score.toFixed(2)}
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
