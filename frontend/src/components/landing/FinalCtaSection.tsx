import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GlowButton } from '../ui/GlowButton';
import { Badge } from '../ui/Badge';
import { QuickPlanningModal } from '../layout/QuickPlanningModal';
import { ArrowRight, Play } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

export const FinalCtaSection: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { mode } = useTheme();
  const isLight = mode === 'light';

  return (
    <>
      <section style={{ marginBottom: '64px' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{
            position: 'relative',
            borderRadius: '24px',
            background: isLight
              ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(241, 245, 249, 0.9) 100%)'
              : 'linear-gradient(135deg, rgba(16, 22, 18, 0.9) 0%, rgba(5, 8, 6, 0.95) 100%)',
            border: isLight ? '1px solid rgba(22, 163, 74, 0.3)' : '1px solid rgba(22, 163, 74, 0.4)',
            boxShadow: isLight
              ? '0 25px 60px rgba(22, 163, 74, 0.15)'
              : '0 25px 60px rgba(0, 0, 0, 0.7), 0 0 35px rgba(22, 163, 74, 0.15)',
            padding: '48px 36px',
            textAlign: 'center',
            overflow: 'hidden',
          }}
        >
          {/* Specular Ambient Glow Top Line */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '3px',
              background: 'linear-gradient(90deg, transparent, #16A34A, transparent)',
            }}
          />

          <div style={{ maxWidth: '680px', margin: '0 auto' }}>
            <Badge variant="emerald" pulse>
              TRANSFORM YOUR SCM COMMAND TODAY
            </Badge>

            <h2
              style={{
                fontSize: '36px',
                fontWeight: 900,
                color: isLight ? '#0F172A' : '#F8FAFC',
                letterSpacing: '-0.03em',
                lineHeight: '1.2',
                marginTop: '16px',
                marginBottom: '14px',
              }}
            >
              Accelerate Planning from Weeks to Minutes
            </h2>

            <p
              style={{
                fontSize: '16px',
                color: isLight ? '#475569' : '#94A3B8',
                lineHeight: '1.6',
                marginBottom: '28px',
              }}
            >
              Unlock real-time demand sensing, intelligent order allocation,
              and proactive risk management in a single connected interface.
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
              <NavLink to="/dashboard" style={{ textDecoration: 'none' }}>
                <GlowButton variant="primary" size="lg" icon={<ArrowRight size={18} />} iconPosition="right">
                  ENTER CONTROL TOWER
                </GlowButton>
              </NavLink>

              <GlowButton
                variant="secondary"
                size="lg"
                icon={<Play size={16} fill="currentColor" />}
                onClick={() => setIsModalOpen(true)}
              >
                RUN PLANNING CYCLE
              </GlowButton>
            </div>
          </div>
        </motion.div>
      </section>

      <QuickPlanningModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};
