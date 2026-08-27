import React, { useState } from 'react';
import { CinematicCard } from '../ui/CinematicCard';
import { GlowButton } from '../ui/GlowButton';
import { Play } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { Badge } from '../ui/Badge';
import type { SupplierItem } from '../../services/api/suppliersApi';
import type { MaterialItem } from '../../services/api/materialsApi';

interface RiskInputFormProps {
  onAnalyzeRisk: (supplierId: string, materialId: string) => void;
  onInputChange?: () => void;
  isLoading: boolean;
  suppliers: SupplierItem[];
  materials: MaterialItem[];
}

export const RiskInputForm: React.FC<RiskInputFormProps> = ({
  onAnalyzeRisk,
  onInputChange,
  isLoading,
  suppliers,
  materials
}) => {
  const { mode } = useTheme();
  const isLight = mode === 'light';

  const [supplierId, setSupplierId] = useState('');
  const [materialId, setMaterialId] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleRun = () => {
    setValidationError(null);
    if (!supplierId.trim()) return setValidationError('Supplier ID is required.');
    if (!materialId.trim()) return setValidationError('Material ID is required.');

    onAnalyzeRisk(supplierId.trim(), materialId.trim());
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
      title="Risk Assessment Input"
      subtitle="Select a supplier and material to evaluate the current backend risk profile."
      headerAction={<Badge variant="cyan">Manual Input</Badge>}
    >
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '20px' }}>
        <div>
          <label style={labelStyle}>Supplier</label>
          {suppliers.length > 0 ? (
            <select
              value={supplierId}
              onChange={(e) => { setSupplierId(e.target.value); setValidationError(null); if (onInputChange) onInputChange(); }}
              style={inputStyle}
              disabled={isLoading}
            >
              <option value="">Select a supplier...</option>
              {suppliers.map(s => (
                <option key={s.supplier_id} value={s.supplier_id}>{s.supplier_name} ({s.supplier_id})</option>
              ))}
            </select>
          ) : (
            <input
              type="text"
              value={supplierId}
              onChange={(e) => { setSupplierId(e.target.value); setValidationError(null); if (onInputChange) onInputChange(); }}
              style={inputStyle}
              placeholder="e.g. SUP001"
              disabled={isLoading}
            />
          )}
        </div>
        <div>
          <label style={labelStyle}>Material</label>
          {materials.length > 0 ? (
            <select
              value={materialId}
              onChange={(e) => { setMaterialId(e.target.value); setValidationError(null); if (onInputChange) onInputChange(); }}
              style={inputStyle}
              disabled={isLoading}
            >
              <option value="">Select a material...</option>
              {materials.map(m => (
                <option key={m.material_id} value={m.material_id}>{m.material_name} ({m.material_id})</option>
              ))}
            </select>
          ) : (
            <input
              type="text"
              value={materialId}
              onChange={(e) => { setMaterialId(e.target.value); setValidationError(null); if (onInputChange) onInputChange(); }}
              style={inputStyle}
              placeholder="e.g. MAT001"
              disabled={isLoading}
            />
          )}
        </div>
      </div>

      {validationError && (
        <div style={{ color: '#EF4444', fontSize: '12px', marginBottom: '16px' }}>
          {validationError}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <GlowButton
          variant="primary"
          icon={isLoading ? undefined : <Play size={15} fill="currentColor" />}
          loading={isLoading}
          onClick={handleRun}
          disabled={isLoading}
        >
          {isLoading ? 'Analyzing supplier risk...' : 'Analyze Risk'}
        </GlowButton>
      </div>
    </CinematicCard>
  );
};
