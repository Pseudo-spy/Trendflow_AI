import React, { useState, useEffect } from 'react';
import { useTheme } from '../../hooks/useTheme';
import { EmptyState } from '../ui/States';
import { type InventoryItem } from '../../services/api/inventoryApi';

interface InventoryTableProps {
  data: InventoryItem[];
}

export const InventoryTable: React.FC<InventoryTableProps> = ({ data }) => {
  const { mode } = useTheme();
  const isLight = mode === 'light';

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  useEffect(() => {
    setCurrentPage(1);
  }, [data]);

  const totalRecords = data.length;
  const totalPages = Math.max(1, Math.ceil(totalRecords / pageSize));
  
  // Safe bounds
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalRecords);
  
  const visibleData = data.slice(startIndex, startIndex + pageSize);

  const handlePrev = () => setCurrentPage((p) => Math.max(1, p - 1));
  const handleNext = () => setCurrentPage((p) => Math.min(totalPages, p + 1));

  return (
    <div
      style={{
        background: isLight
          ? 'linear-gradient(145deg, rgba(255, 255, 255, 0.9) 0%, rgba(241, 245, 249, 0.8) 100%)'
          : 'linear-gradient(145deg, rgba(15, 23, 42, 0.6) 0%, rgba(7, 12, 24, 0.8) 100%)',
        borderRadius: '16px',
        border: isLight ? '1px solid rgba(15, 23, 42, 0.1)' : '1px solid rgba(6, 182, 212, 0.15)',
        padding: '24px',
        marginTop: '24px',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h3 style={{ fontSize: '18px', fontWeight: 700, color: isLight ? '#0F172A' : '#F8FAFC' }}>
            Inventory Records
          </h3>
          <p style={{ fontSize: '13px', color: '#64748B', marginTop: '4px' }}>
            Stock on hand, reserved quantities, and calculated availability.
          </p>
        </div>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: isLight ? '1px solid rgba(15, 23, 42, 0.1)' : '1px solid rgba(255, 255, 255, 0.1)' }}>
              <th style={{ padding: '8px 12px', fontSize: '12px', color: '#94A3B8', fontWeight: 600 }}>SKU</th>
              <th style={{ padding: '8px 12px', fontSize: '12px', color: '#94A3B8', fontWeight: 600 }}>Location</th>
              <th style={{ padding: '8px 12px', fontSize: '12px', color: '#94A3B8', fontWeight: 600 }}>On Hand Quantity</th>
              <th style={{ padding: '8px 12px', fontSize: '12px', color: '#94A3B8', fontWeight: 600 }}>Reserved Quantity</th>
              <th style={{ padding: '8px 12px', fontSize: '12px', color: '#94A3B8', fontWeight: 600 }}>Available Quantity</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ padding: '40px 0' }}>
                  <EmptyState 
                    title="No inventory records available." 
                    message="There are currently no inventory items matching this filter."
                  />
                </td>
              </tr>
            ) : (
              visibleData.map((item, index) => {
                const available = (item.quantity || 0) - (item.reserved_quantity || 0);
                return (
                  <tr
                    key={item.id ?? index}
                    style={{
                      borderBottom: isLight ? '1px solid rgba(15, 23, 42, 0.05)' : '1px solid rgba(255, 255, 255, 0.05)',
                      transition: 'background 0.15s',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = isLight ? 'rgba(15, 23, 42, 0.02)' : 'rgba(255, 255, 255, 0.02)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    <td style={{ padding: '7px 12px', fontSize: '13px', fontWeight: 600, color: '#06B6D4', fontFamily: "'JetBrains Mono', monospace" }}>
                      {item.sku}
                    </td>
                    <td style={{ padding: '7px 12px', fontSize: '13px', color: isLight ? '#0F172A' : '#F8FAFC' }}>
                      {item.location}
                    </td>
                    <td style={{ padding: '7px 12px', fontSize: '13px', fontWeight: 500, color: isLight ? '#0F172A' : '#F8FAFC', fontFamily: "'JetBrains Mono', monospace" }}>
                      {item.quantity?.toLocaleString() ?? 0}
                    </td>
                    <td style={{ padding: '7px 12px', fontSize: '13px', color: '#F59E0B', fontFamily: "'JetBrains Mono', monospace" }}>
                      {item.reserved_quantity?.toLocaleString() ?? 0}
                    </td>
                    <td style={{ padding: '7px 12px', fontSize: '13px', fontWeight: 600, color: '#10B981', fontFamily: "'JetBrains Mono', monospace" }}>
                      {available.toLocaleString()}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {totalRecords > 0 && (
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: '16px',
          paddingTop: '16px',
          borderTop: isLight ? '1px solid rgba(15, 23, 42, 0.1)' : '1px solid rgba(255, 255, 255, 0.1)',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div style={{ fontSize: '12px', color: '#64748B' }}>
            Showing {startIndex + 1}–{endIndex} of {totalRecords.toLocaleString()}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '12px', color: '#64748B' }}>Rows per page:</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                style={{
                  background: 'transparent',
                  border: isLight ? '1px solid rgba(15,23,42,0.2)' : '1px solid rgba(255,255,255,0.2)',
                  color: isLight ? '#0F172A' : '#F8FAFC',
                  fontSize: '12px',
                  borderRadius: '4px',
                  padding: '2px 4px',
                  outline: 'none'
                }}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
              </select>
            </div>
            
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <button
                onClick={handlePrev}
                disabled={safeCurrentPage === 1}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: safeCurrentPage === 1 ? '#64748B' : (isLight ? '#0F172A' : '#F8FAFC'),
                  fontSize: '12px',
                  cursor: safeCurrentPage === 1 ? 'not-allowed' : 'pointer',
                  padding: '4px 8px'
                }}
              >
                Previous
              </button>
              <span style={{ fontSize: '12px', color: isLight ? '#0F172A' : '#F8FAFC', fontWeight: 600 }}>
                {safeCurrentPage} / {totalPages}
              </span>
              <button
                onClick={handleNext}
                disabled={safeCurrentPage === totalPages}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: safeCurrentPage === totalPages ? '#64748B' : (isLight ? '#0F172A' : '#F8FAFC'),
                  fontSize: '12px',
                  cursor: safeCurrentPage === totalPages ? 'not-allowed' : 'pointer',
                  padding: '4px 8px'
                }}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
