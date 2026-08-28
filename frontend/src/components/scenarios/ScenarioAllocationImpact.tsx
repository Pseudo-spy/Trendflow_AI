import React from 'react';
import { CinematicCard } from '../ui/CinematicCard';
import { Badge } from '../ui/Badge';
import { Network, ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import type { ScenarioRunResponse, ScenarioRunRequest } from '../../services/api/scenarioApi';
import { EmptyState, ErrorState } from '../ui/States';

interface ScenarioAllocationImpactProps {
  apiResponse: ScenarioRunResponse | null;
  lastRequest: ScenarioRunRequest | null;
  isSimulating: boolean;
  apiError?: string | null;
}

export const ScenarioAllocationImpact: React.FC<ScenarioAllocationImpactProps> = ({
  apiResponse,
  lastRequest,
  isSimulating,
  apiError
}) => {
  const { mode } = useTheme();
  const isLight = mode === 'light';

  if (apiError) {
    return (
      <CinematicCard
        title="Scenario Allocation Impact"
        subtitle="Backend-driven impact of the selected scenario."
        icon={<Network size={18} color="#06B6D4" />}
        glowColor="cyan"
      >
        <div style={{ padding: '40px 0' }}>
          <ErrorState error={apiError} onRetry={() => {}} />
        </div>
      </CinematicCard>
    );
  }

  if (isSimulating) {
    return (
      <CinematicCard
        title="Scenario Allocation Impact"
        subtitle="Backend-driven impact of the selected scenario."
        icon={<Network size={18} color="#06B6D4" />}
        glowColor="cyan"
      >
        <div style={{ height: '200px', display: 'flex', flexDirection: 'column', gap: '20px', justifyContent: 'center' }}>
          <div style={{ width: '100%', height: '24px', background: isLight ? 'rgba(15, 23, 42, 0.05)' : 'rgba(255, 255, 255, 0.05)', borderRadius: '4px', animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }} />
          <div style={{ width: '80%', height: '24px', background: isLight ? 'rgba(15, 23, 42, 0.05)' : 'rgba(255, 255, 255, 0.05)', borderRadius: '4px', animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite', animationDelay: '200ms' }} />
          <div style={{ width: '90%', height: '24px', background: isLight ? 'rgba(15, 23, 42, 0.05)' : 'rgba(255, 255, 255, 0.05)', borderRadius: '4px', animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite', animationDelay: '400ms' }} />
        </div>
      </CinematicCard>
    );
  }

  if (!apiResponse || !lastRequest) {
    return (
      <CinematicCard
        title="Scenario Allocation Impact"
        subtitle="Backend-driven impact of the selected scenario."
        icon={<Network size={18} color="#06B6D4" />}
        glowColor="cyan"
      >
        <div style={{ padding: '40px 0' }}>
          <EmptyState title="No Scenario Data" message="Run a scenario to compare baseline and scenario outcomes." />
        </div>
      </CinematicCard>
    );
  }

  const {
    scenario_name,
    material_id,
    baseline_status,
    scenario_status,
    feasibility_changed,
    baseline_cost,
    scenario_cost,
    cost_delta,
    cost_delta_pct,
    baseline_risk_score,
    scenario_risk_score,
    risk_delta,
    allocation_deltas,
    explanation
  } = apiResponse;

  // Colors
  const baselineColor = '#A5B4FC';
  const scenarioColor = '#22D3EE';
  const baselineGradient = 'linear-gradient(90deg, #4F46E5, #7C3AED)';
  const scenarioGradient = 'linear-gradient(90deg, #06B6D4, #22C55E)';
  const trackColor = isLight ? 'rgba(15, 23, 42, 0.05)' : 'rgba(255, 255, 255, 0.06)';
  const panelBg = isLight ? 'rgba(15, 23, 42, 0.02)' : 'rgba(255, 255, 255, 0.02)';
  const panelBorder = isLight ? '1px solid rgba(15, 23, 42, 0.05)' : '1px solid rgba(255, 255, 255, 0.05)';
  const textColor = isLight ? '#0F172A' : '#F8FAFC';
  const mutedTextColor = isLight ? '#64748B' : '#94A3B8';

  // Cost styling
  const isCostIncrease = cost_delta > 0;
  const isCostDecrease = cost_delta < 0;
  const costColor = isCostDecrease ? '#34D399' : (isCostIncrease ? '#F59E0B' : '#94A3B8');
  const CostIcon = isCostDecrease ? ArrowDownRight : (isCostIncrease ? ArrowUpRight : Minus);
  
  const maxCost = Math.max(baseline_cost, scenario_cost) || 1;

  // Risk styling
  const isRiskIncrease = risk_delta > 0;
  const isRiskDecrease = risk_delta < 0;
  const riskColor = isRiskDecrease ? '#34D399' : (isRiskIncrease ? '#F59E0B' : '#94A3B8');
  const RiskIcon = isRiskDecrease ? ArrowDownRight : (isRiskIncrease ? ArrowUpRight : Minus);

  // Shifts
  let maxQty = 0;
  if (allocation_deltas && allocation_deltas.length > 0) {
    allocation_deltas.forEach(s => {
      if (s.baseline_quantity > maxQty) maxQty = s.baseline_quantity;
      if (s.scenario_quantity > maxQty) maxQty = s.scenario_quantity;
    });
  }
  if (maxQty === 0) maxQty = 1;

  const formatNumber = (num: number) => num.toLocaleString('en-IN');
  const formatCost = (num: number) => `₹${num.toLocaleString('en-IN')}`;

  const formatScenarioName = (name: string) => {
    return name.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  return (
    <CinematicCard
      title="Scenario Allocation Impact"
      subtitle="Backend-driven impact of the selected scenario."
      icon={<Network size={18} color="#06B6D4" />}
      glowColor="cyan"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginTop: '16px' }}>

        {/* SECTION 1: SCENARIO SUMMARY */}
        <div style={{ background: panelBg, border: panelBorder, borderRadius: '8px', padding: '20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px' }}>
            <div>
              <div style={{ fontSize: '11px', color: mutedTextColor, marginBottom: '6px' }}>Scenario</div>
              <div style={{ fontSize: '14px', fontWeight: 600, color: textColor }}>{formatScenarioName(scenario_name)}</div>
            </div>
            <div>
              <div style={{ fontSize: '11px', color: mutedTextColor, marginBottom: '6px' }}>Material</div>
              <div style={{ fontSize: '14px', fontWeight: 600, color: textColor }}>{material_id}</div>
            </div>
            <div>
              <div style={{ fontSize: '11px', color: mutedTextColor, marginBottom: '6px' }}>Baseline Status</div>
              <Badge variant={baseline_status === 'OPTIMAL' || baseline_status === 'FEASIBLE' ? 'emerald' : 'rose'}>{baseline_status || 'N/A'}</Badge>
            </div>
            <div>
              <div style={{ fontSize: '11px', color: mutedTextColor, marginBottom: '6px' }}>Scenario Status</div>
              <Badge variant={scenario_status === 'OPTIMAL' || scenario_status === 'FEASIBLE' ? 'emerald' : 'rose'}>{scenario_status || 'N/A'}</Badge>
            </div>
            <div>
              <div style={{ fontSize: '11px', color: mutedTextColor, marginBottom: '6px' }}>Feasibility Changed</div>
              <Badge variant={feasibility_changed ? 'amber' : 'muted'}>{feasibility_changed ? 'CHANGED' : 'NO CHANGE'}</Badge>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
          {/* SECTION 2: COST IMPACT */}
          <div style={{ background: panelBg, border: panelBorder, borderRadius: '8px', padding: '20px' }}>
            <h4 style={{ margin: '0 0 16px 0', fontSize: '13px', color: mutedTextColor, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              COST IMPACT
            </h4>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
              <div>
                <div style={{ fontSize: '11px', color: mutedTextColor, marginBottom: '4px' }}>Baseline Cost</div>
                <div style={{ fontSize: '16px', fontWeight: 600, color: textColor }}>{formatCost(baseline_cost || 0)}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '11px', color: mutedTextColor, marginBottom: '4px' }}>Scenario Cost</div>
                <div style={{ fontSize: '16px', fontWeight: 600, color: textColor }}>{formatCost(scenario_cost || 0)}</div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
              {/* Baseline Bar */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '40px', fontSize: '10px', color: baselineColor, textAlign: 'right' }}>Base</div>
                <div style={{ flex: 1, height: '8px', background: trackColor, borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${((baseline_cost || 0) / maxCost) * 100}%`, height: '100%', background: baselineGradient, boxShadow: '0 0 10px rgba(79, 70, 229, 0.2)' }} />
                </div>
                <div style={{ width: '60px', fontSize: '10px', color: mutedTextColor }}>{formatCost(baseline_cost || 0)}</div>
              </div>
              {/* Scenario Bar */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '40px', fontSize: '10px', color: scenarioColor, textAlign: 'right' }}>Scen</div>
                <div style={{ flex: 1, height: '8px', background: trackColor, borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${((scenario_cost || 0) / maxCost) * 100}%`, height: '100%', background: scenarioGradient, boxShadow: '0 0 10px rgba(6, 182, 212, 0.4)' }} />
                </div>
                <div style={{ width: '60px', fontSize: '10px', color: mutedTextColor }}>{formatCost(scenario_cost || 0)}</div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: isLight ? '#FFFFFF' : 'rgba(0,0,0,0.2)', borderRadius: '6px' }}>
              <span style={{ fontSize: '12px', fontWeight: 600, color: mutedTextColor }}>Cost Delta</span>
              <span style={{ color: costColor, fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px', fontSize: '14px' }}>
                {(cost_delta || 0) !== 0 && <CostIcon size={14} />}
                {(cost_delta || 0) > 0 ? '+' : ''}{formatCost(cost_delta || 0)} 
                {' '}({(cost_delta || 0) > 0 ? '+' : ''}{(cost_delta_pct || 0).toFixed(2)}%)
              </span>
            </div>
          </div>

          {/* SECTION 3: RISK IMPACT */}
          <div style={{ background: panelBg, border: panelBorder, borderRadius: '8px', padding: '20px' }}>
            <h4 style={{ margin: '0 0 16px 0', fontSize: '13px', color: mutedTextColor, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              RISK IMPACT
            </h4>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
              <div>
                <div style={{ fontSize: '11px', color: mutedTextColor, marginBottom: '4px' }}>Baseline Risk Score</div>
                <div style={{ fontSize: '16px', fontWeight: 600, color: textColor }}>{(baseline_risk_score || 0).toFixed(6)}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '11px', color: mutedTextColor, marginBottom: '4px' }}>Scenario Risk Score</div>
                <div style={{ fontSize: '16px', fontWeight: 600, color: textColor }}>{(scenario_risk_score || 0).toFixed(6)}</div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
              {/* Baseline Bar */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '40px', fontSize: '10px', color: baselineColor, textAlign: 'right' }}>Base</div>
                <div style={{ flex: 1, height: '8px', background: trackColor, borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${Math.min((baseline_risk_score || 0) * 100, 100)}%`, height: '100%', background: baselineGradient, boxShadow: '0 0 10px rgba(79, 70, 229, 0.2)' }} />
                </div>
                <div style={{ width: '50px', fontSize: '10px', color: mutedTextColor }}>{(baseline_risk_score || 0).toFixed(6)}</div>
              </div>
              {/* Scenario Bar */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '40px', fontSize: '10px', color: scenarioColor, textAlign: 'right' }}>Scen</div>
                <div style={{ flex: 1, height: '8px', background: trackColor, borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${Math.min((scenario_risk_score || 0) * 100, 100)}%`, height: '100%', background: scenarioGradient, boxShadow: '0 0 10px rgba(6, 182, 212, 0.4)' }} />
                </div>
                <div style={{ width: '50px', fontSize: '10px', color: mutedTextColor }}>{(scenario_risk_score || 0).toFixed(6)}</div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: isLight ? '#FFFFFF' : 'rgba(0,0,0,0.2)', borderRadius: '6px' }}>
              <span style={{ fontSize: '12px', fontWeight: 600, color: mutedTextColor }}>Risk Delta</span>
              <span style={{ color: riskColor, fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px', fontSize: '14px' }}>
                {(risk_delta || 0) !== 0 && <RiskIcon size={14} />}
                {(risk_delta || 0) > 0 ? '+' : ''}{(risk_delta || 0).toFixed(6)}
              </span>
            </div>
          </div>
        </div>

        {/* SECTION 4: SUPPLIER ALLOCATION SHIFT */}
        {allocation_deltas && allocation_deltas.length > 0 && (
          <div style={{ background: panelBg, border: panelBorder, borderRadius: '8px', padding: '20px' }}>
            <h4 style={{ margin: '0 0 20px 0', fontSize: '13px', color: mutedTextColor, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Supplier Allocation Shift
            </h4>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {allocation_deltas.map(shift => {
                const diff = shift.change;

                const isInc = diff > 0;
                const isDec = diff < 0;
                const diffColor = isInc ? '#34D399' : (isDec ? '#F59E0B' : '#94A3B8');
                const DiffIcon = isInc ? ArrowUpRight : (isDec ? ArrowDownRight : Minus);

                let diffText = '';
                if (diff === 0) {
                  diffText = '0 (No Change)';
                } else if (shift.baseline_quantity === 0 && shift.scenario_quantity > 0) {
                  diffText = `+${formatNumber(diff)} (New Allocation)`;
                } else if (shift.baseline_quantity > 0 && shift.scenario_quantity === 0) {
                  diffText = `${formatNumber(diff)} (Removed)`;
                } else {
                  diffText = `${diff > 0 ? '+' : ''}${formatNumber(diff)}`;
                }

                return (
                  <div key={shift.supplier_id}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '12px' }}>
                      <span style={{ fontWeight: 600, color: textColor }}>
                        {shift.supplier_id}
                      </span>
                      <span style={{ color: diffColor, fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                        {diff !== 0 && <DiffIcon size={14} />}
                        {diffText}
                      </span>
                    </div>
                    
                    {/* Baseline Bar */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                      <div style={{ width: '60px', fontSize: '11px', color: baselineColor, textAlign: 'right' }}>Baseline</div>
                      <div style={{ flex: 1, height: '12px', background: trackColor, borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ 
                          width: `${(shift.baseline_quantity / maxQty) * 100}%`, 
                          height: '100%', 
                          background: baselineGradient, 
                          boxShadow: '0 0 10px rgba(79, 70, 229, 0.2)',
                          transition: 'width 600ms cubic-bezier(0.4, 0, 0.2, 1)' 
                        }} />
                      </div>
                      <div style={{ width: '60px', fontSize: '11px', color: baselineColor }}>{formatNumber(shift.baseline_quantity)}</div>
                    </div>

                    {/* Scenario Bar */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '60px', fontSize: '11px', color: scenarioColor, fontWeight: 600, textAlign: 'right' }}>Scenario</div>
                      <div style={{ flex: 1, height: '12px', background: trackColor, borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ 
                          width: `${(shift.scenario_quantity / maxQty) * 100}%`, 
                          height: '100%', 
                          background: scenarioGradient, 
                          boxShadow: '0 0 10px rgba(6, 182, 212, 0.4)',
                          transition: 'width 600ms cubic-bezier(0.4, 0, 0.2, 1)'
                        }} />
                      </div>
                      <div style={{ width: '60px', fontSize: '11px', color: scenarioColor, fontWeight: 600 }}>{formatNumber(shift.scenario_quantity)}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* SECTION 5: ALLOCATION TABLE */}
        {allocation_deltas && allocation_deltas.length > 0 && (
          <div style={{ background: panelBg, border: panelBorder, borderRadius: '8px', padding: '20px', overflowX: 'auto' }}>
            <h4 style={{ margin: '0 0 16px 0', fontSize: '13px', color: mutedTextColor, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Supplier Allocation Table
            </h4>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
              <thead>
                <tr style={{ borderBottom: panelBorder, textAlign: 'left', color: mutedTextColor }}>
                  <th style={{ padding: '8px 12px', fontWeight: 600 }}>Supplier ID</th>
                  <th style={{ padding: '8px 12px', fontWeight: 600, textAlign: 'right' }}>Baseline Quantity</th>
                  <th style={{ padding: '8px 12px', fontWeight: 600, textAlign: 'right' }}>Scenario Quantity</th>
                  <th style={{ padding: '8px 12px', fontWeight: 600, textAlign: 'right' }}>Change</th>
                </tr>
              </thead>
              <tbody>
                {allocation_deltas.map(delta => {
                  const isInc = delta.change > 0;
                  const isDec = delta.change < 0;
                  const diffColor = isInc ? '#34D399' : (isDec ? '#F59E0B' : '#94A3B8');
                  return (
                    <tr key={delta.supplier_id} style={{ borderBottom: isLight ? '1px solid rgba(15, 23, 42, 0.05)' : '1px solid rgba(255,255,255,0.02)' }}>
                      <td style={{ padding: '12px', color: textColor, fontWeight: 600 }}>{delta.supplier_id}</td>
                      <td style={{ padding: '12px', textAlign: 'right', color: baselineColor }}>{formatNumber(delta.baseline_quantity)}</td>
                      <td style={{ padding: '12px', textAlign: 'right', color: scenarioColor }}>{formatNumber(delta.scenario_quantity)}</td>
                      <td style={{ padding: '12px', textAlign: 'right', color: diffColor, fontWeight: 600 }}>
                        {delta.change > 0 ? '+' : ''}{formatNumber(delta.change)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* SECTION 6: SCENARIO EXPLANATION */}
        <div style={{ background: panelBg, border: panelBorder, borderRadius: '8px', padding: '20px' }}>
          <h4 style={{ margin: '0 0 16px 0', fontSize: '13px', color: mutedTextColor, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Scenario Explanation
          </h4>
          <div style={{ fontSize: '11px', color: mutedTextColor, marginBottom: '8px' }}>Backend Explanation</div>
          <div style={{ 
            fontSize: '13px', 
            color: isLight ? '#334155' : '#CBD5E1', 
            lineHeight: 1.6,
            padding: '16px',
            background: isLight ? '#FFFFFF' : 'rgba(15, 23, 42, 0.4)',
            borderRadius: '6px',
            border: isLight ? '1px solid rgba(15, 23, 42, 0.1)' : '1px solid rgba(255, 255, 255, 0.05)'
          }}>
            {explanation || 'No explanation provided.'}
          </div>
        </div>

      </div>
    </CinematicCard>
  );
};
