import React, { useMemo } from 'react';
import { CinematicCard } from '../ui/CinematicCard';
import { Badge } from '../ui/Badge';
import { ShieldAlert, Loader2 } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
import type { RiskPredictionResponse } from '../../services/api/riskApi';
import type { SupplierItem } from '../../services/api/suppliersApi';

interface SupplierRiskProfileProps {
  data: (RiskPredictionResponse & { material_id?: string; supplier_name?: string; material_name?: string }) | null;
  isLoading?: boolean;
  suppliers?: SupplierItem[];
}

export const SupplierRiskProfile: React.FC<SupplierRiskProfileProps> = ({ data, isLoading, suppliers = [] }) => {
  const { mode } = useTheme();
  const isLight = mode === 'light';

  const riskLevel = data?.risk_level?.toUpperCase() || 'LOW';
  
  const accentColor = useMemo(() => {
    switch (riskLevel) {
      case 'LOW': return '#10B981'; // Emerald
      case 'MEDIUM': return '#F59E0B'; // Amber
      case 'HIGH': return '#F43F5E'; // Rose
      default: return '#10B981';
    }
  }, [riskLevel]);

  const radarData = useMemo(() => {
    if (!data) return [];
    return [
      { subject: 'Overall Risk', value: data.risk_score, displayValue: data.risk_score * 100 },
      { subject: 'Delivery Risk', value: data.delivery_risk, displayValue: data.delivery_risk * 100 },
      { subject: 'Quality Risk', value: data.quality_risk, displayValue: data.quality_risk * 100 }
    ];
  }, [data]);

  const formatPercentage = (val: number) => `${val.toFixed(2)}%`;

  const formatPredictionDate = (value?: string | null) => {
    if (!value) return '—';
    const [year, month, day] = value.split('-');
    if (!year || !month || !day) return value;
    return `${day}-${month}-${year}`;
  };

  const resolvedSupplierName = useMemo(() => {
    if (!data?.supplier_id) return data?.supplier_name;
    const cleanId = data.supplier_id.trim();
    const found = suppliers.find(s => s.supplier_id.trim() === cleanId);
    return found?.supplier_name || data.supplier_name;
  }, [data?.supplier_id, data?.supplier_name, suppliers]);

  const displaySupplier = resolvedSupplierName && data?.supplier_id && resolvedSupplierName !== data.supplier_id 
    ? `${resolvedSupplierName} (${data.supplier_id})` 
    : (data?.supplier_id || '—');

  const displayMaterial = data?.material_name && data?.material_id && data.material_name !== data.material_id 
    ? `${data.material_name} (${data.material_id})` 
    : (data?.material_id || '—');

  return (
    <CinematicCard
      title="Supplier Risk Profile"
      subtitle="Multi-dimensional risk radar for the current supplier and material."
      icon={<ShieldAlert size={18} color={accentColor} />}
      glowColor={riskLevel === 'HIGH' ? 'rose' : riskLevel === 'MEDIUM' ? 'amber' : 'emerald'}
    >
      <div style={{ minHeight: '300px', display: 'flex', position: 'relative' }}>
        
        {/* Empty / Loading State Overlay */}
        {(!data || isLoading) && (
          <div style={{ position: 'absolute', inset: 0, zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: isLight ? 'rgba(255,255,255,0.7)' : 'rgba(15,23,42,0.7)', backdropFilter: 'blur(4px)', borderRadius: '8px', color: '#94A3B8' }}>
            {isLoading ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                <Loader2 className="animate-spin" size={32} color={accentColor} />
                <p style={{ fontSize: '14px', fontWeight: 600, color: accentColor }}>Scanning Risk Profile...</p>
              </div>
            ) : (
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '14px', fontWeight: 600, marginBottom: '8px' }}>Risk profile not generated</p>
                <p style={{ fontSize: '12px' }}>Select a supplier and material, then run Analyze Risk.</p>
              </div>
            )}
          </div>
        )}

        <div style={{ display: 'flex', width: '100%', flexWrap: 'wrap' }}>
          
          {/* Radar Chart (Left 60%) */}
          <div style={{ flex: '1 1 50%', minWidth: '300px', height: '300px', position: 'relative' }}>
            {data && (
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                  <PolarGrid stroke={isLight ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)'} />
                  <PolarAngleAxis 
                    dataKey="subject" 
                    tick={{ fill: isLight ? '#475569' : '#94A3B8', fontSize: 12, fontWeight: 600 }} 
                  />
                  <PolarRadiusAxis angle={30} domain={[0, 1]} tick={false} axisLine={false} />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const point = payload[0].payload;
                        return (
                          <div style={{
                            background: isLight ? '#FFFFFF' : '#0F172A',
                            border: `1px solid ${isLight ? '#E2E8F0' : '#1E293B'}`,
                            padding: '8px 12px',
                            borderRadius: '6px',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                            fontSize: '11px',
                            color: isLight ? '#0F172A' : '#F8FAFC',
                            zIndex: 20
                          }}>
                            <div style={{ fontWeight: 700, marginBottom: '4px' }}>{point.subject}</div>
                            <div><span style={{ color: '#64748B' }}>Raw:</span> {point.value.toFixed(6)}</div>
                            <div><span style={{ color: '#64748B' }}>Display:</span> {formatPercentage(point.displayValue)}</div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Radar
                    name="Risk"
                    dataKey="value"
                    stroke={accentColor}
                    fill={accentColor}
                    fillOpacity={0.4}
                    isAnimationActive={true}
                    animationDuration={1000}
                    animationEasing="ease-out"
                    activeDot={{ r: 6, fill: accentColor, stroke: isLight ? '#FFFFFF' : '#0F172A', strokeWidth: 2 }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Right-Side Details (Right 40%) */}
          <div style={{ flex: '1 1 40%', minWidth: '250px', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '16px' }}>
            <h3 style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700, color: '#64748B', marginBottom: '16px' }}>
              Current Risk Profile
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
              <div>
                <p style={{ fontSize: '11px', color: '#64748B', marginBottom: '4px' }}>Supplier</p>
                <p style={{ fontSize: '14px', fontWeight: 600, color: isLight ? '#0F172A' : '#F8FAFC' }}>
                  {displaySupplier}
                </p>
              </div>
              <div>
                <p style={{ fontSize: '11px', color: '#64748B', marginBottom: '4px' }}>Material</p>
                <p style={{ fontSize: '14px', fontWeight: 600, color: isLight ? '#0F172A' : '#F8FAFC' }}>
                  {displayMaterial}
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
              <p style={{ fontSize: '11px', color: '#64748B' }}>Risk Level</p>
              <Badge variant={riskLevel === 'HIGH' ? 'rose' : riskLevel === 'MEDIUM' ? 'amber' : 'emerald'}>
                {riskLevel}
              </Badge>
            </div>

            {/* Compact Meters */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
              {radarData.map(metric => (
                <div key={metric.subject}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 600, color: isLight ? '#475569' : '#94A3B8' }}>{metric.subject}</span>
                    <span style={{ fontSize: '11px', fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", color: accentColor }}>
                      {formatPercentage(metric.displayValue)}
                    </span>
                  </div>
                  <div style={{ height: '4px', width: '100%', background: isLight ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${metric.displayValue}%`, backgroundColor: accentColor, transition: 'width 1s ease-out' }} />
                  </div>
                </div>
              ))}
            </div>

            {/* Metadata */}
            {data?.prediction_date && (
              <div style={{ borderTop: `1px solid ${isLight ? '#E2E8F0' : '#1E293B'}`, paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '11px', color: '#64748B' }}>Prediction Date</span>
                  <span style={{ fontSize: '11px', fontWeight: 500, color: isLight ? '#475569' : '#94A3B8' }}>{formatPredictionDate(data.prediction_date)}</span>
                </div>
                {data.model_version && (
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '11px', color: '#64748B' }}>Model</span>
                    <span style={{ fontSize: '11px', fontWeight: 500, color: isLight ? '#475569' : '#94A3B8' }}>{data.model_version}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </CinematicCard>
  );
};
