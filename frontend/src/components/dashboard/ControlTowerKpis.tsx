import React from 'react';
import { motion } from 'framer-motion';
import { Package, TrendingUp, Anchor, Activity, Clock, FileText, AlertTriangle, Cpu } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import type { DashboardData } from '../../hooks/useDashboardData';
import type { AppOutletContext } from '../../layouts/AppLayout';

interface ControlTowerKpisProps {
  data?: DashboardData | null;
  sessionContext?: AppOutletContext;
}

export const ControlTowerKpis: React.FC<ControlTowerKpisProps> = ({ data, sessionContext }) => {
  const { mode } = useTheme();
  const isLight = mode === 'light';

  // Calculate actual aggregates
  const totalHistoricalDemand = data?.demandHistory?.reduce((acc, curr) => acc + curr.quantity_sold, 0) || 0;
  const totalForecastDemand = data?.demandForecast?.reduce((acc, curr) => acc + curr.forecast_quantity, 0) || 0;
  const productsCount = data?.products?.length || 0;
  const suppliersCount = data?.suppliers?.length || 0;
  
  const latestSopQty = sessionContext?.latestSopResult?.required_quantity;
  const latestProcQty = sessionContext?.latestProcurementResult?.total_allocated;
  const latestRiskScore = sessionContext?.latestRiskResult?.risk_score;
  const latestScenarioCost = sessionContext?.latestScenarioResult?.scenario_cost;

  const kpis = [
    {
      label: 'Products Catalog',
      value: productsCount.toLocaleString(),
      subLabel: 'Total active products',
      icon: <Package size={18} color="#06B6D4" />,
      delay: 0.1,
    },
    {
      label: 'Supplier Network',
      value: suppliersCount.toLocaleString(),
      subLabel: 'Active partners',
      icon: <Anchor size={18} color="#6366F1" />,
      delay: 0.2,
    },
    {
      label: 'Historical Demand',
      value: totalHistoricalDemand > 0 ? `${(totalHistoricalDemand / 1000).toFixed(1)}k` : '—',
      subLabel: 'Units sold',
      icon: <Clock size={18} color="#10B981" />,
      delay: 0.3,
    },
    {
      label: 'Forecast Demand',
      value: totalForecastDemand > 0 ? `${(totalForecastDemand / 1000).toFixed(1)}k` : '—',
      subLabel: 'Projected units',
      icon: <TrendingUp size={18} color="#8B5CF6" />,
      delay: 0.4,
    },
    {
      label: 'Latest S&OP Plan',
      value: latestSopQty ? `${(latestSopQty / 1000).toFixed(1)}k u` : 'Not run',
      subLabel: 'Req. Quantity',
      icon: <FileText size={18} color="#06B6D4" />,
      delay: 0.5,
    },
    {
      label: 'Procurement Allocation',
      value: latestProcQty ? `${(latestProcQty / 1000).toFixed(1)}k u` : 'Not run',
      subLabel: 'Total Allocated',
      icon: <Cpu size={18} color="#6366F1" />,
      delay: 0.6,
    },
    {
      label: 'Latest Scenario Cost',
      value: latestScenarioCost ? `$${(latestScenarioCost / 1000000).toFixed(2)}M` : 'Not run',
      subLabel: 'Estimated Cost',
      icon: <Activity size={18} color="#F59E0B" />,
      delay: 0.7,
    },
    {
      label: 'Latest Risk Score',
      value: latestRiskScore !== undefined ? latestRiskScore.toFixed(1) : 'Not run',
      subLabel: 'Disruption risk',
      icon: <AlertTriangle size={18} color="#F43F5E" />,
      delay: 0.8,
    },
  ];

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '12px',
        marginBottom: '20px',
      }}
    >
      {kpis.map((kpi, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: kpi.delay, ease: 'easeOut' }}
          style={{
            background: isLight ? 'rgba(255, 255, 255, 0.7)' : 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(10px)',
            borderRadius: '12px',
            border: isLight ? '1px solid rgba(15, 23, 42, 0.08)' : '1px solid rgba(255, 255, 255, 0.08)',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <div
              style={{
                padding: '6px',
                borderRadius: '8px',
                background: isLight ? 'rgba(15, 23, 42, 0.04)' : 'rgba(255, 255, 255, 0.04)',
              }}
            >
              {kpi.icon}
            </div>
            <span style={{ fontSize: '11px', fontWeight: 600, color: isLight ? '#475569' : '#94A3B8' }}>
              {kpi.label}
            </span>
          </div>

          <div>
            <div
              style={{
                fontSize: '22px',
                fontWeight: 700,
                color: isLight ? '#0F172A' : '#F8FAFC',
                fontFamily: "'JetBrains Mono', monospace",
                letterSpacing: '-0.5px',
              }}
            >
              {kpi.value}
            </div>
            <div style={{ fontSize: '10px', color: '#64748B', marginTop: '4px' }}>
              {kpi.subLabel}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};
