import React from 'react';
import { MetricCard } from '../ui/MetricCard';
import { ShieldAlert, AlertTriangle, ShieldCheck, RefreshCw } from 'lucide-react';

export const RiskKpis: React.FC = () => {
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
        label="Composite Disruption Index"
        value={18.4}
        suffix=" / 100"
        decimals={1}
        statusBadge={{ label: 'Low Overall Risk', variant: 'emerald' }}
        icon={<ShieldCheck size={16} />}
        glowColor="emerald"
      />

      <MetricCard
        label="High-Risk Watchlist Nodes"
        value={1}
        suffix=" vendor"
        decimals={0}
        change={0}
        changeLabel="Hanoi (Weather)"
        icon={<AlertTriangle size={16} />}
        glowColor="amber"
      />

      <MetricCard
        label="Monitored Early Threats"
        value={3}
        suffix=" signals"
        decimals={0}
        statusBadge={{ label: 'Active Scanning', variant: 'cyan' }}
        icon={<ShieldAlert size={16} />}
        glowColor="cyan"
      />

      <MetricCard
        label="Auto-Protected Order Value"
        value={1240000}
        prefix="$"
        decimals={0}
        change={100}
        changeLabel="buffer rerouted"
        icon={<RefreshCw size={16} />}
        glowColor="emerald"
      />
    </div>
  );
};
