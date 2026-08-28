import React, { useState } from 'react';
import { CinematicCard } from '../ui/CinematicCard';
import { Badge } from '../ui/Badge';
import { GlowButton } from '../ui/GlowButton';
import { Play, Zap } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { runForecast, type ForecastRunResponse } from '../../services/api/demandApi';

export const DemandDriversChart: React.FC = () => {
  const [sku, setSku] = useState('');
  const [horizonMonths, setHorizonMonths] = useState<number>(3);
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<ForecastRunResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { mode } = useTheme();
  const isLight = mode === 'light';

  const handleRun = async () => {
    if (!sku.trim()) return;
    try {
      setRunning(true);
      setError(null);
      setResult(null);
      const res = await runForecast({
        sku: sku.trim(),
        horizon_months: horizonMonths,
      });
      setResult(res);
    } catch (err: any) {
      setError(err.message || 'Failed to run forecast');
    } finally {
      setRunning(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    padding: '8px 10px',
    borderRadius: '8px',
    background: isLight ? '#F8FAFC' : '#0A120D',
    border: isLight ? '1px solid #E2E8F0' : '1px solid #1B3B2B',
    color: isLight ? '#0F172A' : '#F0FDF4',
    fontSize: '13px',
    outline: 'none',
    width: '100%',
  };

  const detailRow = (label: string, value: React.ReactNode) => (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px 0',
        borderBottom: isLight ? '1px solid rgba(15, 23, 42, 0.06)' : '1px solid rgba(255, 255, 255, 0.06)',
      }}
    >
      <span style={{ fontSize: '12px', color: '#94A3B8', fontWeight: 500 }}>{label}</span>
      <span style={{ fontSize: '13px', fontWeight: 700, color: isLight ? '#0F172A' : '#F8FAFC' }}>
        {value}
      </span>
    </div>
  );

  return (
    <CinematicCard
      title="Forecast Engine"
      subtitle="Execute baseline demand forecast prototype"
      icon={<Zap size={18} color="#F59E0B" />}
      glowColor="amber"
      headerAction={<Badge variant="amber">Backend Prototype</Badge>}
    >
      {/* Inputs */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
        <div>
          <label style={{ fontSize: '11px', color: '#64748B', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px', display: 'block' }}>
            SKU *
          </label>
          <input
            type="text"
            placeholder="e.g. TW001"
            value={sku}
            onChange={e => setSku(e.target.value)}
            style={inputStyle}
          />
        </div>
        <div>
          <label style={{ fontSize: '11px', color: '#64748B', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px', display: 'block' }}>
            Horizon (months)
          </label>
          <input
            type="number"
            min={1}
            max={24}
            value={horizonMonths}
            onChange={e => setHorizonMonths(Number(e.target.value))}
            style={inputStyle}
          />
        </div>
        <GlowButton
          variant="primary"
          size="sm"
          icon={<Play size={12} />}
          onClick={handleRun}
          disabled={running || !sku.trim()}
          loading={running}
        >
          {running ? 'Running...' : 'Run Forecast'}
        </GlowButton>
      </div>

      {/* Error */}
      {error && (
        <div style={{ padding: '10px', borderRadius: '8px', background: 'rgba(244, 63, 94, 0.08)', border: '1px solid rgba(244, 63, 94, 0.2)', marginBottom: '12px' }}>
          <span style={{ fontSize: '12px', color: '#F43F5E' }}>{error}</span>
        </div>
      )}

      {/* Result */}
      {result && (
        <div>
          {detailRow('SKU', (
            <span style={{ fontFamily: "'JetBrains Mono', monospace", color: '#06B6D4' }}>
              {result.sku}
            </span>
          ))}
          {detailRow('Forecast', (
            <span style={{ fontFamily: "'JetBrains Mono', monospace", color: '#16A34A' }}>
              {result.forecast.toLocaleString()} units
            </span>
          ))}
          {detailRow('Confidence', (
            <span style={{ fontFamily: "'JetBrains Mono', monospace" }}>
              {result.confidence}%
            </span>
          ))}
          {detailRow('Model Version', (
            <Badge variant="muted">{result.model_version}</Badge>
          ))}
        </div>
      )}
    </CinematicCard>
  );
};
