import React, { useMemo, useState } from 'react';
import { CinematicCard } from '../ui/CinematicCard';
import { Badge } from '../ui/Badge';
import { BarChart2 } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import type { RiskPredictionResponse } from '../../services/api/riskApi';

interface SupplierRiskComparisonProps {
  data: RiskPredictionResponse[];
}

interface TooltipData {
  x: number;
  y: number;
  supplier: string;
  metric: string;
  raw: number;
  display: string;
  riskLevel: string;
  date: string;
}

export const SupplierRiskComparison: React.FC<SupplierRiskComparisonProps> = ({ data }) => {
  const { mode } = useTheme();
  const isLight = mode === 'light';
  
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);

  // Process data: remove duplicates (keep latest per supplier_id + material_id) and sort descending by risk_score
  const processedData = useMemo(() => {
    const map = new Map<string, RiskPredictionResponse>();
    // data is presumed to have latest results first (unshifted)
    for (const item of data) {
      const key = `${item.supplier_id}`;
      if (!map.has(key)) {
        map.set(key, item);
      }
    }
    return Array.from(map.values()).sort((a, b) => b.risk_score - a.risk_score);
  }, [data]);

  const getRiskColor = (level: string) => {
    switch (level.toUpperCase()) {
      case 'LOW': return 'emerald';
      case 'MEDIUM': return 'amber';
      case 'HIGH': return 'rose';
      default: return 'slate';
    }
  };

  const formatPercentage = (val: number) => `${(val * 100).toFixed(2)}%`;

  const handleMouseEnter = (e: React.MouseEvent, item: RiskPredictionResponse, metric: string, raw: number, display: string) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltip({
      x: rect.left + rect.width / 2,
      y: rect.top - 10,
      supplier: item.supplier_id,
      metric,
      raw,
      display,
      riskLevel: item.risk_level,
      date: item.prediction_date
    });
  };

  const handleMouseLeave = () => {
    setTooltip(null);
  };

  return (
    <CinematicCard
      title="Supplier Risk Comparison"
      subtitle="Compare risk dimensions across analyzed suppliers."
      icon={<BarChart2 size={18} color="#06B6D4" />}
      glowColor="cyan"
    >
      {processedData.length === 0 ? (
        <div style={{ height: '160px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#94A3B8' }}>
          <p style={{ fontSize: '14px', fontWeight: 600, marginBottom: '8px' }}>No supplier risk comparisons yet.</p>
          <p style={{ fontSize: '12px' }}>Run Analyze Risk for one or more suppliers to build the comparison.</p>
        </div>
      ) : (
        <div style={{ position: 'relative', paddingRight: '16px', paddingBottom: '24px' }}>
          {/* Compact Legend */}
          <div style={{ display: 'flex', gap: '16px', marginBottom: '20px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '2px', backgroundColor: '#F43F5E' }} />
              <span style={{ fontSize: '11px', fontWeight: 600, color: isLight ? '#475569' : '#94A3B8' }}>Overall Risk</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '2px', backgroundColor: '#F59E0B' }} />
              <span style={{ fontSize: '11px', fontWeight: 600, color: isLight ? '#475569' : '#94A3B8' }}>Delivery Risk</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '2px', backgroundColor: '#06B6D4' }} />
              <span style={{ fontSize: '11px', fontWeight: 600, color: isLight ? '#475569' : '#94A3B8' }}>Quality Risk</span>
            </div>
          </div>

          {/* Grouped Horizontal Bars */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {processedData.map((item) => {
              const key = `${item.supplier_id}`;
              const pOverall = item.risk_score * 100;
              const pDelivery = item.delivery_risk * 100;
              const pQuality = item.quality_risk * 100;

              return (
                <div key={key} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {/* Supplier Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '13px', fontWeight: 700, color: isLight ? '#0F172A' : '#F8FAFC' }}>
                        {item.supplier_id}
                      </span>
                      <Badge variant={getRiskColor(item.risk_level) as any}>{item.risk_level}</Badge>
                    </div>
                  </div>

                  {/* Bars Container */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    
                    {/* Overall Risk Bar */}
                    <div 
                      style={{ position: 'relative', display: 'flex', alignItems: 'center', height: '16px', gap: '12px' }}
                      onMouseEnter={(e) => handleMouseEnter(e, item, 'Overall Risk', item.risk_score, formatPercentage(item.risk_score))}
                      onMouseLeave={handleMouseLeave}
                    >
                      <div style={{ width: '80px', flexShrink: 0, fontSize: '11px', color: isLight ? '#475569' : '#94A3B8' }}>Overall</div>
                      <div style={{ flex: 1, height: '100%', background: isLight ? 'rgba(15, 23, 42, 0.05)' : 'rgba(255, 255, 255, 0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ width: `${pOverall}%`, height: '100%', backgroundColor: '#F43F5E', transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)', borderRadius: '4px' }} />
                      </div>
                      <div style={{ width: '50px', flexShrink: 0, textAlign: 'right', fontSize: '11px', fontWeight: 600, color: '#F43F5E', fontFamily: "'JetBrains Mono', monospace" }}>
                        {formatPercentage(item.risk_score)}
                      </div>
                    </div>

                    {/* Delivery Risk Bar */}
                    <div 
                      style={{ position: 'relative', display: 'flex', alignItems: 'center', height: '16px', gap: '12px' }}
                      onMouseEnter={(e) => handleMouseEnter(e, item, 'Delivery Risk', item.delivery_risk, formatPercentage(item.delivery_risk))}
                      onMouseLeave={handleMouseLeave}
                    >
                      <div style={{ width: '80px', flexShrink: 0, fontSize: '11px', color: isLight ? '#475569' : '#94A3B8' }}>Delivery</div>
                      <div style={{ flex: 1, height: '100%', background: isLight ? 'rgba(15, 23, 42, 0.05)' : 'rgba(255, 255, 255, 0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ width: `${pDelivery}%`, height: '100%', backgroundColor: '#F59E0B', transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)', borderRadius: '4px' }} />
                      </div>
                      <div style={{ width: '50px', flexShrink: 0, textAlign: 'right', fontSize: '11px', fontWeight: 600, color: '#F59E0B', fontFamily: "'JetBrains Mono', monospace" }}>
                        {formatPercentage(item.delivery_risk)}
                      </div>
                    </div>

                    {/* Quality Risk Bar */}
                    <div 
                      style={{ position: 'relative', display: 'flex', alignItems: 'center', height: '16px', gap: '12px' }}
                      onMouseEnter={(e) => handleMouseEnter(e, item, 'Quality Risk', item.quality_risk, formatPercentage(item.quality_risk))}
                      onMouseLeave={handleMouseLeave}
                    >
                      <div style={{ width: '80px', flexShrink: 0, fontSize: '11px', color: isLight ? '#475569' : '#94A3B8' }}>Quality</div>
                      <div style={{ flex: 1, height: '100%', background: isLight ? 'rgba(15, 23, 42, 0.05)' : 'rgba(255, 255, 255, 0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ width: `${pQuality}%`, height: '100%', backgroundColor: '#06B6D4', transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)', borderRadius: '4px' }} />
                      </div>
                      <div style={{ width: '50px', flexShrink: 0, textAlign: 'right', fontSize: '11px', fontWeight: 600, color: '#06B6D4', fontFamily: "'JetBrains Mono', monospace" }}>
                        {formatPercentage(item.quality_risk)}
                      </div>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>

          {/* Global Tooltip */}
          {tooltip && (
            <div 
              style={{
                position: 'fixed',
                top: tooltip.y,
                left: tooltip.x,
                transform: 'translate(-50%, -100%)',
                zIndex: 100,
                pointerEvents: 'none',
                background: isLight ? '#FFFFFF' : '#0F172A',
                border: `1px solid ${isLight ? '#E2E8F0' : '#1E293B'}`,
                padding: '10px 12px',
                borderRadius: '8px',
                boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
                fontSize: '11px',
                color: isLight ? '#0F172A' : '#F8FAFC',
                whiteSpace: 'nowrap',
                lineHeight: '1.5'
              }}
            >
              <div style={{ marginBottom: '6px', paddingBottom: '6px', borderBottom: `1px solid ${isLight ? '#E2E8F0' : '#1E293B'}` }}>
                <strong style={{ fontSize: '12px' }}>{tooltip.supplier}</strong>
              </div>
              <div><span style={{ color: '#64748B' }}>Metric:</span> <strong>{tooltip.metric}</strong></div>
              <div><span style={{ color: '#64748B' }}>Raw:</span> {tooltip.raw.toFixed(6)}</div>
              <div><span style={{ color: '#64748B' }}>Display:</span> {tooltip.display}</div>
              <div><span style={{ color: '#64748B' }}>Risk Level:</span> <span style={{ color: getRiskColor(tooltip.riskLevel) === 'emerald' ? '#10B981' : getRiskColor(tooltip.riskLevel) === 'amber' ? '#F59E0B' : '#F43F5E', fontWeight: 600 }}>{tooltip.riskLevel}</span></div>
              <div><span style={{ color: '#64748B' }}>Prediction Date:</span> {tooltip.date}</div>
            </div>
          )}
        </div>
      )}
    </CinematicCard>
  );
};
