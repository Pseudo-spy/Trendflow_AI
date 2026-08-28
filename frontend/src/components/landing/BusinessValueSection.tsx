import React from 'react';
import { motion } from 'framer-motion';
import { CinematicCard } from '../ui/CinematicCard';
import { Badge } from '../ui/Badge';
import { DollarSign, ShieldCheck, Clock, Leaf } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

export const BusinessValueSection: React.FC = () => {
  const { mode } = useTheme();
  const isLight = mode === 'light';

  const metrics = [
    {
      value: '+$482,500',
      label: 'Procurement Cost Savings',
      desc: 'Achieved through optimal volume tier MOQ allocation and automated tariff minimization.',
      icon: <DollarSign size={24} color="#16A34A" />,
      glow: 'emerald' as const,
    },
    {
      value: '98.8%',
      label: 'Target Service Fill Rate',
      desc: 'Zero retail stockouts during peak seasonal surges with dynamic safety stock buffering.',
      icon: <ShieldCheck size={24} color="#06B6D4" />,
      glow: 'cyan' as const,
    },
    {
      value: '-45%',
      label: 'Planning Cycle Reduction',
      desc: 'Compress 3-week manual spreadsheet reconciliation cycles down to under 15 minutes.',
      icon: <Clock size={24} color="#6366F1" />,
      glow: 'indigo' as const,
    },
    {
      value: '-18.4t',
      label: 'CO2 Logistics Reduction',
      desc: 'Optimized multi-modal freight consolidation routes directly lowering carbon footprint.',
      icon: <Leaf size={24} color="#16A34A" />,
      glow: 'emerald' as const,
    },
  ];

  return (
    <section style={{ marginBottom: '64px' }}>
      <div style={{ textAlign: 'center', maxWidth: '750px', margin: '0 auto 36px' }}>
        <Badge variant="emerald" pulse>
          MEASURABLE BUSINESS ROI
        </Badge>
        <h2
          style={{
            fontSize: '32px',
            fontWeight: 800,
            color: isLight ? '#0F172A' : '#F8FAFC',
            letterSpacing: '-0.025em',
            marginTop: '12px',
            marginBottom: '12px',
          }}
        >
          Quantifiable Enterprise Impact
        </h2>
        <p style={{ fontSize: '15px', color: isLight ? '#475569' : '#94A3B8', lineHeight: '1.6' }}>
          Delivering real margin expansion, service reliability, and working capital efficiency.
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px',
        }}
      >
        {metrics.map((m, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: idx * 0.1 }}
          >
            <CinematicCard
              glowColor={m.glow}
              style={{ textAlign: 'center', padding: '28px 20px', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
            >
              <div
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '14px',
                  background: isLight ? 'rgba(15, 23, 42, 0.05)' : 'rgba(255, 255, 255, 0.05)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '16px',
                }}
              >
                {m.icon}
              </div>

              <div
                style={{
                  fontSize: '32px',
                  fontWeight: 900,
                  color: isLight ? '#0F172A' : '#F8FAFC',
                  fontFamily: "'JetBrains Mono', monospace",
                  letterSpacing: '-0.03em',
                  marginBottom: '6px',
                }}
              >
                {m.value}
              </div>

              <div style={{ fontSize: '14px', fontWeight: 700, color: isLight ? '#0284C7' : '#38BDF8', marginBottom: '8px' }}>
                {m.label}
              </div>

              <p style={{ fontSize: '12px', color: isLight ? '#64748B' : '#94A3B8', lineHeight: '1.5' }}>
                {m.desc}
              </p>
            </CinematicCard>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
