import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Badge } from '../ui/Badge';
import { useTheme } from '../../hooks/useTheme';
import { Building2, TrendingDown, Clock, ShieldCheck, Factory, ShieldAlert } from 'lucide-react';

export const ProcurementVisualSection: React.FC = () => {
  const { mode } = useTheme();
  const isLight = mode === 'light';
  const [activeIndex, setActiveIndex] = useState(0);

  const suppliers = [
    {
      name: 'Supplier A (Vietnam)',
      image: '/images/login_warehouse_ai.jpg',
      metrics: { cost: '-12%', capacity: '85%', quality: '99.2%', lead: '14 Days', risk: 'Low' },
      isOptimized: true,
      allocation: '65%',
    },
    {
      name: 'Supplier B (Mexico)',
      image: '/images/supply_risk_ai.jpg',
      metrics: { cost: '+4%', capacity: '92%', quality: '98.5%', lead: '5 Days', risk: 'Medium' },
      isOptimized: false,
      allocation: '35%',
    },
    {
      name: 'Supplier C (China)',
      image: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?q=80&w=600&auto=format&fit=crop',
      metrics: { cost: '-8%', capacity: '100%', quality: '97.0%', lead: '28 Days', risk: 'High' },
      isOptimized: false,
      allocation: '0%',
    }
  ];

  return (
    <section style={{ marginBottom: '80px' }}>
      <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 48px' }}>
        <Badge variant="emerald" pulse>
          PROCUREMENT OPTIMIZATION
        </Badge>
        <h2
          style={{
            fontSize: '36px',
            fontWeight: 800,
            color: isLight ? '#0F172A' : '#FFFFFF',
            letterSpacing: '-0.02em',
            marginTop: '16px',
            marginBottom: '16px',
          }}
        >
          SMARTER PROCUREMENT. LOWER COST. LOWER RISK.
        </h2>
        <p style={{ fontSize: '16px', color: isLight ? '#475569' : '#94A3B8', lineHeight: '1.6' }}>
          Evaluate tier-1 suppliers across multiple dimensions simultaneously. TRENDFLOW AI allocates orders to minimize cost while strictly adhering to your risk and quality bounds.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '1000px', margin: '0 auto' }}>
        {suppliers.map((supplier, idx) => {
          const isActive = activeIndex === idx;

          return (
            <motion.div
              key={idx}
              onMouseEnter={() => setActiveIndex(idx)}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
              style={{
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'wrap',
                background: isLight ? '#FFFFFF' : '#101612',
                border: isActive
                  ? '2px solid #16A34A'
                  : isLight ? '1px solid #E2E8F0' : '1px solid #202E25',
                borderRadius: '16px',
                cursor: 'pointer',
                overflow: 'hidden',
                boxShadow: isActive
                  ? '0 10px 30px rgba(22, 163, 74, 0.15)'
                  : isLight ? '0 4px 12px rgba(0,0,0,0.05)' : '0 4px 12px rgba(0,0,0,0.2)',
                position: 'relative',
                transition: 'all 0.3s ease',
              }}
            >
              {/* Left Image Section */}
              <div style={{ flex: '1 1 250px', minHeight: '200px', position: 'relative' }}>
                <div
                  style={{
                    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundImage: `url(${supplier.image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                />
                <div
                  style={{
                    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'linear-gradient(90deg, transparent, rgba(16,22,18,0.8))',
                    display: isLight ? 'none' : 'block'
                  }}
                />
              </div>

              {/* Right Data Section */}
              <div style={{ flex: '2 1 500px', padding: '32px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Factory size={24} color={isLight ? '#0F172A' : '#FFFFFF'} />
                    <h3 style={{ fontSize: '20px', fontWeight: 800, color: isLight ? '#0F172A' : '#FFFFFF' }}>
                      {supplier.name}
                    </h3>
                  </div>
                  {isActive && (
                    <Badge variant="emerald">OPTIMAL ALLOCATION: {supplier.allocation}</Badge>
                  )}
                  {!isActive && (
                    <span style={{ fontSize: '14px', fontWeight: 700, color: isLight ? '#64748B' : '#6B7280' }}>
                      Allocation: {supplier.allocation}
                    </span>
                  )}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px' }}>
                  <div>
                    <div style={{ fontSize: '12px', color: isLight ? '#64748B' : '#94A3B8', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '8px' }}>
                      <TrendingDown size={14} /> Cost
                    </div>
                    <div style={{ fontSize: '18px', fontWeight: 700, color: supplier.metrics.cost.startsWith('-') ? '#16A34A' : '#EF4444' }}>
                      {supplier.metrics.cost}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', color: isLight ? '#64748B' : '#94A3B8', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '8px' }}>
                      <Building2 size={14} /> Capacity
                    </div>
                    <div style={{ fontSize: '18px', fontWeight: 700, color: supplier.metrics.capacity === '100%' ? '#EF4444' : isLight ? '#0F172A' : '#FFFFFF' }}>
                      {supplier.metrics.capacity}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', color: isLight ? '#64748B' : '#94A3B8', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '8px' }}>
                      <ShieldCheck size={14} /> Quality
                    </div>
                    <div style={{ fontSize: '18px', fontWeight: 700, color: parseFloat(supplier.metrics.quality) > 98 ? '#16A34A' : isLight ? '#0F172A' : '#FFFFFF' }}>
                      {supplier.metrics.quality}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', color: isLight ? '#64748B' : '#94A3B8', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '8px' }}>
                      <Clock size={14} /> Lead Time
                    </div>
                    <div style={{ fontSize: '18px', fontWeight: 700, color: isLight ? '#0F172A' : '#FFFFFF' }}>
                      {supplier.metrics.lead}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', color: isLight ? '#64748B' : '#94A3B8', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '8px' }}>
                      <ShieldAlert size={14} /> Risk
                    </div>
                    <div style={{ fontSize: '18px', fontWeight: 700, color: supplier.metrics.risk === 'Low' ? '#16A34A' : supplier.metrics.risk === 'Medium' ? '#F59E0B' : '#EF4444' }}>
                      {supplier.metrics.risk}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};
