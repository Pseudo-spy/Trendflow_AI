import React from 'react';
import { CinematicCard } from '../ui/CinematicCard';
import { Badge } from '../ui/Badge';
import { Activity } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { type InventoryItem } from '../../services/api/inventoryApi';

interface SopHealthModuleProps {
  inventory?: InventoryItem[];
}

export const SopHealthModule: React.FC<SopHealthModuleProps> = ({ inventory = [] }) => {
  const { mode } = useTheme();
  const isLight = mode === 'light';

  return (
    <CinematicCard
      title="Inventory Overview"
      subtitle="Current backend inventory snapshot"
      icon={<Activity size={18} color="#10B981" />}
      glowColor="emerald"
      headerAction={<Badge variant="emerald">Inventory Data</Badge>}
    >
      <div style={{ marginTop: '12px' }}>
        {inventory.length === 0 ? (
          <div style={{ padding: '24px', textAlign: 'center', color: '#64748B', fontSize: '13px' }}>
            No inventory data available from backend
          </div>
        ) : (
          <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: isLight ? '1px solid rgba(15, 23, 42, 0.1)' : '1px solid rgba(255, 255, 255, 0.1)', textAlign: 'left', color: isLight ? '#64748B' : '#94A3B8', fontSize: '11px', textTransform: 'uppercase' }}>
                  <th style={{ padding: '8px 4px' }}>Location</th>
                  <th style={{ padding: '8px 4px' }}>SKU</th>
                  <th style={{ padding: '8px 4px' }}>On Hand</th>
                </tr>
              </thead>
              <tbody>
                {inventory.slice(0, 5).map((item, idx) => (
                  <tr key={idx} style={{ borderBottom: isLight ? '1px solid rgba(15, 23, 42, 0.05)' : '1px solid rgba(255, 255, 255, 0.05)' }}>
                    <td style={{ padding: '10px 4px', fontSize: '12px', fontWeight: 600, color: isLight ? '#0F172A' : '#F8FAFC' }}>
                      {item.location}
                    </td>
                    <td style={{ padding: '10px 4px', fontSize: '12px', color: isLight ? '#334155' : '#CBD5E1' }}>
                      {item.sku}
                    </td>
                    <td style={{ padding: '10px 4px', fontSize: '12px', color: isLight ? '#334155' : '#CBD5E1', fontFamily: "'JetBrains Mono', monospace" }}>
                      {item.quantity.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {inventory.length > 5 && (
              <div style={{ textAlign: 'center', padding: '8px', fontSize: '11px', color: '#64748B' }}>
                Showing 5 of {inventory.length} records
              </div>
            )}
          </div>
        )}
      </div>
    </CinematicCard>
  );
};
