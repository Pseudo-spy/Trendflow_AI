import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { GlowButton } from '../ui/GlowButton';
import { Badge } from '../ui/Badge';
import { Cpu, Play, CheckCircle2, Layers } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { runSopEngine, type MaterialRequirementContract } from '../../services/api/sopApi';

interface QuickPlanningModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPlanningComplete?: (result: MaterialRequirementContract) => void;
}

export const QuickPlanningModal: React.FC<QuickPlanningModalProps> = ({ isOpen, onClose, onPlanningComplete }) => {
  const [sku, setSku] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  
  const [isRunning, setIsRunning] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [result, setResult] = useState<MaterialRequirementContract | null>(null);
  const { mode } = useTheme();
  const isLight = mode === 'light';

  const handleRunPlanning = async () => {
    if (!sku.trim()) {
      setValidationError('SKU is required.');
      return;
    }
    if (!targetDate) {
      setValidationError('Target Date is required.');
      return;
    }

    try {
      setValidationError(null);
      setApiError(null);
      setIsRunning(true);
      setIsCompleted(false);
      setResult(null);

      // Execute actual backend S&OP engine
      const response = await runSopEngine({ sku: sku.trim(), target_date: targetDate });
      
      setResult(response);
      
      if (onPlanningComplete) {
        onPlanningComplete(response);
      }

      setIsCompleted(true);
    } catch (error) {
      console.error('Failed to run SOP engine', error);
      setApiError('Failed to execute S&OP planning. Please verify the backend is running.');
      setIsCompleted(false);
    } finally {
      setIsRunning(false);
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    setIsCompleted(false);
    setResult(null);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="S&OP Material Planning"
      subtitle="Generate the current backend material requirement for a SKU and target date."
      maxWidth="lg"
    >
      {!isCompleted ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Engine Status Banner */}
          <div
            style={{
              padding: '12px 16px',
              borderRadius: '12px',
              background: isLight ? 'rgba(2, 132, 199, 0.08)' : 'rgba(6, 182, 212, 0.1)',
              border: isLight ? '1px solid rgba(2, 132, 199, 0.25)' : '1px solid rgba(6, 182, 212, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Cpu size={18} color="#06B6D4" />
              <div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: isLight ? '#0F172A' : '#F8FAFC' }}>
                  Material Planning Engine
                </div>
                <div style={{ fontSize: '11px', color: '#94A3B8' }}>
                  Execute backend material requirement planning
                </div>
              </div>
            </div>
            <Badge variant="cyan" pulse>
              Backend Prototype
            </Badge>
          </div>

          {/* Configuration Parameters */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            {/* Input 1: SKU */}
            <div
              style={{
                padding: '14px',
                borderRadius: '10px',
                background: isLight ? '#F8FAFC' : 'rgba(255, 255, 255, 0.03)',
                border: isLight ? '1px solid rgba(15, 23, 42, 0.08)' : '1px solid rgba(255, 255, 255, 0.08)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '12px', fontWeight: 600, color: isLight ? '#0F172A' : '#F8FAFC' }}>
                  Target SKU
                </span>
              </div>
              <input
                type="text"
                placeholder="e.g. TW001"
                value={sku}
                onChange={(e) => {
                  setSku(e.target.value);
                  setValidationError(null);
                }}
                disabled={isRunning}
                style={{ 
                  width: '100%', 
                  padding: '8px 12px', 
                  borderRadius: '6px', 
                  border: isLight ? '1px solid rgba(15, 23, 42, 0.1)' : '1px solid rgba(255, 255, 255, 0.1)',
                  background: isLight ? '#FFFFFF' : 'rgba(15, 23, 42, 0.5)',
                  color: isLight ? '#0F172A' : '#F8FAFC',
                  fontSize: '13px',
                  outline: 'none',
                }}
              />
            </div>

            {/* Input 2: Target Date */}
            <div
              style={{
                padding: '14px',
                borderRadius: '10px',
                background: isLight ? '#F8FAFC' : 'rgba(255, 255, 255, 0.03)',
                border: isLight ? '1px solid rgba(15, 23, 42, 0.08)' : '1px solid rgba(255, 255, 255, 0.08)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '12px', fontWeight: 600, color: isLight ? '#0F172A' : '#F8FAFC' }}>
                  Target Date
                </span>
              </div>
              <input
                type="date"
                value={targetDate}
                onChange={(e) => {
                  setTargetDate(e.target.value);
                  setValidationError(null);
                }}
                disabled={isRunning}
                style={{ 
                  width: '100%', 
                  padding: '8px 12px', 
                  borderRadius: '6px', 
                  border: isLight ? '1px solid rgba(15, 23, 42, 0.1)' : '1px solid rgba(255, 255, 255, 0.1)',
                  background: isLight ? '#FFFFFF' : 'rgba(15, 23, 42, 0.5)',
                  color: isLight ? '#0F172A' : '#F8FAFC',
                  fontSize: '13px',
                  outline: 'none',
                  colorScheme: isLight ? 'light' : 'dark',
                }}
              />
            </div>
          </div>

          {/* Action Buttons */}
          {validationError && (
            <div style={{ color: '#EF4444', fontSize: '12px', textAlign: 'right' }}>
              {validationError}
            </div>
          )}
          {apiError && (
            <div style={{ color: '#EF4444', fontSize: '12px', textAlign: 'right' }}>
              {apiError}
            </div>
          )}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
            <GlowButton variant="ghost" onClick={onClose} disabled={isRunning}>
              Cancel
            </GlowButton>
            <GlowButton
              variant="primary"
              icon={isRunning ? undefined : <Play size={15} fill="currentColor" />}
              loading={isRunning}
              onClick={handleRunPlanning}
              disabled={isRunning}
            >
              {isRunning ? 'Running S&OP...' : 'Generate Material Requirement'}
            </GlowButton>
          </div>
        </div>
      ) : (
        /* Results View */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', textAlign: 'center', padding: '20px 0' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid #16A34A',
              boxShadow: '0 0 25px rgba(16, 185, 129, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto',
            }}
          >
            <CheckCircle2 size={32} color="#16A34A" />
          </div>

          <div>
            <h3 style={{ fontSize: '20px', fontWeight: 800, color: isLight ? '#0F172A' : '#F8FAFC' }}>
              Material requirement generated.
            </h3>
            <p style={{ fontSize: '13px', color: '#94A3B8', marginTop: '4px' }}>
              Close this window to review the generated Material Requirements in the S&OP dashboard.
            </p>
          </div>
          
          {result && (
            <div style={{ 
              marginTop: '10px', 
              padding: '16px', 
              borderRadius: '8px', 
              background: isLight ? '#F8FAFC' : 'rgba(255, 255, 255, 0.03)',
              border: isLight ? '1px solid rgba(15, 23, 42, 0.08)' : '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              textAlign: 'left'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ padding: '8px', background: 'rgba(6, 182, 212, 0.15)', borderRadius: '6px' }}>
                  <Layers size={20} color="#06B6D4" />
                </div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: isLight ? '#0F172A' : '#F8FAFC' }}>
                    {result.material_id}
                  </div>
                  <div style={{ fontSize: '12px', color: '#64748B' }}>
                    Plant: {result.plant_id} | Date: {result.required_date}
                  </div>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '16px', fontWeight: 700, color: isLight ? '#0F172A' : '#F8FAFC', fontFamily: "'JetBrains Mono', monospace" }}>
                  {result.required_quantity.toLocaleString()}
                </div>
                <Badge variant={result.priority === 'HIGH' ? 'rose' : 'cyan'}>
                  {result.priority}
                </Badge>
              </div>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginTop: '10px' }}>
            <GlowButton variant="secondary" onClick={handleReset}>
              Close & View Results
            </GlowButton>
          </div>
        </div>
      )}
    </Modal>
  );
};
