import React from 'react';
import { CinematicCard } from '../ui/CinematicCard';
import { Badge } from '../ui/Badge';
import { Cpu } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

export const ScenarioAllocationShift: React.FC = () => {
  const { mode } = useTheme();
  const isLight = mode === 'light';

  return (
    <CinematicCard
      title="Dynamic Supplier Allocation Shift & Rebalancing"
      subtitle="OR-Tools MILP quota redistribution adapting to capacity constraints, offline facilities, and tariffs"
      icon={<Cpu size={18} color="#06B6D4" />}
      glowColor="cyan"
      headerAction={<Badge variant="cyan">Dynamic Reallocation</Badge>}
    >
      <div style={{ width: '100%', height: '220px', marginTop: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: isLight ? 'rgba(15, 23, 42, 0.02)' : 'rgba(255, 255, 255, 0.02)', borderRadius: '8px', border: isLight ? '1px dashed rgba(15, 23, 42, 0.1)' : '1px dashed rgba(255, 255, 255, 0.1)' }}>
        <div style={{ textAlign: 'center', color: '#64748B' }}>
          <Cpu size={24} style={{ opacity: 0.5, marginBottom: '8px' }} />
          <div style={{ fontSize: '13px', fontWeight: 600 }}>Backend Capability Missing</div>
          <div style={{ fontSize: '11px', marginTop: '4px' }}>Reallocation logic pending FastAPI endpoint implementation.</div>
        </div>
      </div>
    </CinematicCard>
  );
};
