import React from 'react';
import { MetricCard } from '../ui/MetricCard';
import { BarChart2, TrendingUp, Calendar, FileStack } from 'lucide-react';

interface DemandKpisProps {
  totalHistoryRecords: number;
  totalHistoryQuantity: number;
  totalForecastRecords: number;
  totalForecastQuantity: number;
}

export const DemandKpis: React.FC<DemandKpisProps> = ({
  totalHistoryRecords,
  totalHistoryQuantity,
  totalForecastRecords,
  totalForecastQuantity,
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
        label="Historical Records"
        value={totalHistoryRecords}
        suffix=" records"
        decimals={0}
        icon={<Calendar size={16} />}
        glowColor="cyan"
      />

      <MetricCard
        label="Total Historical Demand"
        value={totalHistoryQuantity}
        suffix=" units"
        decimals={0}
        icon={<BarChart2 size={16} />}
        glowColor="indigo"
      />

      <MetricCard
        label="Forecast Records"
        value={totalForecastRecords}
        suffix=" records"
        decimals={0}
        icon={<FileStack size={16} />}
        glowColor="emerald"
      />

      <MetricCard
        label="Total Forecast Quantity"
        value={totalForecastQuantity}
        suffix=" units"
        decimals={0}
        icon={<TrendingUp size={16} />}
        glowColor="amber"
      />
    </div>
  );
};
