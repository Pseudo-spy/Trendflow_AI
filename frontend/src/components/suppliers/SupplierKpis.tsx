import React from 'react';
import { MetricCard } from '../ui/MetricCard';
import { Users, CheckCircle2, Clock, Leaf } from 'lucide-react';

export const SupplierKpis: React.FC = () => {
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
        label="Active Tier-1 Suppliers"
        value={18}
        suffix=" vendors"
        decimals={0}
        statusBadge={{ label: '100% Audited', variant: 'cyan' }}
        icon={<Users size={16} />}
        glowColor="cyan"
      />

      <MetricCard
        label="Network OTIF Delivery Rate"
        value={97.4}
        suffix="%"
        decimals={1}
        change={2.1}
        changeLabel="YoY performance"
        icon={<CheckCircle2 size={16} />}
        glowColor="emerald"
      />

      <MetricCard
        label="Average Transit Lead Time"
        value={6.4}
        suffix=" days"
        decimals={1}
        change={-1.2}
        changeLabel="lead time reduction"
        icon={<Clock size={16} />}
        glowColor="indigo"
      />

      <MetricCard
        label="Average ESG Sustainability"
        value={92.8}
        suffix=" / 100"
        decimals={1}
        statusBadge={{ label: 'Gold Standard', variant: 'emerald' }}
        icon={<Leaf size={16} />}
        glowColor="emerald"
      />
    </div>
  );
};
