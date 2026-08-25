import React, { useState } from 'react';
import { CinematicCard } from '../ui/CinematicCard';
import { Badge } from '../ui/Badge';
import { ShieldAlert } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

interface HeatmapNode {
  id: string;
  name: string;
  category: string;
  likelihood: 'Low' | 'Medium' | 'High';
  severity: 'Low' | 'Medium' | 'Critical';
  riskScore: number;
  mitigation: string;
}

const heatmapNodes: HeatmapNode[] = [
  { id: '1', name: 'Taipei Organic Fabrics', category: 'Fabric Mill', likelihood: 'Low', severity: 'Medium', riskScore: 6, mitigation: 'Zero disruption • Stable ocean corridor' },
  { id: '2', name: 'Shenzhen Mega Spinning', category: 'Synthetic Mill', likelihood: 'Low', severity: 'Medium', riskScore: 12, mitigation: 'Dual-sourced with Frankfurt backup' },
  { id: '3', name: 'Hanoi Garments Ltd', category: 'Assembly Hub', likelihood: 'High', severity: 'Critical', riskScore: 38, mitigation: 'Auto-rerouted 15k units buffer to Taipei DC' },
  { id: '4', name: 'Frankfurt Eco Textiles', category: 'Fast-Track Mill', likelihood: 'Low', severity: 'Low', riskScore: 8, mitigation: 'Local EU hub • Lead time 3 days' },
  { id: '5', name: 'Americas Synthetic Mill', category: 'Performance Yarn', likelihood: 'Low', severity: 'Low', riskScore: 10, mitigation: 'Domestic USA routing • Zero tariff exposure' },
  { id: '6', name: 'Kyoto Precision Trims', category: 'Hardware', likelihood: 'Medium', severity: 'Low', riskScore: 5, mitigation: 'Safety buffer 45 days on hand' },
];

export const RiskHeatmapMatrix: React.FC = () => {
  const [selectedNode, setSelectedNode] = useState<HeatmapNode>(heatmapNodes[2]); // Default to Hanoi
  const { mode } = useTheme();
  const isLight = mode === 'light';

  const severityCols: ('Low' | 'Medium' | 'Critical')[] = ['Low', 'Medium', 'Critical'];
  const likelihoodRows: ('High' | 'Medium' | 'Low')[] = ['High', 'Medium', 'Low'];

  const getCellBg = (row: string, col: string) => {
    if (row === 'High' && col === 'Critical') return isLight ? 'rgba(244, 63, 94, 0.15)' : 'rgba(244, 63, 94, 0.25)';
    if ((row === 'High' && col === 'Medium') || (row === 'Medium' && col === 'Critical'))
      return isLight ? 'rgba(245, 158, 11, 0.12)' : 'rgba(245, 158, 11, 0.18)';
    if (row === 'Low' && col === 'Low') return isLight ? 'rgba(16, 185, 129, 0.08)' : 'rgba(16, 185, 129, 0.12)';
    return isLight ? 'rgba(6, 182, 212, 0.06)' : 'rgba(6, 182, 212, 0.08)';
  };

  return (
    <CinematicCard
      title="Multi-Dimensional Risk Heatmap Matrix"
      subtitle="Mapping disruption probability against business impact across supply chain partners"
      icon={<ShieldAlert size={18} color="#F43F5E" />}
      glowColor="rose"
      headerAction={<Badge variant="amber">1 High-Vulnerability Partner</Badge>}
    >
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 1fr)', gap: '20px', alignItems: 'center' }}>
        {/* 3x3 Heatmap Grid */}
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: '80px repeat(3, 1fr)', gap: '6px', textAlign: 'center', fontSize: '11px' }}>
            {/* Header row */}
            <div />
            <div style={{ color: '#64748B', fontWeight: 700 }}>Low Impact</div>
            <div style={{ color: '#64748B', fontWeight: 700 }}>Med Impact</div>
            <div style={{ color: '#64748B', fontWeight: 700 }}>Critical Impact</div>

            {/* Grid rows */}
            {likelihoodRows.map((row) => (
              <React.Fragment key={row}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: '8px', color: '#64748B', fontWeight: 700 }}>
                  {row} Prob.
                </div>
                {severityCols.map((col) => {
                  const matchingNodes = heatmapNodes.filter((n) => n.likelihood === row && n.severity === col);
                  return (
                    <div
                      key={`${row}-${col}`}
                      style={{
                        height: '75px',
                        borderRadius: '8px',
                        background: getCellBg(row, col),
                        border: isLight ? '1px solid rgba(15, 23, 42, 0.08)' : '1px solid rgba(255, 255, 255, 0.06)',
                        padding: '6px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '4px',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      {matchingNodes.map((node) => {
                        const isSelected = selectedNode?.id === node.id;
                        return (
                          <button
                            key={node.id}
                            onClick={() => setSelectedNode(node)}
                            style={{
                              padding: '3px 6px',
                              borderRadius: '6px',
                              background: isSelected
                                ? '#06B6D4'
                                : node.riskScore > 30
                                ? '#F43F5E'
                                : isLight
                                ? '#FFFFFF'
                                : 'rgba(255, 255, 255, 0.15)',
                              color: isSelected || node.riskScore > 30 ? '#FFFFFF' : isLight ? '#0F172A' : '#F8FAFC',
                              border: isSelected ? '1px solid #FFFFFF' : 'none',
                              fontSize: '10px',
                              fontWeight: 700,
                              cursor: 'pointer',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              maxWidth: '90%',
                            }}
                          >
                            {node.name.split(' ')[0]} ({node.riskScore})
                          </button>
                        );
                      })}
                    </div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Selected Risk Entity Detail */}
        <div
          style={{
            padding: '16px',
            borderRadius: '12px',
            background: isLight ? 'rgba(15, 23, 42, 0.04)' : 'rgba(255, 255, 255, 0.04)',
            border: isLight ? '1px solid rgba(15, 23, 42, 0.1)' : '1px solid rgba(244, 63, 94, 0.3)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '10px', fontWeight: 800, color: '#F43F5E', textTransform: 'uppercase' }}>
              Vulnerability Telemetry
            </span>
            <Badge variant={selectedNode.riskScore > 30 ? 'rose' : 'emerald'}>
              Risk: {selectedNode.riskScore}/100
            </Badge>
          </div>

          <h4 style={{ fontSize: '15px', fontWeight: 800, color: isLight ? '#0F172A' : '#F8FAFC', marginBottom: '2px' }}>
            {selectedNode.name}
          </h4>
          <p style={{ fontSize: '11px', color: '#94A3B8', marginBottom: '12px' }}>
            {selectedNode.category} • {selectedNode.likelihood} Probability / {selectedNode.severity} Severity
          </p>

          <div
            style={{
              padding: '10px',
              borderRadius: '8px',
              background: isLight ? 'rgba(244, 63, 94, 0.06)' : 'rgba(244, 63, 94, 0.1)',
              border: isLight ? '1px solid rgba(244, 63, 94, 0.15)' : '1px solid rgba(244, 63, 94, 0.2)',
              fontSize: '11px',
              color: isLight ? '#BE123C' : '#FB7185',
              lineHeight: '1.4',
            }}
          >
            <strong>Contingency Action:</strong> {selectedNode.mitigation}
          </div>
        </div>
      </div>
    </CinematicCard>
  );
};
