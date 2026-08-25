import React from 'react';
import { MetricCard } from '../ui/MetricCard';
import {
  TrendingUp,
  Sparkles,
  Boxes,
  Layers,
  Cpu,
  DollarSign,
  ShieldCheck,
  Activity,
} from 'lucide-react';

export const ControlTowerKpis: React.FC = () => {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '16px',
        marginBottom: '28px',
      }}
    >
      {/* 1. Total Demand */}
      <MetricCard
        label="Total Demand"
        value={184200}
        suffix=" units"
        decimals={0}
        change={8.4}
        changeLabel="YoY growth"
        icon={<TrendingUp size={16} />}
        glowColor="cyan"
      />

      {/* 2. Forecast */}
      <MetricCard
        label="Forecast Projected"
        value={181800}
        suffix=" units"
        decimals={0}
        change={96.8}
        changeLabel="model accuracy"
        icon={<Sparkles size={16} />}
        glowColor="indigo"
      />

      {/* 3. Inventory */}
      <MetricCard
        label="Inventory Holding"
        value={3240000}
        prefix="$"
        decimals={0}
        change={14.2}
        changeLabel="days safety buffer"
        icon={<Boxes size={16} />}
        glowColor="emerald"
      />

      {/* 4. Material Requirement */}
      <MetricCard
        label="Material Requirement"
        value={248500}
        suffix=" kg"
        decimals={0}
        statusBadge={{ label: '99.1% Covered', variant: 'emerald' }}
        icon={<Layers size={16} />}
        glowColor="cyan"
      />

      {/* 5. Procurement Requirement */}
      <MetricCard
        label="Procurement Requirement"
        value={125000}
        suffix=" units"
        decimals={0}
        statusBadge={{ label: 'MILP Solved', variant: 'cyan' }}
        icon={<Cpu size={16} />}
        glowColor="indigo"
      />

      {/* 6. Procurement Cost */}
      <MetricCard
        label="Procurement Cost"
        value={4850000}
        prefix="$"
        decimals={0}
        change={-14.8}
        changeLabel="savings vs cap"
        icon={<DollarSign size={16} />}
        glowColor="emerald"
      />

      {/* 7. Supplier Risk */}
      <MetricCard
        label="Supplier Disruption Risk"
        value={18.4}
        suffix=" / 100"
        decimals={1}
        change={-4.2}
        changeLabel="low risk index"
        icon={<ShieldCheck size={16} />}
        glowColor="emerald"
      />

      {/* 8. Capacity Utilization */}
      <MetricCard
        label="Capacity Utilization"
        value={92.6}
        suffix="%"
        decimals={1}
        change={2.4}
        changeLabel="optimal load"
        icon={<Activity size={16} />}
        glowColor="cyan"
      />
    </div>
  );
};
