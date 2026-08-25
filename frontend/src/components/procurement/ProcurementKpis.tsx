import React from 'react';
import { MetricCard } from '../ui/MetricCard';
import { DollarSign, Cpu, CheckCircle2 } from 'lucide-react';

export const ProcurementKpis: React.FC = () => {
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
        label="Total Procurement Spend"
        value={4850000}
        prefix="$"
        decimals={0}
        change={-14.8}
        changeLabel="cost optimized"
        icon={<DollarSign size={16} />}
        glowColor="cyan"
      />

      <MetricCard
        label="Net Optimization Savings"
        value={482500}
        prefix="+$"
        decimals={0}
        change={18.5}
        changeLabel="vs unoptimized baseline"
        icon={<DollarSign size={16} />}
        glowColor="emerald"
      />

      <MetricCard
        label="Allocated Purchase Volume"
        value={125000}
        suffix=" units"
        decimals={0}
        statusBadge={{ label: '100% Allocated', variant: 'cyan' }}
        icon={<CheckCircle2 size={16} />}
        glowColor="indigo"
      />

      <MetricCard
        label="Google OR-Tools Latency"
        value={842}
        suffix=" ms"
        decimals={0}
        statusBadge={{ label: 'Global Minimum', variant: 'emerald' }}
        icon={<Cpu size={16} />}
        glowColor="cyan"
      />
    </div>
  );
};
