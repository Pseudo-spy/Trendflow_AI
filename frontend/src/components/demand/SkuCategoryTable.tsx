import React, { useState, useEffect } from 'react';
import { CinematicCard } from '../ui/CinematicCard';
import { Badge } from '../ui/Badge';
import { EmptyState } from '../ui/States';
import { Calendar } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { type DemandHistoryItem } from '../../services/api/demandApi';

interface DemandHistoryTableProps {
  data: DemandHistoryItem[];
}

export const DemandHistoryTable: React.FC<DemandHistoryTableProps> = ({ data }) => {
  const { mode } = useTheme();
  const isLight = mode === 'light';

  const formatDate = (dateStr: string): string => {
    try {
      return new Date(dateStr).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  const formatPercent = (val: number | null | undefined): string => {
    if (val == null) return '—';
    return `${val.toFixed(1)}%`;
  };

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  // Reset page when dataset changes (e.g. from filtering)
  useEffect(() => {
    setCurrentPage(1);
  }, [data]);

  const totalRecords = data.length;
  const totalPages = Math.ceil(totalRecords / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const visibleRecords = data.slice(startIndex, startIndex + pageSize);

  return (
    <CinematicCard
      title="Historical Demand"
      subtitle="Recorded demand history from backend"
      icon={<Calendar size={18} color="#06B6D4" />}
      glowColor="cyan"
      headerAction={<Badge variant="cyan">{data.length} Records</Badge>}
    >
      <div style={{ overflowX: 'auto' }}>
        {data.length === 0 ? (
          <EmptyState title="No History Data" message="No historical demand records available." />
        ) : (
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
                <th style={{ padding: '8px 12px' }}>SKU</th>
                <th style={{ padding: '8px 12px' }}>Demand Date</th>
                <th style={{ padding: '8px 12px' }}>Quantity Sold</th>
                <th style={{ padding: '8px 12px' }}>Promotion</th>
                <th style={{ padding: '8px 12px' }}>Markdown %</th>
                <th style={{ padding: '8px 12px' }}>Sell-through Rate</th>
              </tr>
            </thead>
            <tbody>
              {visibleRecords.map((item, idx) => (
                <tr
                  key={`${item.sku}-${item.demand_date}-${idx}`}
                  style={{
                    borderBottom: isLight
                      ? '1px solid rgba(15, 23, 42, 0.04)'
                      : '1px solid rgba(255, 255, 255, 0.04)',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={e =>
                    (e.currentTarget.style.background = isLight
                      ? 'rgba(15, 23, 42, 0.02)'
                      : 'rgba(255, 255, 255, 0.02)')
                  }
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <td style={{ padding: '7px 12px', fontWeight: 800, color: '#06B6D4', fontFamily: "'JetBrains Mono', monospace" }}>
                    {item.sku}
                  </td>
                  <td style={{ padding: '7px 12px', color: isLight ? '#0F172A' : '#F8FAFC' }}>
                    {formatDate(item.demand_date)}
                  </td>
                  <td style={{ padding: '7px 12px', fontWeight: 700, color: isLight ? '#0F172A' : '#F8FAFC', fontFamily: "'JetBrains Mono', monospace" }}>
                    {item.quantity_sold.toLocaleString()}
                  </td>
                  <td style={{ padding: '7px 12px' }}>
                    {item.promotion ? (
                      <Badge variant="emerald">Yes</Badge>
                    ) : (
                      <Badge variant="muted">No</Badge>
                    )}
                  </td>
                  <td style={{ padding: '7px 12px', color: '#94A3B8', fontFamily: "'JetBrains Mono', monospace" }}>
                    {item.markdown_percentage != null ? `${item.markdown_percentage}%` : '—'}
                  </td>
                  <td style={{ padding: '7px 12px', color: '#16A34A', fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>
                    {formatPercent(item.sell_through_rate)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination Controls */}
      {data.length > 0 && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', padding: '0 8px', fontSize: '13px', color: '#64748B', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            Showing {Math.min(startIndex + 1, totalRecords)}–{Math.min(startIndex + pageSize, totalRecords)} of {totalRecords.toLocaleString()}
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>Rows per page:</span>
              <select 
                value={pageSize} 
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                style={{
                  background: isLight ? '#F1F5F9' : 'rgba(15, 23, 42, 0.4)',
                  border: isLight ? '1px solid #E2E8F0' : '1px solid rgba(255, 255, 255, 0.1)',
                  color: isLight ? '#0F172A' : '#F8FAFC',
                  padding: '4px 8px',
                  borderRadius: '6px',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
              </select>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                style={{ cursor: currentPage === 1 ? 'not-allowed' : 'pointer', background: 'transparent', border: 'none', padding: '4px', color: currentPage === 1 ? '#475569' : '#06B6D4', fontWeight: 600 }}
              >
                Previous
              </button>
              
              <span style={{ color: isLight ? '#0F172A' : '#F8FAFC', fontWeight: 500, fontFamily: "'JetBrains Mono', monospace" }}>
                {currentPage} / {Math.max(1, totalPages)}
              </span>
              
              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages || totalPages === 0}
                style={{ cursor: currentPage === totalPages || totalPages === 0 ? 'not-allowed' : 'pointer', background: 'transparent', border: 'none', padding: '4px', color: currentPage === totalPages || totalPages === 0 ? '#475569' : '#06B6D4', fontWeight: 600 }}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </CinematicCard>
  );
};
