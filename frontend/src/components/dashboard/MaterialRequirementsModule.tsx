import React from 'react';
import { CinematicCard } from '../ui/CinematicCard';
import { Badge } from '../ui/Badge';
import { Layers } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { type MaterialRequirementContract } from '../../services/api/sopApi';

interface MaterialRequirementsModuleProps {
  latestSopResult?: MaterialRequirementContract | null;
}

export const MaterialRequirementsModule: React.FC<MaterialRequirementsModuleProps> = ({ latestSopResult }) => {
  const { mode } = useTheme();
  const isLight = mode === 'light';

  return (
    <CinematicCard
      title="BOM Explosion & Material Sourcing"
      subtitle="Latest aggregate S&OP material requirement."
      icon={<Layers size={18} color="#06B6D4" />}
      glowColor="cyan"
      headerAction={<Badge variant="cyan">Latest S&OP Requirement</Badge>}
    >
      {!latestSopResult ? (
        <div style={{ padding: '24px', textAlign: 'center', color: '#64748B', fontSize: '13px' }}>
          <p style={{ margin: '0 0 4px 0', fontWeight: 600, color: isLight ? '#475569' : '#94A3B8' }}>No S&OP result available.</p>
          <p style={{ margin: 0, fontSize: '12px' }}>Run S&OP Planning to generate a material requirement.</p>
        </div>
      ) : (
        <div style={{ marginTop: '12px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: isLight ? '1px solid rgba(15, 23, 42, 0.1)' : '1px solid rgba(255, 255, 255, 0.1)', textAlign: 'left', color: isLight ? '#64748B' : '#94A3B8', fontSize: '11px', textTransform: 'uppercase' }}>
                <th style={{ padding: '8px 4px' }}>Material ID</th>
                <th style={{ padding: '8px 4px' }}>Required Quantity</th>
                <th style={{ padding: '8px 4px' }}>Required Date</th>
                <th style={{ padding: '8px 4px' }}>Plant ID</th>
                <th style={{ padding: '8px 4px' }}>Priority</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: isLight ? '1px solid rgba(15, 23, 42, 0.05)' : '1px solid rgba(255, 255, 255, 0.05)' }}>
                <td style={{ padding: '12px 4px', fontSize: '12px', fontWeight: 600, color: isLight ? '#0F172A' : '#F8FAFC' }}>
                  {latestSopResult.material_id}
                </td>
                <td style={{ padding: '12px 4px', fontSize: '12px', color: isLight ? '#334155' : '#CBD5E1', fontFamily: "'JetBrains Mono', monospace" }}>
                  {latestSopResult.required_quantity.toLocaleString()}
                </td>
                <td style={{ padding: '12px 4px', fontSize: '12px', color: isLight ? '#334155' : '#CBD5E1' }}>
                  {latestSopResult.required_date}
                </td>
                <td style={{ padding: '12px 4px', fontSize: '12px', color: isLight ? '#334155' : '#CBD5E1' }}>
                  {latestSopResult.plant_id}
                </td>
                <td style={{ padding: '12px 4px', fontSize: '12px' }}>
                  <Badge variant={latestSopResult.priority === 'CRITICAL' ? 'rose' : 'emerald'}>
                    {latestSopResult.priority || 'HIGH'}
                  </Badge>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </CinematicCard>
  );
};
