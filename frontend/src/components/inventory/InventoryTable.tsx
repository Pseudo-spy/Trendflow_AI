import React from 'react';
import { useTheme } from '../../hooks/useTheme';
import { EmptyState } from '../ui/States';

export const InventoryTable: React.FC = () => {
  const { mode } = useTheme();
  const isLight = mode === 'light';

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
            Multi-Echelon Inventory
          </h3>
          <p style={{ fontSize: '13px', color: '#64748B', marginTop: '4px' }}>
            Current stock vs projected demand
          </p>
        </div>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: isLight ? '1px solid rgba(15, 23, 42, 0.1)' : '1px solid rgba(255, 255, 255, 0.1)' }}>
              <th style={{ padding: '12px 16px', fontSize: '12px', color: '#94A3B8', fontWeight: 600 }}>Product / SKU</th>
              <th style={{ padding: '12px 16px', fontSize: '12px', color: '#94A3B8', fontWeight: 600 }}>Current Stock</th>
              <th style={{ padding: '12px 16px', fontSize: '12px', color: '#94A3B8', fontWeight: 600 }}>Demand</th>
              <th style={{ padding: '12px 16px', fontSize: '12px', color: '#94A3B8', fontWeight: 600 }}>Shortage</th>
              <th style={{ padding: '12px 16px', fontSize: '12px', color: '#94A3B8', fontWeight: 600 }}>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={5} style={{ padding: '40px 0' }}>
                <EmptyState 
                  title="No inventory data available" 
                  message="Backend connection pending. Inventory records will appear here once the API is integrated."
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
