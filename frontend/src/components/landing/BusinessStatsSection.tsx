import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../hooks/useTheme';

export const BusinessStatsSection: React.FC = () => {
  const { mode } = useTheme();
  const isLight = mode === 'light';

  const stats = [
    { label: 'Units Planned Monthly', value: '120K+' },
    { label: 'Supplier Partners', value: '35+' },
    { label: 'Production Sites', value: '18' },
    { label: 'Supplier OTD', value: '96%' },
    { label: 'Optimized Procurement', value: '₹14.5M' },
  ];

  return (
    <section
      style={{
        marginBottom: '80px',
        background: isLight ? '#F1F5F9' : '#050806',
        borderTop: isLight ? '1px solid #E2E8F0' : '1px solid #1A241E',
        borderBottom: isLight ? '1px solid #E2E8F0' : '1px solid #1A241E',
        padding: '60px 0',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '32px',
          textAlign: 'center',
          padding: '0 24px',
        }}
      >
        {stats.map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                fontSize: '48px',
                fontWeight: 900,
                color: '#16A34A',
                letterSpacing: '-0.03em',
                marginBottom: '8px',
              }}
            >
              {stat.value}
            </div>
            <div
              style={{
                fontSize: '14px',
                fontWeight: 700,
                color: isLight ? '#475569' : '#94A3B8',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              {stat.label}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
