import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '../ui/Badge';
import { useTheme } from '../../hooks/useTheme';
import { CheckCircle2 } from 'lucide-react';

export const WhyUsSection: React.FC = () => {
  const { mode } = useTheme();
  const isLight = mode === 'light';

  const benefits = [
    {
      title: 'Better Forecast Accuracy',
      desc: 'Move beyond historical averages. We use machine learning to sense demand across omnichannel signals, reducing forecast error by up to 24%.',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=600&auto=format&fit=crop',
    },
    {
      title: 'Integrated Planning',
      desc: 'Connect demand plans directly to production schedules and inventory safety buffers, eliminating the bullwhip effect across your network.',
      image: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?q=80&w=600&auto=format&fit=crop',
    },
    {
      title: 'Optimized Procurement',
      desc: 'Stop guessing on order allocation. Our solvers automatically balance supplier MOQs, capacities, and tariffs for the lowest landed cost.',
      image: '/images/login_warehouse_ai.jpg',
    },
    {
      title: 'Reduced Supply Risk',
      desc: 'Proactively monitor tier-1 and tier-2 suppliers for geopolitical, weather, and operational risks before they impact your delivery dates.',
      image: '/images/supply_risk_ai.jpg',
    },
    {
      title: 'Sustainability Tracking',
      desc: 'Measure and reduce Scope 3 emissions by optimizing freight paths and selecting eco-friendly supplier hubs across the network.',
      image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=600&auto=format&fit=crop',
    },
    {
      title: 'Collaborative Workflows',
      desc: 'Break down silos. Planners, logistics managers, and suppliers collaborate in real-time on a single, synchronized platform.',
      image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=600&auto=format&fit=crop',
    },
  ];

  return (
    <section style={{ marginBottom: '80px' }}>
      <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 48px' }}>
        <Badge variant="emerald" pulse>
          WHY TRENDFLOW AI
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
          FROM DISCONNECTED PLANNING TO CONNECTED DECISIONS.
        </h2>
        <p style={{ fontSize: '16px', color: isLight ? '#475569' : '#94A3B8', lineHeight: '1.6' }}>
          Legacy enterprises plan demand and procurement across isolated Excel sheets. We unify your data into a continuous, intelligent loop.
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '24px',
        }}
      >
        {benefits.map((benefit, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            style={{
              background: isLight ? '#FFFFFF' : '#101612',
              borderRadius: '16px',
              border: isLight ? '1px solid #E2E8F0' : '1px solid #202E25',
              overflow: 'hidden',
              boxShadow: isLight ? '0 4px 12px rgba(0,0,0,0.05)' : '0 4px 12px rgba(0,0,0,0.2)',
            }}
          >
            <div style={{ height: '160px', width: '100%', position: 'relative' }}>
              <div
                style={{
                  position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                  backgroundImage: `url(${benefit.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  filter: isLight ? 'brightness(0.9)' : 'brightness(0.7)',
                }}
              />
            </div>
            <div style={{ padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <CheckCircle2 size={18} color="#16A34A" />
                <h3 style={{ fontSize: '16px', fontWeight: 800, color: isLight ? '#0F172A' : '#FFFFFF' }}>
                  {benefit.title}
                </h3>
              </div>
              <p style={{ fontSize: '14px', color: isLight ? '#475569' : '#94A3B8', lineHeight: '1.6' }}>
                {benefit.desc}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
