import React from 'react';
import { MetricCard } from '../ui/MetricCard';
import { TrendingUp, Sparkles, ShieldCheck, Sun, Sliders } from 'lucide-react';

export const DemandKpis: React.FC = () => {
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
        label="Projected Q3 Demand"
        value={184200}
        suffix=" units"
        decimals={0}
        change={8.4}
        changeLabel="YoY growth"
        icon={<TrendingUp size={16} />}
        glowColor="cyan"
      />

      <MetricCard
        label="Model Forecast Accuracy"
        value={96.8}
        suffix="%"
        decimals={1}
        change={3.2}
        changeLabel="MAPE score"
        icon={<Sparkles size={16} />}
        glowColor="indigo"
      />

      <MetricCard
        label="Model Confidence Index"
        value={94.5}
        suffix="%"
        decimals={1}
        statusBadge={{ label: 'High Confidence', variant: 'emerald' }}
        icon={<ShieldCheck size={16} />}
        glowColor="emerald"
      />

      <MetricCard
        label="Seasonality Surge Lift"
        value={12.4}
        prefix="+"
        suffix="%"
        decimals={1}
        changeLabel="Summer peak index"
        icon={<Sun size={16} />}
        glowColor="amber"
      />

      <MetricCard
        label="Monitored SKU Lines"
        value={48}
        suffix=" clusters"
        decimals={0}
        statusBadge={{ label: 'Synchronized', variant: 'cyan' }}
        icon={<Sliders size={16} />}
        glowColor="cyan"
      />
    </div>
  );
};
