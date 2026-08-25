import React from 'react';
import { motion } from 'framer-motion';
import { CinematicCard } from '../ui/CinematicCard';
import { Badge } from '../ui/Badge';
import {
  Activity,
  LineChart,
  GitMerge,
  Factory,
  PackageOpen,
  ShoppingCart,
  Building2,
  ShieldAlert,
  ArrowRightCircle,
  ArrowRight
} from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

export const PipelineFlowSection: React.FC = () => {
  const { mode } = useTheme();
  const isLight = mode === 'light';

  const steps = [
    { id: '01', title: 'Demand', icon: <Activity size={18} color="#16A34A" /> },
    { id: '02', title: 'Forecast', icon: <LineChart size={18} color="#16A34A" /> },
    { id: '03', title: 'S&OP', icon: <GitMerge size={18} color="#16A34A" /> },
    { id: '04', title: 'Production', icon: <Factory size={18} color="#16A34A" /> },
    { id: '05', title: 'Material', icon: <PackageOpen size={18} color="#16A34A" /> },
    { id: '06', title: 'Procurement', icon: <ShoppingCart size={18} color="#16A34A" /> },
    { id: '07', title: 'Supplier', icon: <Building2 size={18} color="#16A34A" /> },
    { id: '08', title: 'Risk', icon: <ShieldAlert size={18} color="#F59E0B" /> },
    { id: '09', title: 'Decision', icon: <ArrowRightCircle size={18} color="#16A34A" /> },
  ];

  return (
    <section id="pipeline-flow" style={{ marginBottom: '80px' }}>
      <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 48px' }}>
        <Badge variant="emerald" pulse>
          SUPPLY CHAIN CONNECTIVITY
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
          HOW TRENDFLOW AI CONNECTS THE SUPPLY CHAIN
        </h2>
        <p style={{ fontSize: '16px', color: isLight ? '#475569' : '#94A3B8', lineHeight: '1.6' }}>
          From raw material requirements to final supplier allocation, our platform provides complete visibility and intelligent optimization at every stage of the logistics pipeline.
        </p>
      </div>

      <div style={{ position: 'relative', overflowX: 'auto', paddingBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', minWidth: 'max-content', gap: '8px' }}>
          {steps.map((step, idx) => (
            <React.Fragment key={step.id}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
              >
                <CinematicCard
                  interactive
                  style={{
                    width: '140px',
                    height: '110px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '12px',
                    background: isLight ? '#FFFFFF' : '#101612',
                    border: isLight ? '1px solid #E2E8F0' : '1px solid #202E25',
                  }}
                >
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      background: isLight ? 'rgba(22, 163, 74, 0.08)' : 'rgba(22, 163, 74, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {step.icon}
                  </div>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: isLight ? '#0F172A' : '#F8FAFC' }}>
                    {step.title}
                  </span>
                </CinematicCard>
              </motion.div>
              {idx < steps.length - 1 && (
                <motion.div
                  initial={{ opacity: 0, scaleX: 0 }}
                  whileInView={{ opacity: 1, scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.1 + 0.2 }}
                  style={{
                    width: '32px',
                    height: '2px',
                    background: 'linear-gradient(90deg, #16A34A 0%, rgba(22, 163, 74, 0.2) 100%)',
                    position: 'relative',
                  }}
                >
                  <ArrowRight
                    size={14}
                    color="#16A34A"
                    style={{
                      position: 'absolute',
                      right: '-8px',
                      top: '-6px',
                    }}
                  />
                </motion.div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
};
