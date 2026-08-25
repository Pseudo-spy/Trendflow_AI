import React from 'react';
import { Modal } from '../ui/Modal';
import { Badge } from '../ui/Badge';
import { GlowButton } from '../ui/GlowButton';
import { CheckCircle2, ShieldCheck, FileText, MapPin, ExternalLink } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

export interface SupplierDetailData {
  id: string;
  name: string;
  category: string;
  location: string;
  country: string;
  otif: number;
  defectRate: string;
  leadTime: string;
  capacity: number;
  riskScore: number;
  esgScore: number;
  certifications: string[];
  activePoCount: number;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  moqTiers: { tier: string; moq: string; unitPrice: string; discount: string }[];
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
      maxWidth="lg"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Header Metadata */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MapPin size={14} color="#06B6D4" />
            <span style={{ fontSize: '13px', color: '#94A3B8' }}>
              {supplier.location}, {supplier.country}
            </span>
            <Badge variant="cyan">{supplier.category}</Badge>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Badge variant={supplier.riskScore > 30 ? 'amber' : 'emerald'}>
              Risk Score: {supplier.riskScore}/100
            </Badge>
          </div>
        </div>

        {/* 4-Metric Performance Scorecard */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
          <div style={{ padding: '12px', borderRadius: '10px', background: isLight ? 'rgba(15, 23, 42, 0.04)' : 'rgba(255, 255, 255, 0.04)' }}>
            <div style={{ fontSize: '10px', color: '#64748B' }}>OTIF Delivery</div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: '#16A34A', fontFamily: "'JetBrains Mono', monospace" }}>
              {supplier.otif}%
            </div>
          </div>
          <div style={{ padding: '12px', borderRadius: '10px', background: isLight ? 'rgba(15, 23, 42, 0.04)' : 'rgba(255, 255, 255, 0.04)' }}>
            <div style={{ fontSize: '10px', color: '#64748B' }}>Defect Rate</div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: '#06B6D4', fontFamily: "'JetBrains Mono', monospace" }}>
              {supplier.defectRate}
            </div>
          </div>
          <div style={{ padding: '12px', borderRadius: '10px', background: isLight ? 'rgba(15, 23, 42, 0.04)' : 'rgba(255, 255, 255, 0.04)' }}>
            <div style={{ fontSize: '10px', color: '#64748B' }}>Lead Time</div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: '#6366F1', fontFamily: "'JetBrains Mono', monospace" }}>
              {supplier.leadTime}
            </div>
          </div>
          <div style={{ padding: '12px', borderRadius: '10px', background: isLight ? 'rgba(15, 23, 42, 0.04)' : 'rgba(255, 255, 255, 0.04)' }}>
            <div style={{ fontSize: '10px', color: '#64748B' }}>ESG Rating</div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: '#16A34A', fontFamily: "'JetBrains Mono', monospace" }}>
              {supplier.esgScore}/100
            </div>
          </div>
        </div>

        {/* MOQ & Tier Price Breaks */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <FileText size={15} color="#06B6D4" />
            <h4 style={{ fontSize: '13px', fontWeight: 700, color: isLight ? '#0F172A' : '#F8FAFC' }}>
              Contracted MOQ Tier Pricing
            </h4>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px' }}>
              <thead>
                <tr style={{ borderBottom: isLight ? '1px solid rgba(15, 23, 42, 0.1)' : '1px solid rgba(255, 255, 255, 0.08)', color: '#64748B', textAlign: 'left' }}>
                  <th style={{ padding: '6px 8px' }}>Tier Bracket</th>
                  <th style={{ padding: '6px 8px' }}>Minimum Order</th>
                  <th style={{ padding: '6px 8px' }}>Landed Unit Price</th>
                  <th style={{ padding: '6px 8px' }}>Volume Discount</th>
                </tr>
              </thead>
              <tbody>
                {supplier.moqTiers.map((tier, idx) => (
                  <tr key={idx} style={{ borderBottom: isLight ? '1px solid rgba(15, 23, 42, 0.04)' : '1px solid rgba(255, 255, 255, 0.04)' }}>
                    <td style={{ padding: '8px 8px', fontWeight: 700, color: isLight ? '#0F172A' : '#F8FAFC' }}>{tier.tier}</td>
                    <td style={{ padding: '8px 8px', color: '#94A3B8', fontFamily: "'JetBrains Mono', monospace" }}>{tier.moq}</td>
                    <td style={{ padding: '8px 8px', color: '#16A34A', fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>{tier.unitPrice}</td>
                    <td style={{ padding: '8px 8px', color: '#06B6D4', fontWeight: 700 }}>{tier.discount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Certifications & Compliance Badges */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <ShieldCheck size={15} color="#16A34A" />
            <h4 style={{ fontSize: '13px', fontWeight: 700, color: isLight ? '#0F172A' : '#F8FAFC' }}>
              Audited Certifications & Standards
            </h4>
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {supplier.certifications.map((cert, idx) => (
              <Badge key={idx} variant="emerald">
                <CheckCircle2 size={11} style={{ marginRight: '4px' }} />
                {cert}
              </Badge>
            ))}
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
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div>
            <div style={{ fontSize: '11px', color: '#64748B' }}>Primary Vendor Contact</div>
            <div style={{ fontSize: '13px', fontWeight: 700, color: isLight ? '#0F172A' : '#F8FAFC' }}>
              {supplier.contactName}
            </div>
            <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '2px', display: 'flex', gap: '12px' }}>
              <span>{supplier.contactEmail}</span>
              <span>{supplier.contactPhone}</span>
            </div>
          </div>
          <GlowButton variant="primary" size="sm" icon={<ExternalLink size={13} />} disabled={true}>
            EDI Portal (Pending)
          </GlowButton>
        </div>
      </div>
    </Modal>
  );
};
