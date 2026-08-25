import React from 'react';
import { MetricCard } from '../ui/MetricCard';
import { ShieldCheck, Boxes, Activity, DollarSign, CheckCircle2 } from 'lucide-react';

export const SopKpis: React.FC = () => {
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
        label="Service Level Target"
        value={98.8}
        suffix="%"
        decimals={1}
        change={1.1}
        changeLabel="vs historical baseline"
        icon={<ShieldCheck size={16} />}
        glowColor="emerald"
      />

      <MetricCard
        label="Aggregate Supply Plan"
        value={184200}
        suffix=" units"
        decimals={0}
        statusBadge={{ label: '100% Demand Match', variant: 'cyan' }}
        icon={<Boxes size={16} />}
        glowColor="cyan"
      />

      <MetricCard
        label="Factory Line Utilization"
        value={92.6}
        suffix="%"
        decimals={1}
        change={2.4}
        changeLabel="optimal pacing"
        icon={<Activity size={16} />}
        glowColor="indigo"
      />

      <MetricCard
        label="Safety Buffer Capital"
        value={3240000}
        prefix="$"
        decimals={0}
        change={-6.2}
        changeLabel="holding reduction"
        icon={<DollarSign size={16} />}
        glowColor="emerald"
      />

      <MetricCard
        label="Stockout Vulnerability"
        value={0.8}
        suffix="%"
        decimals={1}
        statusBadge={{ label: 'Near Zero', variant: 'emerald' }}
        icon={<CheckCircle2 size={16} />}
        glowColor="emerald"
      />
    </div>
  );
};
