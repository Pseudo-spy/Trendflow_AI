import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { GlowButton } from '../ui/GlowButton';
import { Badge } from '../ui/Badge';
import { Cpu, Play, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { runSopEngine } from '../../services/api/sopApi';

interface QuickPlanningModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QuickPlanningModal: React.FC<QuickPlanningModalProps> = ({ isOpen, onClose }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [serviceLevel, setServiceLevel] = useState(98.5);
  const [budgetLimit, setBudgetLimit] = useState(5000000);
  const [solverMode] = useState<'milp' | 'fast_heuristic'>('milp');
  const { mode } = useTheme();
  const isLight = mode === 'light';

  const handleRunPlanning = async () => {
    try {
      setIsRunning(true);
      setIsCompleted(false);

      // Execute actual backend S&OP engine
      await runSopEngine({ sku: 'TW001', target_date: '2026-10-15' });
      
      // Dispatch an event so page components can refresh their data
      window.dispatchEvent(new Event('sop-run-completed'));

      setIsCompleted(true);
    } catch (error) {
      console.error('Failed to run SOP engine', error);
      // Even on error, we handle it gracefully here or could add an error state to the modal
      setIsCompleted(false);
    } finally {
      setIsRunning(false);
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    setIsCompleted(false);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Autonomous S&OP & Procurement Planning Engine"
      subtitle="Execute Google OR-Tools MILP allocation across global supplier nodes"
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
                  Google OR-Tools Solver v9.8
                </div>
                <div style={{ fontSize: '11px', color: '#94A3B8' }}>
                  Target: Q3 FY2026 • 5 Facilities • 48 SKUs
                </div>
              </div>
            </div>
            <Badge variant="cyan" pulse>
              READY
            </Badge>
          </div>

          {/* Configuration Parameters */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            {/* Service Level Target */}
            <div
              style={{
                padding: '14px',
                borderRadius: '10px',
                background: isLight ? '#F8FAFC' : 'rgba(255, 255, 255, 0.03)',
                border: isLight ? '1px solid rgba(15, 23, 42, 0.08)' : '1px solid rgba(255, 255, 255, 0.08)',
                opacity: 0.6,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '12px', fontWeight: 600, color: isLight ? '#0F172A' : '#F8FAFC' }}>
                  Target Service Level
                </span>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#06B6D4', fontFamily: "'JetBrains Mono', monospace" }}>
                  {serviceLevel}%
                </span>
              </div>
              <input
                type="range"
                min="90"
                max="99.9"
                step="0.1"
                value={serviceLevel}
                onChange={(e) => setServiceLevel(parseFloat(e.target.value))}
                disabled={true}
                style={{ width: '100%', accentColor: '#06B6D4', cursor: 'not-allowed' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#64748B', marginTop: '4px' }}>
                <span>Backend Pending</span>
              </div>
            </div>

            {/* Budget Constraint */}
            <div
              style={{
                padding: '14px',
                borderRadius: '10px',
                background: isLight ? '#F8FAFC' : 'rgba(255, 255, 255, 0.03)',
                border: isLight ? '1px solid rgba(15, 23, 42, 0.08)' : '1px solid rgba(255, 255, 255, 0.08)',
                opacity: 0.6,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '12px', fontWeight: 600, color: isLight ? '#0F172A' : '#F8FAFC' }}>
                  Budget Cap Constraint
                </span>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#16A34A', fontFamily: "'JetBrains Mono', monospace" }}>
                  ${(budgetLimit / 1000000).toFixed(1)}M
                </span>
              </div>
              <input
                type="range"
                min="2000000"
                max="10000000"
                step="250000"
                value={budgetLimit}
                onChange={(e) => setBudgetLimit(parseInt(e.target.value))}
                disabled={true}
                style={{ width: '100%', accentColor: '#16A34A', cursor: 'not-allowed' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#64748B', marginTop: '4px' }}>
                <span>Backend Pending</span>
              </div>
            </div>
          </div>

          {/* Solver Mode Selection */}
          <div style={{ display: 'flex', gap: '12px', opacity: 0.6 }}>
            <button
              disabled={true}
              style={{
                flex: 1,
                padding: '12px',
                borderRadius: '10px',
                background: solverMode === 'milp' ? (isLight ? 'rgba(2, 132, 199, 0.15)' : 'rgba(6, 182, 212, 0.2)') : 'transparent',
                border: solverMode === 'milp' ? '1px solid #06B6D4' : (isLight ? '1px solid rgba(15, 23, 42, 0.1)' : '1px solid rgba(255, 255, 255, 0.1)'),
                color: isLight ? '#0F172A' : '#F8FAFC',
                cursor: 'not-allowed',
                textAlign: 'left',
              }}
            >
              <div style={{ fontSize: '13px', fontWeight: 700 }}>Exact MILP Optimization</div>
              <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '2px' }}>
                Backend Pending
              </div>
            </button>

            <button
              disabled={true}
              style={{
                flex: 1,
                padding: '12px',
                borderRadius: '10px',
                background: solverMode === 'fast_heuristic' ? (isLight ? 'rgba(99, 102, 241, 0.15)' : 'rgba(99, 102, 241, 0.2)') : 'transparent',
                border: solverMode === 'fast_heuristic' ? '1px solid #6366F1' : (isLight ? '1px solid rgba(15, 23, 42, 0.1)' : '1px solid rgba(255, 255, 255, 0.1)'),
                color: isLight ? '#0F172A' : '#F8FAFC',
                cursor: 'not-allowed',
                textAlign: 'left',
              }}
            >
              <div style={{ fontSize: '13px', fontWeight: 700 }}>Fast Heuristic Preview</div>
              <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '2px' }}>
                Backend Pending
              </div>
            </button>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
            <GlowButton variant="ghost" onClick={onClose}>
              Cancel
            </GlowButton>
            <GlowButton
              variant="primary"
              icon={isRunning ? undefined : <Play size={15} fill="currentColor" />}
              loading={isRunning}
              onClick={handleRunPlanning}
            >
              {isRunning ? 'Solving S&OP Constraints...' : 'Execute Planning Cycle'}
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
              Planning Cycle Completed Successfully
            </h3>
            <p style={{ fontSize: '13px', color: '#94A3B8', marginTop: '4px' }}>
              Optimal order allocations and safety stock levels computed for Q3 FY2026.
              Close this window to review the generated BOM Material Requirements.
            </p>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
            <GlowButton variant="secondary" onClick={handleReset}>
              Close & View Results
            </GlowButton>
            <GlowButton variant="primary" icon={<ShieldCheck size={16} />} disabled={true}>
              Commit Plan (Backend Pending)
            </GlowButton>
          </div>
        </div>
      )}
    </Modal>
  );
};
