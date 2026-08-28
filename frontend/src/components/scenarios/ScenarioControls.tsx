import React, { useState, useEffect } from 'react';
import { CinematicCard } from '../ui/CinematicCard';
import { Badge } from '../ui/Badge';
import { Sliders, Play } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { GlowButton } from '../ui/GlowButton';
import { type ScenarioRunRequest, type ScenarioName } from '../../services/api/scenarioApi';
import { useOutletContext } from 'react-router-dom';

interface ScenarioControlsProps {
  onRunSimulation: (request: ScenarioRunRequest) => void;
  isLoading: boolean;
  onInputChange?: () => void;
  apiError?: string | null;
}

export const ScenarioControls: React.FC<ScenarioControlsProps> = ({
  onRunSimulation,
  isLoading,
  onInputChange,
  apiError,
}) => {
  const { mode } = useTheme();
  const isLight = mode === 'light';
  
  const context = useOutletContext<any>();
  const sopResult = context?.latestSopResult;

  const [scenarioName, setScenarioName] = useState<ScenarioName>('supplier_disruption');
  const [materialId, setMaterialId] = useState<string>('MAT001');
  const [requiredQuantity, setRequiredQuantity] = useState<number>(30000);
  const [requiredDate, setRequiredDate] = useState<string>('2026-10-15');
  const [plantId, setPlantId] = useState<string>('PLANT001');
  const [priority, setPriority] = useState<string>('HIGH');
  const [targetSupplierId, setTargetSupplierId] = useState<string>('SUP001');
  const [magnitude, setMagnitude] = useState<number>(0.7);

  useEffect(() => {
    if (sopResult?.material_id && !materialId) {
      setMaterialId(sopResult.material_id);
    }
  }, [sopResult, materialId]);

  // Handle conditional logic for Target Supplier and Magnitude label
  let magnitudeLabel = 'Magnitude';
  let magnitudeHelper = '';
  let showTargetSupplier = true;

  if (scenarioName === 'supplier_disruption') {
    magnitudeLabel = 'Disruption Magnitude';
    magnitudeHelper = 'e.g. 0.7';
  } else if (scenarioName === 'lead_time_shock') {
    magnitudeLabel = 'Lead Time Shock';
    magnitudeHelper = 'value in days, e.g. 10';
  } else if (scenarioName === 'capacity_reduction') {
    magnitudeLabel = 'Capacity Reduction';
    magnitudeHelper = '0.5 = 50%';
  } else if (scenarioName === 'demand_spike') {
    magnitudeLabel = 'Demand Increase';
    magnitudeHelper = '0.2 = +20%';
    showTargetSupplier = false;
  }

  const handleRun = () => {
    if (!materialId.trim()) return;
    onRunSimulation({
      scenario_name: scenarioName,
      material_id: materialId.trim(),
      required_quantity: requiredQuantity,
      required_date: requiredDate,
      plant_id: plantId.trim(),
      priority: priority,
      target_supplier_id: showTargetSupplier ? targetSupplierId.trim() : null,
      magnitude: magnitude
    });
  };

  const inputStyle = {
    width: '100%',
    padding: '8px 12px',
    borderRadius: '6px',
    border: isLight ? '1px solid rgba(15, 23, 42, 0.1)' : '1px solid rgba(255, 255, 255, 0.1)',
    background: isLight ? '#FFFFFF' : 'rgba(15, 23, 42, 0.5)',
    color: isLight ? '#0F172A' : '#F8FAFC',
    fontSize: '13px',
    outline: 'none',
  };

  const disabledInputStyle = {
    ...inputStyle,
    opacity: 0.5,
    cursor: 'not-allowed'
  };

  const labelStyle = {
    fontSize: '12px',
    fontWeight: 600,
    color: isLight ? '#0F172A' : '#F8FAFC',
    marginBottom: '8px',
    display: 'block',
  };

  return (
    <CinematicCard
      title="Scenario Configuration"
      subtitle="Select a scenario type, material, and magnitude to evaluate supply chain resilience."
      icon={<Sliders size={18} color="#06B6D4" />}
      glowColor="cyan"
      headerAction={<Badge variant="cyan">{sopResult ? 'S&OP Prefilled' : 'Manual Input'}</Badge>}
    >
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '20px' }}>
        
        {/* Row 1 */}
        <div>
          <label style={labelStyle}>Scenario Type</label>
          <select
            value={scenarioName}
            onChange={(e) => {
              setScenarioName(e.target.value as ScenarioName);
              if (onInputChange) onInputChange();
            }}
            style={inputStyle}
            disabled={isLoading}
          >
            <option value="supplier_disruption">Supplier Disruption</option>
            <option value="lead_time_shock">Lead-Time Shock</option>
            <option value="capacity_reduction">Capacity Reduction</option>
            <option value="demand_spike">Demand Spike</option>
          </select>
        </div>

        <div>
          <label style={labelStyle}>Material ID</label>
          <input
            type="text"
            value={materialId}
            onChange={(e) => {
              setMaterialId(e.target.value);
              if (onInputChange) onInputChange();
            }}
            style={inputStyle}
            placeholder="e.g. MAT001"
            disabled={isLoading}
          />
        </div>

        {/* Row 2 */}
        <div>
          <label style={labelStyle}>Required Quantity</label>
          <input
            type="number"
            value={requiredQuantity}
            onChange={(e) => {
              setRequiredQuantity(parseInt(e.target.value));
              if (onInputChange) onInputChange();
            }}
            style={inputStyle}
            disabled={isLoading}
          />
        </div>

        <div>
          <label style={labelStyle}>Required Date</label>
          <input
            type="date"
            value={requiredDate}
            onChange={(e) => {
              setRequiredDate(e.target.value);
              if (onInputChange) onInputChange();
            }}
            style={inputStyle}
            disabled={isLoading}
          />
        </div>

        {/* Row 3 */}
        <div>
          <label style={labelStyle}>Plant ID</label>
          <input
            type="text"
            value={plantId}
            onChange={(e) => {
              setPlantId(e.target.value);
              if (onInputChange) onInputChange();
            }}
            style={inputStyle}
            placeholder="e.g. PLANT001"
            disabled={isLoading}
          />
        </div>

        <div>
          <label style={labelStyle}>Priority</label>
          <select
            value={priority}
            onChange={(e) => {
              setPriority(e.target.value);
              if (onInputChange) onInputChange();
            }}
            style={inputStyle}
            disabled={isLoading}
          >
            <option value="HIGH">HIGH</option>
            <option value="MEDIUM">MEDIUM</option>
            <option value="LOW">LOW</option>
          </select>
        </div>

        {/* Row 4 */}
        <div>
          <label style={labelStyle}>Target Supplier</label>
          <input
            type="text"
            value={showTargetSupplier ? targetSupplierId : ''}
            onChange={(e) => {
              setTargetSupplierId(e.target.value);
              if (onInputChange) onInputChange();
            }}
            style={showTargetSupplier && !isLoading ? inputStyle : disabledInputStyle}
            placeholder="e.g. SUP001"
            disabled={isLoading || !showTargetSupplier}
          />
        </div>

        <div>
          <label style={labelStyle}>{magnitudeLabel}</label>
          <input
            type="number"
            step="0.1"
            value={magnitude}
            onChange={(e) => {
              setMagnitude(parseFloat(e.target.value));
              if (onInputChange) onInputChange();
            }}
            style={inputStyle}
            disabled={isLoading}
          />
          <div style={{ fontSize: '10px', color: '#64748B', marginTop: '4px' }}>
            {magnitudeHelper}
          </div>
        </div>

      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '24px' }}>
        <div style={{ color: '#EF4444', fontSize: '13px', fontWeight: 500 }}>
          {apiError ? 'Scenario run failed. Please check the inputs and try again.' : ''}
        </div>
        <GlowButton
          variant="primary"
          size="lg"
          icon={isLoading ? undefined : <Play size={18} fill="currentColor" />}
          loading={isLoading}
          onClick={handleRun}
          disabled={isLoading || !materialId.trim()}
        >
          {isLoading ? 'Running Scenario...' : 'Run Scenario'}
        </GlowButton>
      </div>
    </CinematicCard>
  );
};
