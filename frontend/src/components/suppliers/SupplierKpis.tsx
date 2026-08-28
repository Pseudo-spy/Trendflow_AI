import React from 'react';
import { MetricCard } from '../ui/MetricCard';
import { Users, ShieldCheck, ShieldAlert, AlertTriangle } from 'lucide-react';

interface SupplierKpisProps {
  totalCount: number;
  lowRiskCount: number;
  mediumRiskCount: number;
  highRiskCount: number;
}

export const SupplierKpis: React.FC<SupplierKpisProps> = ({
  totalCount,
  lowRiskCount,
  mediumRiskCount,
  highRiskCount,
}) => {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '16px',
        marginBottom: '28px',
      }}
    >
      <MetricCard
        label="Total Suppliers"
        value={totalCount}
        suffix=" vendors"
        decimals={0}
        icon={<Users size={16} />}
        glowColor="cyan"
      />

      <MetricCard
        label="Low Risk Suppliers"
        value={lowRiskCount}
        suffix=" vendors"
        decimals={0}
        statusBadge={{ label: 'Verified', variant: 'emerald' }}
        icon={<ShieldCheck size={16} />}
        glowColor="emerald"
      />

      <MetricCard
        label="Medium Risk Suppliers"
        value={mediumRiskCount}
        suffix=" vendors"
        decimals={0}
        statusBadge={{ label: 'Monitoring', variant: 'cyan' }}
        icon={<ShieldAlert size={16} />}
        glowColor="indigo"
      />

      <MetricCard
        label="High Risk Suppliers"
        value={highRiskCount}
        suffix=" vendors"
        decimals={0}
        statusBadge={{ label: 'Watchlist', variant: 'amber' }}
        icon={<AlertTriangle size={16} />}
        glowColor="amber"
      />
    </div>
  );
};
