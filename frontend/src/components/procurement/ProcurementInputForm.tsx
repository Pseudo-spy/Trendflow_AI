import React, { useState, useEffect } from 'react';
import { CinematicCard } from '../ui/CinematicCard';
import { GlowButton } from '../ui/GlowButton';
import { Play } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { type MaterialRequirementContract } from '../../services/api/sopApi';
import { Badge } from '../ui/Badge';

interface ProcurementInputFormProps {
  latestSopResult: MaterialRequirementContract | null;
  onRunProcurement: (input: MaterialRequirementContract) => void;
  isLoading: boolean;
  onInputChange?: () => void;
  apiError?: string | null;
}

export const ProcurementInputForm: React.FC<ProcurementInputFormProps> = ({
  latestSopResult,
  onRunProcurement,
  isLoading,
  onInputChange,
  apiError,
}) => {
  const { mode } = useTheme();
  const isLight = mode === 'light';

  const [materialId, setMaterialId] = useState('');
  const [requiredQuantity, setRequiredQuantity] = useState('');
  const [requiredDate, setRequiredDate] = useState('');
  const [plantId, setPlantId] = useState('');
  const [priority, setPriority] = useState('HIGH');
  const [validationError, setValidationError] = useState<string | null>(null);

  // Auto-fill when latestSopResult changes
  useEffect(() => {
    if (latestSopResult) {
      setMaterialId(latestSopResult.material_id);
      setRequiredQuantity(latestSopResult.required_quantity.toString());
      setRequiredDate(latestSopResult.required_date);
      setPlantId(latestSopResult.plant_id);
      setPriority(latestSopResult.priority);
    }
  }, [latestSopResult]);

  const formatDateForDisplay = (isoDate: string) => {
    if (!isoDate) return '';
    const parts = isoDate.split('-');
    if (parts.length !== 3) return isoDate;
    const [year, month, day] = parts;
    return `${day}/${month}/${year}`;
  };

  const handleRun = () => {
    setValidationError(null);

    const qty = parseInt(requiredQuantity, 10);

    if (!materialId.trim()) return setValidationError('Material ID is required.');
    if (isNaN(qty) || qty <= 0) return setValidationError('Required Quantity must be a positive number.');
    if (!requiredDate.trim()) return setValidationError('Required Date is required.');
    if (!plantId.trim()) return setValidationError('Plant ID is required.');
    if (!priority.trim()) return setValidationError('Priority is required.');

    const dateMatch = requiredDate.trim().match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (!dateMatch) {
      return setValidationError('Required Date must be selected.');
    }

    const [, _year, month, day] = dateMatch;
    const dayNum = parseInt(day, 10);
    const monthNum = parseInt(month, 10);
    
    if (monthNum < 1 || monthNum > 12 || dayNum < 1 || dayNum > 31) {
      return setValidationError('Required Date is an invalid calendar date.');
    }

    onRunProcurement({
      material_id: materialId.trim(),
      required_quantity: qty,
      required_date: requiredDate.trim(),
      plant_id: plantId.trim(),
      priority: priority.trim(),
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

  const labelStyle = {
    fontSize: '12px',
    fontWeight: 600,
    color: isLight ? '#0F172A' : '#F8FAFC',
    marginBottom: '8px',
    display: 'block',
  };

  return (
    <CinematicCard
      title="Procurement Requirement"
      subtitle="Input parameters for supplier allocation."
      headerAction={latestSopResult ? <Badge variant="emerald">Source: Latest S&OP Result</Badge> : <Badge variant="cyan">Manual Input</Badge>}
    >
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '20px' }}>
        <div>
          <label style={labelStyle}>Material ID</label>
          <input
            type="text"
            value={materialId}
            onChange={(e) => { 
              setMaterialId(e.target.value); 
              setValidationError(null); 
              if (onInputChange) onInputChange(); 
            }}
            style={inputStyle}
            placeholder="e.g. MAT001"
            disabled={isLoading}
          />
        </div>
        <div>
          <label style={labelStyle}>Required Quantity</label>
          <input
            type="number"
            value={requiredQuantity}
            onChange={(e) => { 
              setRequiredQuantity(e.target.value); 
              setValidationError(null); 
              if (onInputChange) onInputChange(); 
            }}
            style={inputStyle}
            placeholder="e.g. 30000"
            disabled={isLoading}
            min="1"
          />
        </div>
        <div>
          <label style={labelStyle}>Required Date (DD/MM/YYYY)</label>
          <div style={{ ...inputStyle, position: 'relative', display: 'flex', alignItems: 'center', cursor: 'pointer', padding: '0 12px', height: '34px' }}>
            <span style={{ color: requiredDate ? (isLight ? '#0F172A' : '#F8FAFC') : '#94A3B8' }}>
              {requiredDate ? formatDateForDisplay(requiredDate) : 'DD/MM/YYYY'}
            </span>
            <span style={{ marginLeft: 'auto', fontSize: '14px' }}>📅</span>
            <input
              type="date"
              value={requiredDate}
              onClick={(e) => {
                try {
                  if ('showPicker' in HTMLInputElement.prototype) {
                    (e.target as HTMLInputElement).showPicker();
                  }
                } catch (err) {}
              }}
              onChange={(e) => { 
                setRequiredDate(e.target.value); 
                setValidationError(null); 
                if (onInputChange) onInputChange(); 
              }}
              disabled={isLoading}
              style={{
                position: 'absolute',
                top: 0, left: 0, width: '100%', height: '100%',
                opacity: 0,
                cursor: isLoading ? 'not-allowed' : 'pointer',
              }}
            />
          </div>
        </div>
        <div>
          <label style={labelStyle}>Plant ID</label>
          <input
            type="text"
            value={plantId}
            onChange={(e) => { 
              setPlantId(e.target.value); 
              setValidationError(null); 
              if (onInputChange) onInputChange(); 
            }}
            style={inputStyle}
            placeholder="e.g. PLANT001"
            disabled={isLoading}
          />
        </div>
        <div>
          <label style={labelStyle}>Priority</label>
          <input
            type="text"
            value={priority}
            onChange={(e) => { 
              setPriority(e.target.value); 
              setValidationError(null); 
              if (onInputChange) onInputChange(); 
            }}
            style={inputStyle}
            placeholder="e.g. HIGH"
            disabled={isLoading}
          />
        </div>
      </div>

      {(validationError || apiError) && (
        <div style={{ color: '#EF4444', fontSize: '12px', marginBottom: '16px' }}>
          {apiError || validationError}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
        <GlowButton
          variant="primary"
          size="lg"
          icon={isLoading ? undefined : <Play size={18} fill="currentColor" />}
          loading={isLoading}
          onClick={handleRun}
          disabled={isLoading}
        >
          {isLoading ? 'Running Allocation...' : 'Run Procurement Allocation'}
        </GlowButton>
      </div>
    </CinematicCard>
  );
};
