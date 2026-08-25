import React, { useState } from 'react';
import { SceneCanvas } from '../../three/SceneCanvas';
import { procurementSuppliers } from '../../scenes/mock3DData';
const ProcurementAllocation3D = React.lazy(() => import('../../scenes/ProcurementAllocation3D').then(m => ({ default: m.ProcurementAllocation3D })));
import type { SupplyChainNodeData } from '../../types/three';
import { Badge } from '../ui/Badge';
import { GlowButton } from '../ui/GlowButton';
import { Compass, Cpu, Zap } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { useMediaQuery } from '../../hooks/useMediaQuery';

export const ProcurementHero: React.FC = () => {
  const [selectedSupplier, setSelectedSupplier] = useState<SupplyChainNodeData | null>(procurementSuppliers[0]);
  const { mode, cameraParallax, setCameraParallax } = useTheme();
  const isLight = mode === 'light';
  const isMobile = useMediaQuery('(max-width: 768px)');

  const activeSupplier = selectedSupplier || procurementSuppliers[0];

  return (
    <div
      style={{
        position: 'relative',
        borderRadius: '20px',
        background: isLight
          ? 'linear-gradient(145deg, rgba(255, 255, 255, 0.95) 0%, rgba(241, 245, 249, 0.9) 100%)'
          : 'linear-gradient(145deg, rgba(23, 34, 59, 0.85) 0%, rgba(7, 12, 24, 0.95) 100%)',
        border: isLight ? '1px solid rgba(2, 132, 199, 0.25)' : '1px solid rgba(6, 182, 212, 0.35)',
        boxShadow: isLight
          ? '0 20px 50px rgba(2, 132, 199, 0.1)'
          : '0 20px 50px rgba(0, 0, 0, 0.7), 0 0 30px rgba(6, 182, 212, 0.15)',
        overflow: 'hidden',
        marginBottom: '28px',
        padding: '20px 24px',
      }}
    >
      {/* Top Specular Ambient Line */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '2px',
          background: 'linear-gradient(90deg, transparent, #06B6D4, #6366F1, #16A34A, transparent)',
        }}
      />

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
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #6366F1 0%, #06B6D4 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 15px rgba(99, 102, 241, 0.4)',
            }}
          >
            <Cpu size={20} color="#FFFFFF" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 800, color: isLight ? '#0F172A' : '#F8FAFC' }}>
                3D Optimal Supplier Allocation Flow
              </h2>
              <Badge variant="cyan" pulse>
                OR-TOOLS MILP
              </Badge>
            </div>
            <p style={{ fontSize: '11px', color: '#94A3B8' }}>
              125,000 Units allocated across tiered MOQs, lead times, and customs tariffs
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
              background: cameraParallax ? 'rgba(99, 102, 241, 0.15)' : 'rgba(255, 255, 255, 0.05)',
              border: cameraParallax ? '1px solid rgba(99, 102, 241, 0.4)' : '1px solid rgba(255, 255, 255, 0.1)',
              color: cameraParallax ? '#818CF8' : '#94A3B8',
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

      {/* Main 3D Canvas Area with Integrated Supplier Allocation Inspector HUD */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'minmax(0, 1fr) 330px',
          gap: '16px',
          minHeight: '280px',
        }}
      >
        {/* 3D WebGL Canvas */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: isMobile ? '200px' : '280px',
            borderRadius: '14px',
            overflow: 'hidden',
            background: isLight ? 'rgba(241, 245, 249, 0.7)' : 'rgba(3, 7, 18, 0.8)',
            border: isLight ? '1px solid rgba(15, 23, 42, 0.1)' : '1px solid rgba(6, 182, 212, 0.25)',
            boxShadow: '0 10px 30px rgba(0,0,0,0.5) inset',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: '12px',
              left: '14px',
              zIndex: 10,
              pointerEvents: 'none',
              background: 'rgba(7, 12, 24, 0.85)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(6, 182, 212, 0.3)',
              borderRadius: '8px',
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
                backgroundColor: '#06B6D4',
                boxShadow: '0 0 6px #06B6D4',
              }}
            />
            <span style={{ fontSize: '10px', fontWeight: 600, color: '#F8FAFC' }}>
              Interactive 3D Allocation Flow • Click any supplier node to inspect allocation terms
            </span>
          </div>

          <SceneCanvas
            enableOrbit={true}
            enableParallax={cameraParallax}
            cameraPosition={[0, 5, 16]}
            fov={44}
          >
            <React.Suspense fallback={null}>
              <ProcurementAllocation3D
                selectedSupplier={selectedSupplier}
                onSelectSupplier={setSelectedSupplier}
              />
            </React.Suspense>
          </SceneCanvas>
        </div>

        {/* Supplier Allocation Inspector HUD */}
        <div
          style={{
            borderRadius: '14px',
            background: isLight ? 'rgba(255, 255, 255, 0.9)' : 'rgba(11, 17, 32, 0.85)',
            border: isLight ? '1px solid rgba(15, 23, 42, 0.12)' : '1px solid rgba(99, 102, 241, 0.3)',
            padding: '18px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={{ fontSize: '10px', fontWeight: 800, color: '#06B6D4', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Supplier Allocation Inspector
              </span>
              <Badge variant={activeSupplier.status === 'optimal' ? 'emerald' : 'amber'}>
                {activeSupplier.status.toUpperCase()}
              </Badge>
            </div>

            <h3 style={{ fontSize: '17px', fontWeight: 800, color: isLight ? '#0F172A' : '#F8FAFC', marginBottom: '2px' }}>
              {activeSupplier.name}
            </h3>
            <p style={{ fontSize: '11px', color: '#94A3B8', marginBottom: '14px' }}>
              {activeSupplier.city} • {activeSupplier.country}
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '14px' }}>
              <div style={{ padding: '10px', borderRadius: '8px', background: isLight ? 'rgba(15, 23, 42, 0.04)' : 'rgba(255, 255, 255, 0.04)' }}>
                <div style={{ fontSize: '10px', color: '#64748B' }}>Allocated Volume</div>
                <div style={{ fontSize: '16px', fontWeight: 800, color: '#06B6D4', fontFamily: "'JetBrains Mono', monospace" }}>
                  {activeSupplier.throughput.toLocaleString()} u
                </div>
              </div>
              <div style={{ padding: '10px', borderRadius: '8px', background: isLight ? 'rgba(15, 23, 42, 0.04)' : 'rgba(255, 255, 255, 0.04)' }}>
                <div style={{ fontSize: '10px', color: '#64748B' }}>Lead Time</div>
                <div style={{ fontSize: '16px', fontWeight: 800, color: '#6366F1', fontFamily: "'JetBrains Mono', monospace" }}>
                  {activeSupplier.leadTimeDays} days
                </div>
              </div>
              <div style={{ padding: '10px', borderRadius: '8px', background: isLight ? 'rgba(15, 23, 42, 0.04)' : 'rgba(255, 255, 255, 0.04)' }}>
                <div style={{ fontSize: '10px', color: '#64748B' }}>Supplier Capacity</div>
                <div style={{ fontSize: '16px', fontWeight: 800, color: '#16A34A', fontFamily: "'JetBrains Mono', monospace" }}>
                  {activeSupplier.capacity}%
                </div>
              </div>
              <div style={{ padding: '10px', borderRadius: '8px', background: isLight ? 'rgba(15, 23, 42, 0.04)' : 'rgba(255, 255, 255, 0.04)' }}>
                <div style={{ fontSize: '10px', color: '#64748B' }}>Risk Score</div>
                <div style={{ fontSize: '16px', fontWeight: 800, color: activeSupplier.riskScore > 30 ? '#F43F5E' : '#16A34A', fontFamily: "'JetBrains Mono', monospace" }}>
                  {activeSupplier.riskScore} / 100
                </div>
              </div>
            </div>

            <div
              style={{
                padding: '10px 12px',
                borderRadius: '8px',
                background: isLight ? 'rgba(99, 102, 241, 0.06)' : 'rgba(99, 102, 241, 0.08)',
                border: isLight ? '1px solid rgba(99, 102, 241, 0.15)' : '1px solid rgba(99, 102, 241, 0.2)',
                fontSize: '11px',
                color: isLight ? '#4338CA' : '#818CF8',
                lineHeight: '1.4',
              }}
            >
              <strong>MILP Solver Output:</strong> Allocation satisfies vendor MOQ discounts and minimizes aggregate landed tariff cost.
            </div>
          </div>

          <div style={{ marginTop: '12px' }}>
            <GlowButton variant="primary" size="sm" icon={<Zap size={13} />} style={{ width: '100%' }} disabled={true}>
              EDI Integration (Pending)
            </GlowButton>
          </div>
        </div>
      </div>

      {/* Supplier Selector Ribbon */}
      <div style={{ display: 'flex', gap: '8px', marginTop: '14px', overflowX: 'auto', paddingBottom: '4px' }}>
        {procurementSuppliers.map((supp) => {
          const isSelected = activeSupplier.id === supp.id;
          return (
            <button
              key={supp.id}
              onClick={() => setSelectedSupplier(supp)}
              style={{
                padding: '6px 12px',
                borderRadius: '8px',
                background: isSelected
                  ? isLight
                    ? 'rgba(2, 132, 199, 0.15)'
                    : 'rgba(6, 182, 212, 0.2)'
                  : isLight
                  ? 'rgba(15, 23, 42, 0.04)'
                  : 'rgba(255, 255, 255, 0.04)',
                border: isSelected
                  ? '1px solid #06B6D4'
                  : isLight
                  ? '1px solid rgba(15, 23, 42, 0.08)'
                  : '1px solid rgba(255, 255, 255, 0.08)',
                color: isSelected ? (isLight ? '#0284C7' : '#38BDF8') : (isLight ? '#475569' : '#94A3B8'),
                fontSize: '11px',
                fontWeight: isSelected ? 700 : 500,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease',
              }}
            >
              {supp.name}
            </button>
          );
        })}
      </div>
    </div>
  );
};
