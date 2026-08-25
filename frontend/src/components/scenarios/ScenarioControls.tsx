import React from 'react';
import { CinematicCard } from '../ui/CinematicCard';
import { Badge } from '../ui/Badge';
import type { ScenarioParameters } from '../../types/scenario';
import { Sliders } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

interface ScenarioControlsProps {
  params: ScenarioParameters;
  onChangeParams: (newParams: ScenarioParameters) => void;
}

export const ScenarioControls: React.FC<ScenarioControlsProps> = ({
  params,
  onChangeParams,
}) => {
  const { mode } = useTheme();
  const isLight = mode === 'light';

  const setParam = <K extends keyof ScenarioParameters>(key: K, value: ScenarioParameters[K]) => {
    onChangeParams({
      ...params,
      [key]: value,
    });
  };

  return (
    <CinematicCard
      title="Scenario Stress-Testing Parameters"
      subtitle="Interact with demand multipliers, supplier disruption flags, capacity thresholds, and tariff variations"
      icon={<Sliders size={18} color="#06B6D4" />}
      glowColor="cyan"
      headerAction={<Badge variant="cyan">6 Stress Multipliers</Badge>}
    >
      {/* 4 One-Click Presets */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', marginBottom: '8px' }}>
          One-Click Stress Scenarios
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => {}}
            disabled={true}
            style={{
              padding: '10px 12px',
              borderRadius: '8px',
              background: isLight ? 'rgba(15, 23, 42, 0.05)' : 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(15, 23, 42, 0.1)',
              color: '#94A3B8',
              fontSize: '11px',
              fontWeight: 700,
              cursor: 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              textAlign: 'left',
            }}
          >
            <div>
              <div>Backend Blocked</div>
              <div style={{ fontSize: '9px', fontWeight: 500, color: '#94A3B8' }}>Presets Pending API Update</div>
            </div>
          </button>
        </div>
      </div>

      {/* 6 Slider & Dropdown Controls Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
        {/* 1. Demand Change */}
        <div style={{ padding: '12px', borderRadius: '10px', background: isLight ? 'rgba(15, 23, 42, 0.03)' : 'rgba(255, 255, 255, 0.03)', border: isLight ? '1px solid rgba(15, 23, 42, 0.08)' : '1px solid rgba(255, 255, 255, 0.08)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ fontSize: '11px', fontWeight: 600, color: isLight ? '#0F172A' : '#F8FAFC' }}>Demand Multiplier</span>
            <span style={{ fontSize: '12px', fontWeight: 800, color: '#06B6D4', fontFamily: "'JetBrains Mono', monospace" }}>
              {params.demandChangePct >= 0 ? `+${params.demandChangePct}%` : `${params.demandChangePct}%`}
            </span>
          </div>
          <input
            type="range"
            min="-50"
            max="50"
            step="5"
            value={params.demandChangePct}
            onChange={(e) => setParam('demandChangePct', parseInt(e.target.value))}
            style={{ width: '100%', accentColor: '#06B6D4', cursor: 'pointer' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', color: '#64748B', marginTop: '3px' }}>
            <span>-50% (Slump)</span>
            <span>+50% (Viral Surge)</span>
          </div>
        </div>

        {/* 2. Supplier Availability */}
        <div style={{ padding: '12px', borderRadius: '10px', background: isLight ? 'rgba(15, 23, 42, 0.03)' : 'rgba(255, 255, 255, 0.03)', border: isLight ? '1px solid rgba(15, 23, 42, 0.08)' : '1px solid rgba(255, 255, 255, 0.08)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ fontSize: '11px', fontWeight: 600, color: isLight ? '#0F172A' : '#F8FAFC' }}>Partner Disruption Flag</span>
            <Badge variant={params.supplierAvailability === 'all' ? 'emerald' : 'amber'}>
              {params.supplierAvailability.replace('_', ' ').toUpperCase()}
            </Badge>
          </div>
          <select
            value={params.supplierAvailability}
            onChange={() => {}}
            disabled={true}
            style={{
              width: '100%',
              padding: '6px 8px',
              borderRadius: '6px',
              background: isLight ? '#FFFFFF' : 'rgba(11, 17, 32, 0.9)',
              border: isLight ? '1px solid rgba(15, 23, 42, 0.15)' : '1px solid rgba(6, 182, 212, 0.3)',
              color: '#94A3B8',
              fontSize: '11px',
              fontWeight: 600,
              cursor: 'not-allowed',
            }}
          >
            <option value="all">Backend Pending</option>
          </select>
        </div>

        {/* 3. Supplier Capacity */}
        <div style={{ padding: '12px', borderRadius: '10px', background: isLight ? 'rgba(15, 23, 42, 0.03)' : 'rgba(255, 255, 255, 0.03)', border: isLight ? '1px solid rgba(15, 23, 42, 0.08)' : '1px solid rgba(255, 255, 255, 0.08)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ fontSize: '11px', fontWeight: 600, color: isLight ? '#0F172A' : '#F8FAFC' }}>Supplier Capacity Cap</span>
            <span style={{ fontSize: '12px', fontWeight: 800, color: '#6366F1', fontFamily: "'JetBrains Mono', monospace" }}>
              {params.supplierCapacityPct}%
            </span>
          </div>
          <input
            type="range"
            min="50"
            max="150"
            step="5"
            value={params.supplierCapacityPct}
            onChange={() => {}}
            disabled={true}
            style={{ width: '100%', cursor: 'not-allowed' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', color: '#64748B', marginTop: '3px' }}>
            <span>50% (Constrained)</span>
            <span>150% (Surge Ready)</span>
          </div>
        </div>

        {/* 4. Plant Capacity */}
        <div style={{ padding: '12px', borderRadius: '10px', background: isLight ? 'rgba(15, 23, 42, 0.03)' : 'rgba(255, 255, 255, 0.03)', border: isLight ? '1px solid rgba(15, 23, 42, 0.08)' : '1px solid rgba(255, 255, 255, 0.08)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ fontSize: '11px', fontWeight: 600, color: isLight ? '#0F172A' : '#F8FAFC' }}>Manufacturing Plant Capacity</span>
            <span style={{ fontSize: '12px', fontWeight: 800, color: '#16A34A', fontFamily: "'JetBrains Mono', monospace" }}>
              {params.plantCapacityPct}%
            </span>
          </div>
          <input
            type="range"
            min="50"
            max="150"
            step="5"
            value={params.plantCapacityPct}
            onChange={() => {}}
            disabled={true}
            style={{ width: '100%', cursor: 'not-allowed' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', color: '#64748B', marginTop: '3px' }}>
            <span>70% (Downtime)</span>
            <span>130% (Overtime Shifts)</span>
          </div>
        </div>

        {/* 5. Material Price */}
        <div style={{ padding: '12px', borderRadius: '10px', background: isLight ? 'rgba(15, 23, 42, 0.03)' : 'rgba(255, 255, 255, 0.03)', border: isLight ? '1px solid rgba(15, 23, 42, 0.08)' : '1px solid rgba(255, 255, 255, 0.08)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ fontSize: '11px', fontWeight: 600, color: isLight ? '#0F172A' : '#F8FAFC' }}>Raw Material Price / Tariff</span>
            <span style={{ fontSize: '12px', fontWeight: 800, color: params.materialPriceChangePct > 0 ? '#F59E0B' : '#16A34A', fontFamily: "'JetBrains Mono', monospace" }}>
              {params.materialPriceChangePct >= 0 ? `+${params.materialPriceChangePct}%` : `${params.materialPriceChangePct}%`}
            </span>
          </div>
          <input
            type="range"
            min="-50"
            max="100"
            step="5"
            value={params.materialPriceChangePct}
            onChange={() => {}}
            disabled={true}
            style={{ width: '100%', cursor: 'not-allowed' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', color: '#64748B', marginTop: '3px' }}>
            <span>-20% (Deflation)</span>
            <span>+40% (Tariff Shock)</span>
          </div>
        </div>

        {/* 6. Lead Time */}
        <div style={{ padding: '12px', borderRadius: '10px', background: isLight ? 'rgba(15, 23, 42, 0.03)' : 'rgba(255, 255, 255, 0.03)', border: isLight ? '1px solid rgba(15, 23, 42, 0.08)' : '1px solid rgba(255, 255, 255, 0.08)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ fontSize: '11px', fontWeight: 600, color: isLight ? '#0F172A' : '#F8FAFC' }}>Transit Lead Time Variance</span>
            <span style={{ fontSize: '12px', fontWeight: 800, color: '#38BDF8', fontFamily: "'JetBrains Mono', monospace" }}>
              {params.leadTimeChangeDays >= 0 ? `+${params.leadTimeChangeDays} days` : `${params.leadTimeChangeDays} days`}
            </span>
          </div>
          <input
            type="range"
            min="-10"
            max="30"
            step="1"
            value={params.leadTimeChangeDays}
            onChange={() => {}}
            disabled={true}
            style={{ width: '100%', cursor: 'not-allowed' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', color: '#64748B', marginTop: '3px' }}>
            <span>-5d (Air Freight)</span>
            <span>+15d (Port Congestion)</span>
          </div>
        </div>
      </div>
    </CinematicCard>
  );
};
