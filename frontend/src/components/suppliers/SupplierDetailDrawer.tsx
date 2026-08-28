import React from 'react';
import { Modal } from '../ui/Modal';
import { Badge } from '../ui/Badge';
import { MapPin, ShieldAlert, ShieldCheck } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

export interface SupplierDetailData {
  id: string;
  name: string;
  location: string;
  riskLevel: string;
}

interface SupplierDetailDrawerProps {
  supplier: SupplierDetailData | null;
  isOpen: boolean;
  onClose: () => void;
}

export const SupplierDetailDrawer: React.FC<SupplierDetailDrawerProps> = ({
  supplier,
  isOpen,
  onClose,
}) => {
  const { mode } = useTheme();
  const isLight = mode === 'light';

  if (!supplier) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={supplier.name}
      maxWidth="md"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Header Metadata */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MapPin size={14} color="#06B6D4" />
            <span style={{ fontSize: '13px', color: '#94A3B8' }}>
              {supplier.location}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Badge variant={supplier.riskLevel === 'HIGH' ? 'amber' : (supplier.riskLevel === 'MEDIUM' ? 'cyan' : 'emerald')}>
              Risk Level: {supplier.riskLevel}
            </Badge>
          </div>
        </div>

        {/* Basic Scorecard */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(1, 1fr)', gap: '12px' }}>
          <div style={{ padding: '16px', borderRadius: '10px', background: isLight ? 'rgba(15, 23, 42, 0.04)' : 'rgba(255, 255, 255, 0.04)', display: 'flex', alignItems: 'center', gap: '12px' }}>
            {supplier.riskLevel === 'HIGH' ? (
              <ShieldAlert size={24} color="#F59E0B" />
            ) : (
              <ShieldCheck size={24} color={supplier.riskLevel === 'MEDIUM' ? '#06B6D4' : '#16A34A'} />
            )}
            <div>
              <div style={{ fontSize: '12px', color: '#64748B' }}>Supplier Status</div>
              <div style={{ fontSize: '16px', fontWeight: 800, color: supplier.riskLevel === 'HIGH' ? '#F59E0B' : (supplier.riskLevel === 'MEDIUM' ? '#06B6D4' : '#16A34A') }}>
                {supplier.riskLevel === 'HIGH' ? 'Watchlist' : (supplier.riskLevel === 'MEDIUM' ? 'Monitoring' : 'Verified')}
              </div>
            </div>
          </div>
        </div>

        {/* Operations Contact */}
        <div
          style={{
            padding: '12px 14px',
            borderRadius: '10px',
            background: isLight ? 'rgba(2, 132, 199, 0.04)' : 'rgba(6, 182, 212, 0.04)',
            border: isLight ? '1px solid rgba(2, 132, 199, 0.15)' : '1px solid rgba(6, 182, 212, 0.15)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <div>
            <div style={{ fontSize: '11px', color: '#64748B' }}>Supplier ID</div>
            <div style={{ fontSize: '13px', fontWeight: 700, color: isLight ? '#0F172A' : '#F8FAFC', fontFamily: "'JetBrains Mono', monospace" }}>
              {supplier.id}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
