import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '../ui/Badge';
import { ArrowRight } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { useNavigate } from 'react-router-dom';

export const CapabilitiesSection: React.FC = () => {
  const { mode } = useTheme();
  const isLight = mode === 'light';
  const navigate = useNavigate();

  const capabilities = [
    {
      title: 'AI Demand Forecasting',
      desc: 'Predict omnichannel demand across 30, 60, and 90-day horizons using advanced ML models with seasonal confidence bounds.',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop',
    },
    {
      title: 'Integrated S&OP',
      desc: 'Calculate dynamic safety buffer thresholds for regional DCs and stores to guarantee service levels while reducing holding costs.',
      image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=800&auto=format&fit=crop',
    },
    {
      title: 'Material Planning',
      desc: 'Decompose production plans into precise Bill of Materials requirements synchronized with lead times and transit schedules.',
      image: 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?q=80&w=800&auto=format&fit=crop',
    },
    {
      title: 'Procurement Optimization',
      desc: 'Formulate multi-objective order allocations subject to tier-1 supplier capacity, MOQs, and geopolitical tariffs.',
      image: 'https://images.unsplash.com/photo-1494412519320-aa613dfb7738?q=80&w=800&auto=format&fit=crop',
    },
    {
      title: 'Supplier Risk Intelligence',
      desc: 'Continuously monitor port congestion, weather threats, and supplier vulnerability indices to trigger automated reroutes.',
      image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=800&auto=format&fit=crop',
    },
    {
      title: 'Logistics Optimization',
      desc: 'Dynamically optimize carrier selection and freight routes across ocean, air, and ground transport to minimize landed costs.',
      image: 'https://images.unsplash.com/photo-1501523460185-2aa5d2a0f981?q=80&w=800&auto=format&fit=crop',
    },
  ];

  return (
    <section id="capabilities" style={{ marginBottom: '80px' }}>
      <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 48px' }}>
        <Badge variant="emerald" pulse>
          CAPABILITIES
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
          ONE PLATFORM. COMPLETE SUPPLY-CHAIN VISIBILITY.
        </h2>
        <p style={{ fontSize: '16px', color: isLight ? '#475569' : '#94A3B8', lineHeight: '1.6' }}>
          Unify disconnected spreadsheets into a single source of truth. Make proactive decisions powered by continuous intelligence.
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '24px',
        }}
      >
        {capabilities.map((cap, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: idx * 0.1 }}
            style={{
              position: 'relative',
              borderRadius: '16px',
              overflow: 'hidden',
              background: isLight ? '#FFFFFF' : '#101612',
              border: isLight ? '1px solid #E2E8F0' : '1px solid #202E25',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: isLight ? '0 4px 12px rgba(0,0,0,0.05)' : '0 4px 12px rgba(0,0,0,0.2)',
              cursor: 'pointer',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
            }}
            onClick={() => navigate('/dashboard')}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.borderColor = '#16A34A';
              e.currentTarget.style.boxShadow = isLight ? '0 12px 24px rgba(22, 163, 74, 0.15)' : '0 12px 24px rgba(22, 163, 74, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.borderColor = isLight ? '#E2E8F0' : '#202E25';
              e.currentTarget.style.boxShadow = isLight ? '0 4px 12px rgba(0,0,0,0.05)' : '0 4px 12px rgba(0,0,0,0.2)';
            }}
          >
            {/* Realistic Image Header */}
            <div style={{ height: '180px', width: '100%', position: 'relative', overflow: 'hidden' }}>
              <div
                style={{
                  position: 'absolute',
                  top: 0, left: 0, right: 0, bottom: 0,
                  backgroundImage: `url(${cap.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  filter: isLight ? 'brightness(0.95)' : 'brightness(0.7)',
                }}
              />
              {/* Green gradient overlay at the bottom of the image */}
              <div
                style={{
                  position: 'absolute',
                  bottom: 0, left: 0, right: 0,
                  height: '60px',
                  background: isLight 
                    ? 'linear-gradient(to top, #FFFFFF, transparent)'
                    : 'linear-gradient(to top, #101612, transparent)',
                }}
              />
            </div>
            
            {/* Content Body */}
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', flex: 1 }}>
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: isLight ? '#0F172A' : '#FFFFFF', marginBottom: '12px' }}>
                {cap.title}
              </h3>
              <p style={{ fontSize: '14px', color: isLight ? '#475569' : '#94A3B8', lineHeight: '1.6', marginBottom: '24px', flex: 1 }}>
                {cap.desc}
              </p>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#16A34A', fontSize: '13px', fontWeight: 700 }}>
                <span>Explore Details</span>
                <ArrowRight size={14} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
