import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CinematicCard } from '../ui/CinematicCard';
import { Badge } from '../ui/Badge';
import { BASELINE_OUTCOME } from '../../types/scenario';
import type { ScenarioRunResponse } from '../../services/api/scenarioApi';
import { TrendingUp, Factory, Layers, Cpu, Activity, DollarSign, ShieldAlert, Clock } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

interface ScenarioResultsComparisonProps {
  isSimulating: boolean;
  apiResponse: ScenarioRunResponse | null;
}

export const ScenarioResultsComparison: React.FC<ScenarioResultsComparisonProps> = ({
  isSimulating,
  apiResponse,
}) => {
  const { mode } = useTheme();
  const isLight = mode === 'light';

  const metrics = [
    {
      label: 'Global Demand Target',
      icon: <TrendingUp size={16} color="#06B6D4" />,
      baseline: `${BASELINE_OUTCOME.demandUnits.toLocaleString()} u`,
      scenario: 'Backend Pending',
      diffPct: 0,
      format: () => '-',
      favorableIfPositive: true,
      isApiBacked: false,
    },
    {
      label: 'Production MPS Output',
      icon: <Factory size={16} color="#6366F1" />,
      baseline: `${BASELINE_OUTCOME.productionUnits.toLocaleString()} u`,
      scenario: 'Backend Pending',
      diffPct: 0,
      format: () => '-',
      favorableIfPositive: true,
      isApiBacked: false,
    },
    {
      label: 'Material Requirement (BOM)',
      icon: <Layers size={16} color="#06B6D4" />,
      baseline: `${BASELINE_OUTCOME.materialReqKg.toLocaleString()} kg`,
      scenario: apiResponse ? `${apiResponse.adjusted_required_quantity.toLocaleString()} kg` : 'Run simulation...',
      diffPct: apiResponse ? ((apiResponse.adjusted_required_quantity - BASELINE_OUTCOME.materialReqKg) / BASELINE_OUTCOME.materialReqKg) * 100 : 0,
      format: (val: number) => `${val >= 0 ? '+' : ''}${val.toFixed(1)}%`,
      favorableIfPositive: false,
      isApiBacked: !!apiResponse,
    },
    {
      label: 'Procurement Allocation Volume',
      icon: <Cpu size={16} color="#16A34A" />,
      baseline: `${BASELINE_OUTCOME.procurementReqUnits.toLocaleString()} u`,
      scenario: 'Backend Pending',
      diffPct: 0,
      format: () => '-',
      favorableIfPositive: true,
      isApiBacked: false,
    },
    {
      label: 'Plant Line Utilization',
      icon: <Activity size={16} color="#6366F1" />,
      baseline: `${BASELINE_OUTCOME.plantUtilizationPct}%`,
      scenario: 'Backend Pending',
      diffPct: 0,
      format: () => '-',
      favorableIfPositive: true,
      isApiBacked: false,
    },
    {
      label: 'Total Procurement Cost',
      icon: <DollarSign size={16} color="#F59E0B" />,
      baseline: `$${(BASELINE_OUTCOME.totalCost / 1000000).toFixed(2)}M`,
      scenario: apiResponse ? `$${(apiResponse.estimated_cost / 1000000).toFixed(2)}M` : 'Run simulation...',
      diffPct: apiResponse ? ((apiResponse.estimated_cost - BASELINE_OUTCOME.totalCost) / BASELINE_OUTCOME.totalCost) * 100 : 0,
      format: (val: number) => `${val >= 0 ? '+' : ''}${val.toFixed(1)}%`,
      favorableIfPositive: false,
      isApiBacked: !!apiResponse,
    },
    {
      label: 'Disruption Risk Index',
      icon: <ShieldAlert size={16} color="#F43F5E" />,
      baseline: `${BASELINE_OUTCOME.riskScore} / 100`,
      scenario: 'Backend Pending',
      diffPct: 0,
      format: () => '-',
      favorableIfPositive: false,
      isApiBacked: false,
    },
    {
      label: 'Average Transit Lead Time',
      icon: <Clock size={16} color="#38BDF8" />,
      baseline: `${BASELINE_OUTCOME.leadTimeDays} days`,
      scenario: 'Backend Pending',
      diffPct: 0,
      format: () => '-',
      favorableIfPositive: false,
      isApiBacked: false,
    },
  ];

  return (
    <CinematicCard
      title="Baseline vs What-If Scenario Outcome Matrix"
      subtitle="Side-by-side variance analysis comparing current S&OP aggregate plan with stress-tested scenario"
      icon={<Layers size={18} color="#6366F1" />}
      glowColor="indigo"
      headerAction={<Badge variant="cyan">8 Performance Dimensions</Badge>}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '14px',
        }}
      >
        {metrics.map((metric, idx) => {
          const isNeutral = Math.abs(metric.diffPct) < 0.05;
          const isGood = metric.favorableIfPositive ? metric.diffPct > 0 : metric.diffPct < 0;

          return (
            <motion.div
              key={idx}
              layout
              style={{
                padding: '14px',
                borderRadius: '12px',
                background: isLight ? 'rgba(15, 23, 42, 0.03)' : 'rgba(255, 255, 255, 0.03)',
                border: isLight ? '1px solid rgba(15, 23, 42, 0.08)' : '1px solid rgba(255, 255, 255, 0.06)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div
                      style={{
                        padding: '6px',
                        borderRadius: '6px',
                        background: isLight ? 'rgba(15, 23, 42, 0.04)' : 'rgba(255, 255, 255, 0.04)',
                      }}
                    >
                      {metric.icon}
                    </div>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: isLight ? '#334155' : '#CBD5E1' }}>
                      {metric.label}
                    </span>
                    {metric.isApiBacked && (
                      <div style={{ transform: 'scale(0.8)', transformOrigin: 'left center' }}>
                        <Badge variant="cyan">API</Badge>
                      </div>
                    )}
                  </div>

                  {/* Delta Pill */}
                  <span
                    style={{
                      fontSize: '10px',
                      fontWeight: 800,
                      padding: '2px 8px',
                      borderRadius: '12px',
                      background: isNeutral
                        ? 'rgba(148, 163, 184, 0.15)'
                        : isGood
                        ? 'rgba(16, 185, 129, 0.15)'
                        : 'rgba(244, 63, 94, 0.15)',
                      color: isNeutral ? '#94A3B8' : isGood ? '#16A34A' : '#F43F5E',
                      fontFamily: "'JetBrains Mono', monospace",
                    }}
                  >
                    {isNeutral ? '0.0%' : metric.format(metric.diffPct)}
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '10px' }}>
                  <div>
                    <div style={{ fontSize: '10px', color: '#64748B' }}>Baseline Plan</div>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: '#94A3B8', fontFamily: "'JetBrains Mono', monospace" }}>
                      {metric.baseline}
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '10px', color: '#06B6D4', fontWeight: 700 }}>Scenario Projected</div>
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={isSimulating ? 'loading' : metric.scenario}
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 4 }}
                        transition={{ duration: 0.2 }}
                        style={{
                          fontSize: '15px',
                          fontWeight: 800,
                          color: isLight ? '#0F172A' : '#F8FAFC',
                          fontFamily: "'JetBrains Mono', monospace",
                        }}
                      >
                        {isSimulating ? '...' : metric.scenario}
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </CinematicCard>
  );
};
