import React, { useState } from 'react';
import { PageTransitionLayout } from '../layouts/PageTransitionLayout';
import { PageHeader } from '../components/ui/PageHeader';
import { MetricCard } from '../components/ui/MetricCard';
import { CinematicCard } from '../components/ui/CinematicCard';
import { GlowTabs } from '../components/ui/GlowTabs';
import { SceneCanvas } from '../three/SceneCanvas';
const SupplyChainScene = React.lazy(() => import('../scenes/SupplyChainScene').then(m => ({ default: m.SupplyChainScene })));
import { useTheme } from '../hooks/useTheme';
import {
  TrendingUp,
  Package,
  Layers,
  ShieldCheck,
  Compass,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const sampleChartData = [
  { month: 'Jan', demand: 4200, supply: 4000, forecast: 4300 },
  { month: 'Feb', demand: 5100, supply: 4900, forecast: 5200 },
  { month: 'Mar', demand: 6800, supply: 6500, forecast: 6700 },
  { month: 'Apr', demand: 8400, supply: 8200, forecast: 8500 },
  { month: 'May', demand: 9200, supply: 9000, forecast: 9300 },
  { month: 'Jun', demand: 11500, supply: 11200, forecast: 11800 },
];

export const OverviewPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('3d-showcase');
  const { mode, cameraParallax, setCameraParallax } = useTheme();
  const isLight = mode === 'light';

  return (
    <PageTransitionLayout>
      <PageHeader
        title="TrendFlow AI Command Center"
        subtitle="Integrated S&OP, probabilistic demand intelligence & multi-echelon procurement optimization"
        badgeText="V3 3D Engine • Active"
        badgeVariant="cyan"
      />

      {/* Metric Cards Row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px',
          marginBottom: '28px',
        }}
      >
        <MetricCard
          label="Total Global Demand"
          value={184250}
          suffix=" units"
          decimals={0}
          change={12.4}
          changeLabel="vs last quarter"
          icon={<TrendingUp size={16} />}
          glowColor="cyan"
        />

        <MetricCard
          label="Forecast Accuracy"
          value={96.8}
          suffix="%"
          decimals={1}
          change={2.1}
          changeLabel="MAPE optimization"
          icon={<Layers size={16} />}
          glowColor="indigo"
        />

        <MetricCard
          label="Inventory Health Index"
          value={94.2}
          suffix="%"
          decimals={1}
          statusBadge={{ label: 'Optimal Buffer', variant: 'emerald' }}
          icon={<Package size={16} />}
          glowColor="emerald"
        />

        <MetricCard
          label="Supplier Risk Rating"
          value={18.4}
          suffix=" / 100"
          decimals={1}
          statusBadge={{ label: 'Low Disruption', variant: 'emerald' }}
          icon={<ShieldCheck size={16} />}
          glowColor="emerald"
        />
      </div>

      {/* Interactive Tabs Header with 3D Controls */}
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
        <GlowTabs
          tabs={[
            { id: '3d-showcase', label: '3D Spatial Twin' },
            { id: 'analytics', label: 'Demand vs S&OP Trajectory' },
          ]}
          activeTab={activeTab}
          onChange={setActiveTab}
        />

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={() => setCameraParallax(!cameraParallax)}
            style={{
              padding: '6px 12px',
              borderRadius: '8px',
              background: cameraParallax ? 'rgba(99, 102, 241, 0.15)' : 'rgba(255, 255, 255, 0.05)',
              border: cameraParallax ? '1px solid rgba(99, 102, 241, 0.4)' : '1px solid rgba(255, 255, 255, 0.1)',
              color: cameraParallax ? '#818CF8' : '#94A3B8',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Compass size={14} />
            <span>Mouse Parallax: {cameraParallax ? 'ON' : 'OFF'}</span>
          </button>
        </div>
      </div>

      {/* Tab 1: 3D Foundation Showcase View */}
      {activeTab === '3d-showcase' && (
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
          {/* Real 3D Interactive Canvas Box */}
          <CinematicCard
            title="3D Component Foundation Playground"
            subtitle="Testing FloatingObject, GlowingNode, ConnectionLine, OrbitingObject, PulseEffect & DataParticle"
            glowColor="cyan"
            style={{ minHeight: '440px', display: 'flex', flexDirection: 'column' }}
          >
            <div
              style={{
                flex: 1,
                minHeight: '380px',
                borderRadius: '12px',
                overflow: 'hidden',
                background: isLight ? 'rgba(241, 245, 249, 0.6)' : 'rgba(3, 7, 18, 0.7)',
                position: 'relative',
                border: isLight ? '1px solid rgba(15, 23, 42, 0.08)' : '1px solid rgba(6, 182, 212, 0.2)',
              }}
            >
              <SceneCanvas
                enableOrbit={true}
                enableParallax={cameraParallax}
                cameraPosition={[0, 4, 14]}
                fov={45}
              >
                <React.Suspense fallback={null}>
                  <SupplyChainScene />
                </React.Suspense>
              </SceneCanvas>
            </div>
          </CinematicCard>

          {/* Interactive Inspection & State Box */}
          <CinematicCard
            title="Live Node Telemetry"
            subtitle="Real-time 3D state inspection"
            glowColor="indigo"
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <p style={{ fontSize: '12px', color: '#94A3B8', lineHeight: '1.5' }}>
                Interact with the 3D canvas on the left. Hover over glowing nodes to inspect supply-chain facilities, or rotate and zoom using mouse orbit controls.
              </p>

              <div style={{ height: '1px', background: isLight ? 'rgba(15, 23, 42, 0.08)' : 'rgba(255, 255, 255, 0.08)' }} />

              <div style={{ fontSize: '11px', fontWeight: 700, color: '#06B6D4', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Active Scene Objects (R3F)
              </div>

              {[
                { name: 'Taipei Fabric Mill (Supplier)', status: 'Connected', desc: 'SilkRoad Express • Risk: 8' },
                { name: 'Shenzhen Assembly (Factory)', status: 'Optimal', desc: 'Throughput: 45,000 u/mo' },
                { name: 'Hanoi Logistics (Warehouse)', status: 'Active', desc: 'Fill Rate: 98.4%' },
                { name: 'Frankfurt European DC', status: 'Optimal', desc: 'Lead Time: 12d' },
                { name: 'Americas Gateway (Seattle)', status: 'Buffer Hub', desc: 'Safety Stock: 18,000 u' },
              ].map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '8px',
                    background: isLight ? 'rgba(15, 23, 42, 0.03)' : 'rgba(255, 255, 255, 0.03)',
                    border: isLight ? '1px solid rgba(15, 23, 42, 0.08)' : '1px solid rgba(255, 255, 255, 0.06)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: isLight ? '#0F172A' : '#F8FAFC' }}>
                      {item.name}
                    </div>
                    <div style={{ fontSize: '10px', color: isLight ? '#64748B' : '#94A3B8' }}>
                      {item.desc}
                    </div>
                  </div>
                  <span
                    style={{
                      fontSize: '10px',
                      fontWeight: 700,
                      color: '#06B6D4',
                      background: 'rgba(6, 182, 212, 0.15)',
                      padding: '2px 6px',
                      borderRadius: '4px',
                    }}
                  >
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </CinematicCard>
        </div>
      )}

      {/* Tab 2: Analytics Chart View */}
      {activeTab === 'analytics' && (
        <CinematicCard
          title="Demand vs Optimized S&OP Supply Trajectory"
          subtitle="Predictive reconciliation across fulfillment hubs"
        >
          <div style={{ width: '100%', height: '340px', marginTop: '10px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sampleChartData} margin={{ top: 10, right: 20, left: 15, bottom: 0 }}>
                <defs>
                  <linearGradient id="cyanGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#06B6D4" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="indigoGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366F1" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#6366F1" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={isLight ? 'rgba(15, 23, 42, 0.08)' : 'rgba(255, 255, 255, 0.05)'} />
                <XAxis dataKey="month" stroke="#64748B" />
                <YAxis
                  stroke="#64748B"
                  width={52}
                  tickFormatter={(val: number) => (val >= 1000 ? `${val / 1000}k` : `${val}`)}
                  tick={{ fontSize: 11, fill: '#64748B' }}
                />
                <Tooltip
                  formatter={(value: any, name: any) => [
                    typeof value === 'number' ? `${value.toLocaleString()} units` : value,
                    name,
                  ]}
                  contentStyle={{
                    backgroundColor: isLight ? '#FFFFFF' : '#0F172A',
                    borderColor: 'rgba(6, 182, 212, 0.3)',
                    borderRadius: '8px',
                    color: isLight ? '#0F172A' : '#F8FAFC',
                    fontSize: '12px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="demand"
                  stroke="#06B6D4"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#cyanGrad)"
                  name="Global Demand"
                />
                <Area
                  type="monotone"
                  dataKey="supply"
                  stroke="#6366F1"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#indigoGrad)"
                  name="S&OP Supply"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CinematicCard>
      )}
    </PageTransitionLayout>
  );
};

export default OverviewPage;
