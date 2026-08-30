import React, { useState } from 'react';
import { SceneCanvas } from '../../three/SceneCanvas';
import { controlTowerNodes } from '../../scenes/mock3DData';
const ControlTowerHero3D = React.lazy(() => import('../../scenes/ControlTowerHero3D').then(m => ({ default: m.ControlTowerHero3D })));
import type { SupplyChainNodeData } from '../../types/three';
import { Badge } from '../ui/Badge';
import {
  Compass,
  Layers,
} from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { useMediaQuery } from '../../hooks/useMediaQuery';

export const ControlTowerHero: React.FC = () => {
  const [selectedNode, setSelectedNode] = useState<SupplyChainNodeData | null>(controlTowerNodes[0]);
  const [cameraParallax, setCameraParallax] = useState(true);
  const { mode } = useTheme();
  const isLight = mode === 'light';
  const isMobile = useMediaQuery('(max-width: 768px)');

  const activeNode = selectedNode || controlTowerNodes[0];

  return (
    <div
      style={{
        position: 'relative',
        borderRadius: '14px',
        background: isLight ? '#FFFFFF' : '#090D0B',
        border: isLight ? '1px solid #D1FAE5' : '1px solid #16241C',
        boxShadow: isLight
          ? '0 1px 3px rgba(0, 0, 0, 0.05), 0 4px 12px rgba(0, 0, 0, 0.05)'
          : '0 1px 3px rgba(0, 0, 0, 0.8), 0 6px 16px rgba(0, 0, 0, 0.6)',
        overflow: 'hidden',
        marginBottom: '28px',
        padding: '20px 24px',
      }}
    >
      {/* Header Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '16px',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #16A34A 0%, #15803D 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 14px rgba(16, 185, 129, 0.45)',
            }}
          >
            <Layers size={20} color="#FFFFFF" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 style={{ fontSize: '17px', fontWeight: 800, color: isLight ? '#064E3B' : '#F0FDF4' }}>
                Spatial Supply Chain Digital Twin
              </h2>
              <Badge variant="cyan" pulse={false}>
                SIMULATION VIEW
              </Badge>
            </div>

            <p style={{ fontSize: '11px', color: isLight ? '#15803D' : '#86A795' }}>
              Interactive 3D network with OR-Tools solver mapping & dynamic photon streams representing material flows.
            </p>
          </div>
        </div>

        {/* View Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={() => setCameraParallax(!cameraParallax)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '8px',
              background: cameraParallax ? '#071A11' : isLight ? '#F0FDF4' : '#040705',
              border: cameraParallax ? '1px solid #16A34A' : isLight ? '1px solid #D1FAE5' : '1px solid #162E20',
              color: cameraParallax ? '#16A34A' : isLight ? '#047857' : '#86A795',
              fontSize: '11px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            <Compass size={13} />
            <span>Mouse Parallax: {cameraParallax ? 'ON' : 'OFF'}</span>
          </button>
        </div>
      </div>

      {/* Main 3D Canvas Area with Integrated Node Telemetry Inspector */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'minmax(0, 1fr) 340px',
          gap: '16px',
          minHeight: '280px',
        }}
      >
        {/* 3D WebGL Viewport */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: isMobile ? '200px' : '280px',
            borderRadius: '14px',
            overflow: 'hidden',
            background: isLight ? '#F8FAFC' : '#000000',
            border: isLight ? '1px solid #D1FAE5' : '1px solid #16241C',
            boxShadow: '0 2px 8px rgba(0,0,0,0.4) inset',
          }}
        >
          {/* Top Instruction Pill */}
          <div
            style={{
              position: 'absolute',
              top: '12px',
              left: '14px',
              zIndex: 10,
              pointerEvents: 'none',
              background: isLight ? '#FFFFFF' : '#07120C',
              border: isLight ? '1px solid #D1FAE5' : '1px solid #162E20',
              boxShadow: '0 2px 6px rgba(0,0,0,0.5)',
              borderRadius: '6px',
              padding: '4px 10px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: '#16A34A',
                boxShadow: '0 0 6px #16A34A',
              }}
            />
            <span style={{ fontSize: '10px', fontWeight: 600, color: isLight ? '#064E3B' : '#F0FDF4' }}>
              Click a node to view details
            </span>
          </div>

          <SceneCanvas
            enableOrbit={true}
            enableParallax={cameraParallax}
            cameraPosition={[0, 7.5, 24]}
            fov={44}
          >
            <React.Suspense fallback={null}>
              <ControlTowerHero3D
                selectedNode={selectedNode}
                hoveredNode={null}
                onSelectNode={setSelectedNode}
              />
            </React.Suspense>
          </SceneCanvas>
        </div>

        {/* Live Node Telemetry Inspector HUD */}
        {(() => {
          const nodeContext: Record<string, { role: string; input: string; output: string; feedsInto: string; purpose: string }> = {
            'node-demand': {
              role: 'Demand Input Node',
              input: 'Historical Sales Data',
              output: 'Demand Signal',
              feedsInto: 'Forecasting',
              purpose: 'Captures historical customer demand signals that form the foundation for future demand forecasting.',
            },
            'node-forecast': {
              role: 'Forecasting Node',
              input: 'Historical Demand',
              output: 'Forecast Quantity + Confidence',
              feedsInto: 'S&OP Planning',
              purpose: 'Transforms historical demand patterns into projected demand quantities and confidence estimates.',
            },
            'node-sop': {
              role: 'Planning Coordination Node',
              input: 'Forecast Demand + Available Inventory',
              output: 'Net Requirement + Material Requirement',
              feedsInto: 'Production & Procurement Planning',
              purpose: 'Balances forecast demand with available inventory and converts the resulting requirement into coordinated production and material planning.',
            },
            'node-inventory': {
              role: 'Inventory Node',
              input: 'SKU + Location Stock',
              output: 'Available Inventory',
              feedsInto: 'S&OP Net Demand Calculation',
              purpose: 'Provides location-level available stock used to reduce the quantity that must be newly produced.',
            },
            'node-production': {
              role: 'Production Planning Node',
              input: 'Net Demand + Capacity',
              output: 'Production Requirement',
              feedsInto: 'Material Planning',
              purpose: 'Determines the production requirement after considering net demand and available manufacturing capacity.',
            },
            'node-materials': {
              role: 'Material Requirement Node',
              input: 'Production Requirement',
              output: 'Required Material Quantity',
              feedsInto: 'Procurement',
              purpose: 'Converts production requirements into the raw-material quantities needed for sourcing.',
            },
            'node-suppliers': {
              role: 'Supplier Network Node',
              input: 'Supplier Capacity + Price + Performance',
              output: 'Eligible Supplier Options',
              feedsInto: 'Procurement Optimization',
              purpose: 'Represents eligible sourcing partners and the commercial and performance information used by procurement.',
            },
            'node-procurement': {
              role: 'Procurement Decision Node',
              input: 'Material Requirement + Supplier Options',
              output: 'Supplier Allocation + Cost',
              feedsInto: 'Risk & Scenario Analysis',
              purpose: 'Allocates required materials across eligible suppliers while considering sourcing constraints and procurement objectives.',
            },
            'node-risk': {
              role: 'Risk Assessment Node',
              input: 'Supplier Performance + Delivery + Quality Signals',
              output: 'Risk Score + Risk Level',
              feedsInto: 'Procurement Decision Support',
              purpose: 'Evaluates supplier-related delivery and quality risk to support safer procurement decisions.',
            },
          };
          const ctx = nodeContext[activeNode.id] || {
            role: `${activeNode.type} Node`,
            input: '—',
            output: '—',
            feedsInto: '—',
            purpose: '',
          };
          const rows: { label: string; value: string }[] = [
            { label: 'Role in Pipeline', value: ctx.role },
            { label: 'Input', value: ctx.input },
            { label: 'Output', value: ctx.output },
            { label: 'Feeds Into', value: ctx.feedsInto },
          ];
          const valueAccent = isLight ? '#059669' : '#34D399';
          return (
            <div
              style={{
                borderRadius: '10px',
                background: isLight ? '#F0FDF4' : '#040705',
                border: isLight ? '1px solid #D1FAE5' : '1px solid #16241C',
                padding: '18px',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 1px 4px rgba(0,0,0,0.4)',
              }}
            >
              <div style={{ marginBottom: '14px' }}>
                <span style={{ fontSize: '10px', fontWeight: 800, color: '#16A34A', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Node Telemetry Inspector
                </span>
              </div>

              <h3 style={{ fontSize: '17px', fontWeight: 800, color: isLight ? '#064E3B' : '#F0FDF4', marginBottom: '2px' }}>
                {activeNode.name}
              </h3>
              <p style={{ fontSize: '11px', color: isLight ? '#15803D' : '#86A795', marginBottom: '16px' }}>
                {activeNode.city} • {activeNode.country}
              </p>

              {/* Workflow Context Rows */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {rows.map((row) => (
                  <div
                    key={row.label}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      fontSize: '11px',
                      gap: '12px',
                    }}
                  >
                    <span style={{ color: isLight ? '#047857' : '#86A795', whiteSpace: 'nowrap', flexShrink: 0 }}>
                      {row.label}
                    </span>
                    <span style={{ fontWeight: 700, color: valueAccent, textAlign: 'right' }}>
                      {row.value}
                    </span>
                  </div>
                ))}
              </div>

              {/* Node Purpose */}
              {ctx.purpose && (
                <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: isLight ? '1px solid #D1FAE5' : '1px solid #16241C' }}>
                  <span style={{ fontSize: '9px', fontWeight: 800, color: '#16A34A', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    Node Purpose
                  </span>
                  <p style={{ fontSize: '11px', lineHeight: '1.5', color: isLight ? '#15803D' : '#86A795', marginTop: '6px' }}>
                    {ctx.purpose}
                  </p>
                </div>
              )}
            </div>
          );
        })()}
      </div>

      {/* Node Selector Ribbon */}
      <div style={{ display: 'flex', gap: '8px', marginTop: '16px', overflowX: 'auto', paddingBottom: '4px' }}>
        {controlTowerNodes.map((node, index) => {
          const isSelected = activeNode.id === node.id;
          return (
            <button
              key={node.id}
              onClick={() => setSelectedNode(node)}
              style={{
                padding: '6px 12px',
                borderRadius: '8px',
                background: isSelected
                  ? isLight
                    ? 'rgba(16, 185, 129, 0.15)'
                    : 'rgba(16, 185, 129, 0.2)'
                  : isLight
                  ? 'rgba(15, 23, 42, 0.04)'
                  : 'rgba(255, 255, 255, 0.04)',
                border: isSelected
                  ? '1px solid #16A34A'
                  : isLight
                  ? '1px solid rgba(15, 23, 42, 0.08)'
                  : '1px solid rgba(255, 255, 255, 0.08)',
                color: isSelected ? (isLight ? '#15803D' : '#34D399') : (isLight ? '#475569' : '#94A3B8'),
                fontSize: '11px',
                fontWeight: isSelected ? 700 : 500,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease',
              }}
            >
              {index + 1}. {node.name.replace(/^\d+\.\s*/, '')}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ControlTowerHero;
