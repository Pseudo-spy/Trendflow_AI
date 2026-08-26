import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { GlowButton } from '../ui/GlowButton';
import { Badge } from '../ui/Badge';
import { SceneCanvas } from '../../three/SceneCanvas';
import type { SupplyChainHeroNode } from '../../scenes/LandingHero3D';
const LandingHero3D = React.lazy(() => import('../../scenes/LandingHero3D').then(m => ({ default: m.LandingHero3D })));
import { ArrowRight, Sparkles } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { useMediaQuery } from '../../hooks/useMediaQuery';

export const HeroSection: React.FC = () => {
  const [inspectedNode, setInspectedNode] = useState<SupplyChainHeroNode | null>(null);
  const { mode } = useTheme();
  const isLight = mode === 'light';
  const isTablet = useMediaQuery('(max-width: 1024px)');
  const isMobile = useMediaQuery('(max-width: 768px)');

  const prefersReducedMotion = useReducedMotion();

  return (
    <section style={{ position: 'relative', marginBottom: '80px', paddingTop: '20px' }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: isTablet ? '1fr' : '0.85fr 1.15fr',
          gap: '40px',
          alignItems: 'center',
        }}
      >
        {/* LEFT: Text Content */}
        <div style={{ paddingRight: isTablet ? '0' : '20px' }}>
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}
          >
            <Badge variant="emerald" pulse>
              TRENDFLOW AI
            </Badge>
            <span
              style={{
                fontSize: '12px',
                fontWeight: 700,
                color: isLight ? '#15803D' : '#16A34A',
                fontFamily: "'JetBrains Mono', monospace",
                letterSpacing: '0.04em',
              }}
            >
              INTEGRATED S&OP + PROCUREMENT
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            style={{
              fontSize: 'clamp(32px, 4.5vw, 54px)',
              fontWeight: 900,
              color: isLight ? '#0F172A' : '#FFFFFF',
              letterSpacing: '-0.03em',
              lineHeight: '1.1',
              marginBottom: '24px',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <span>POWER YOUR</span>
            
            <div style={{ position: 'relative' }}>
               {/* Hidden ghost text to ensure container always has width and height for the longest word */}
               <span style={{ visibility: 'hidden', pointerEvents: 'none', whiteSpace: 'nowrap' }}>
                 PROCUREMENT|
               </span>
               <div style={{ position: 'absolute', top: 0, left: 0, whiteSpace: 'nowrap' }}>
                 <TypewriterHeadline prefersReducedMotion={prefersReducedMotion} />
               </div>
            </div>

            <span>WITH</span>
            <span>TRENDFLOW AI</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{
              fontSize: '18px',
              fontWeight: 400,
              color: isLight ? '#475569' : '#94A3B8',
              lineHeight: '1.6',
              marginBottom: '40px',
              maxWidth: '540px',
            }}
          >
            AI-powered demand planning, S&OP and procurement intelligence for modern supply chains.
            Connect every decision from raw material sourcing to final delivery.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            style={{ display: 'flex', gap: '16px', flexDirection: isMobile ? 'column' : 'row' }}
          >
            <NavLink to="/dashboard" style={{ textDecoration: 'none' }}>
              <GlowButton
                variant="primary"
                size="lg"
                icon={<ArrowRight size={18} />}
                iconPosition="right"
                style={{ fontWeight: 700, padding: '0 32px', height: '54px', letterSpacing: '0.02em' }}
              >
                ENTER CONTROL TOWER
              </GlowButton>
            </NavLink>

            <a href="#capabilities" style={{ textDecoration: 'none' }}>
              <GlowButton
                variant="secondary"
                size="lg"
                icon={<Sparkles size={16} />}
                style={{ fontWeight: 600, padding: '0 28px', height: '54px' }}
              >
                EXPLORE PLATFORM
              </GlowButton>
            </a>
          </motion.div>
        </div>

        {/* RIGHT: Realistic Image + 3D Overlay */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          style={{
            position: 'relative',
            width: '100%',
            height: isMobile ? '340px' : '500px',
            borderRadius: '24px',
            overflow: 'hidden',
            boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
            border: isLight ? '1px solid #E2E8F0' : '1px solid #1A241E',
          }}
        >
          {/* Realistic Background Image */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundImage: 'url(https://images.unsplash.com/photo-1586528116311-ad8ed7c508b0?q=80&w=2070&auto=format&fit=crop)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              filter: isLight ? 'brightness(0.9) contrast(1.1)' : 'brightness(0.4) contrast(1.2)',
            }}
          />

          {/* 3D Scene Overlay (Digital Twin) */}
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 2 }}>
            <SceneCanvas enableOrbit={true} enableParallax={true} cameraPosition={[0, 4.5, 22]} fov={42}>
              <React.Suspense fallback={null}>
                <LandingHero3D onHoverNode={setInspectedNode} />
              </React.Suspense>
            </SceneCanvas>
          </div>

          {/* HUD Overlay for 3D Node Inspection */}
          <AnimatePresence>
            {inspectedNode && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                transition={{ duration: 0.2 }}
                style={{
                  position: 'absolute',
                  bottom: '24px',
                  right: '24px',
                  zIndex: 10,
                  background: isLight ? 'rgba(255, 255, 255, 0.95)' : 'rgba(10, 15, 11, 0.95)',
                  backdropFilter: 'blur(12px)',
                  border: isLight ? '1px solid #E2E8F0' : '1px solid #16A34A',
                  borderRadius: '12px',
                  padding: '16px 20px',
                  maxWidth: '300px',
                  boxShadow: '0 12px 30px rgba(0,0,0,0.4)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontSize: '14px', fontWeight: 800, color: isLight ? '#0F172A' : '#FFFFFF' }}>
                    {inspectedNode.name}
                  </span>
                  <Badge variant={inspectedNode.status === 'optimal' ? 'emerald' : 'amber'}>
                    {inspectedNode.status.toUpperCase()}
                  </Badge>
                </div>
                <div style={{ fontSize: '12px', color: isLight ? '#64748B' : '#94A3B8', marginBottom: '12px' }}>
                  {inspectedNode.category}
                </div>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '10px',
                    paddingTop: '12px',
                    borderTop: isLight ? '1px solid #E2E8F0' : '1px solid #202E25',
                    fontSize: '11px',
                    fontFamily: "'JetBrains Mono', monospace",
                  }}
                >
                  <div>
                    <span style={{ color: isLight ? '#64748B' : '#6B7280' }}>Cap: </span>
                    <span style={{ color: isLight ? '#0F172A' : '#FFFFFF', fontWeight: 700 }}>{inspectedNode.capacity}</span>
                  </div>
                  <div>
                    <span style={{ color: isLight ? '#64748B' : '#6B7280' }}>OTIF: </span>
                    <span style={{ color: '#16A34A', fontWeight: 700 }}>{inspectedNode.otif}</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};

const typewriterPhrases = ["PLANNING", "FORECASTING", "PROCUREMENT", "DECISIONS"];

const TypewriterHeadline: React.FC<{ prefersReducedMotion: boolean | null }> = ({ prefersReducedMotion }) => {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showCaret, setShowCaret] = useState(true);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setShowCaret(prev => !prev);
    }, 550);
    return () => clearInterval(interval);
  }, []);

  React.useEffect(() => {
    if (prefersReducedMotion) return;

    const currentPhrase = typewriterPhrases[phraseIndex];
    let timeout: ReturnType<typeof setTimeout>;

    if (!isDeleting && charIndex === currentPhrase.length) {
      timeout = setTimeout(() => setIsDeleting(true), 1900);
    } else if (isDeleting && charIndex === 0) {
      timeout = setTimeout(() => {
        setIsDeleting(false);
        setPhraseIndex((prev) => (prev + 1) % typewriterPhrases.length);
      }, 350);
    } else {
      const delay = isDeleting ? 50 : 85;
      timeout = setTimeout(() => {
        setCharIndex((prev) => prev + (isDeleting ? -1 : 1));
      }, delay);
    }

    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, phraseIndex, prefersReducedMotion]);

  if (prefersReducedMotion) {
    return <span style={{ color: '#16A34A' }}>PLANNING</span>;
  }

  const currentText = typewriterPhrases[phraseIndex].substring(0, charIndex);
  
  return (
    <span style={{ color: '#16A34A', display: 'inline-flex', alignItems: 'center' }}>
      {currentText}
      <span style={{ 
        opacity: showCaret ? 1 : 0, 
        marginLeft: '2px', 
        color: '#16A34A',
        fontWeight: 400 
      }}>|</span>
    </span>
  );
};
