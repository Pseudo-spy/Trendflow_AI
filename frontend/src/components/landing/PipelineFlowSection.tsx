import React, { useEffect, useRef } from 'react';
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

  const containerRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);
  const requestRef = useRef<number | undefined>(undefined);
  const isHovered = useRef(false);

  const steps = [
    { id: '01', title: 'Demand', icon: Activity, rgb: '20, 184, 166' }, // cyan-green (teal)
    { id: '02', title: 'Forecast', icon: LineChart, rgb: '59, 130, 246' }, // blue
    { id: '03', title: 'S&OP', icon: GitMerge, rgb: '13, 148, 136' }, // teal
    { id: '04', title: 'Production', icon: Factory, rgb: '16, 185, 129' }, // emerald
    { id: '05', title: 'Material', icon: PackageOpen, rgb: '34, 197, 94' }, // green
    { id: '06', title: 'Procurement', icon: ShoppingCart, rgb: '6, 182, 212' }, // cyan
    { id: '07', title: 'Supplier', icon: Building2, rgb: '13, 148, 136' }, // teal
    { id: '08', title: 'Risk', icon: ShieldAlert, rgb: '245, 158, 11' }, // amber
    { id: '09', title: 'Decision', icon: ArrowRightCircle, rgb: '74, 222, 128' }, // bright green
  ];

  // Duplicate to ensure a seamless infinite loop (18 items total)
  const displaySteps = [...steps, ...steps];
  
  const ITEM_WIDTH = 200; // 140 card + 60 gap
  const TOTAL_WIDTH = displaySteps.length * ITEM_WIDTH;
  const SPEED = 1.0;
  const WRAP_OFFSET = ITEM_WIDTH * 4;

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) return;

    let trainX = 0;

    const animate = () => {
      if (!containerRef.current) return;
      
      const containerWidth = containerRef.current.offsetWidth;
      const containerCenter = containerWidth / 2;
      // Cap the max distance for the highlight effect so it doesn't stay highlighted too long on large screens
      const maxDistance = Math.min(containerWidth / 2, 600);

      if (!isHovered.current) {
        trainX += SPEED;
      }

      displaySteps.forEach((step, idx) => {
        const element = itemsRef.current[idx];
        if (!element) return;

        // Calculate global position based on the train
        let pos = (trainX + idx * ITEM_WIDTH) % TOTAL_WIDTH;
        // Shift left so it wraps offscreen
        pos -= WRAP_OFFSET;

        const itemCenter = pos + ITEM_WIDTH / 2;
        const distanceFromCenter = Math.abs(containerCenter - itemCenter);
        
        let normalized = Math.max(0, 1 - (distanceFromCenter / maxDistance));
        // Non-linear curve to make the center stand out more
        normalized = Math.pow(normalized, 1.8);

        const scale = 0.85 + (normalized * 0.35); // scale up to 1.2 at center
        const opacity = 0.3 + (normalized * 0.7); // 0.3 to 1.0

        element.style.transform = `translate3d(${pos}px, 0, 0) scale(${scale})`;
        element.style.opacity = opacity.toString();
        // Bring centered items to the front
        element.style.zIndex = Math.round(normalized * 100).toString();

        const cardNode = element.querySelector('.flow-card') as HTMLElement;
        const iconNode = element.querySelector('.flow-icon-box') as HTMLElement;
        const textNode = element.querySelector('.flow-text') as HTMLElement;
        const arrowBox = element.querySelector('.flow-arrow') as HTMLElement;

        if (cardNode) {
          cardNode.style.boxShadow = `0 ${8 * normalized}px ${24 * normalized}px rgba(${step.rgb}, ${0.25 * normalized})`;
          cardNode.style.borderColor = isLight 
            ? `rgba(0,0,0,${0.05 + 0.15 * normalized})` 
            : `rgba(255,255,255,${0.05 + 0.2 * normalized})`;
        }
        
        if (iconNode) {
          iconNode.style.background = isLight
            ? `rgba(${step.rgb}, ${0.05 + 0.1 * normalized})`
            : `rgba(${step.rgb}, ${0.1 + 0.15 * normalized})`;
        }

        if (textNode) {
          textNode.style.opacity = (0.7 + 0.3 * normalized).toString();
          textNode.style.textShadow = `0 0 ${10 * normalized}px rgba(${step.rgb}, ${0.5 * normalized})`;
        }

        if (arrowBox) {
            arrowBox.style.opacity = (0.4 + 0.6 * normalized).toString();
        }
      });

      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [displaySteps.length, ITEM_WIDTH, TOTAL_WIDTH, WRAP_OFFSET, isLight]);

  // Reduced motion fallback UI
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return (
    <section id="pipeline-flow" style={{ marginBottom: '80px' }}>
      <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 48px', padding: '0 24px' }}>
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

      <div 
        ref={containerRef}
        onMouseEnter={() => (isHovered.current = true)}
        onMouseLeave={() => (isHovered.current = false)}
        style={{ 
          position: 'relative', 
          overflow: reducedMotion ? 'auto' : 'hidden', 
          height: reducedMotion ? 'auto' : '180px', 
          width: '100%',
          display: reducedMotion ? 'flex' : 'block',
          gap: reducedMotion ? '8px' : '0',
          paddingBottom: '24px'
        }}
      >
        {reducedMotion ? (
          // Fallback for reduced motion
          steps.map((step, idx) => (
            <React.Fragment key={step.id}>
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
                  flexShrink: 0
                }}
              >
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    background: `rgba(${step.rgb}, 0.1)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <step.icon size={18} color={`rgb(${step.rgb})`} />
                </div>
                <span style={{ fontSize: '13px', fontWeight: 700, color: isLight ? '#0F172A' : '#F8FAFC' }}>
                  {step.title}
                </span>
              </CinematicCard>
              {idx < steps.length - 1 && (
                <div style={{ width: '32px', height: '2px', background: `linear-gradient(90deg, rgb(${step.rgb}) 0%, transparent 100%)`, position: 'relative', alignSelf: 'center', flexShrink: 0 }}>
                  <ArrowRight size={14} color={`rgb(${step.rgb})`} style={{ position: 'absolute', right: '-8px', top: '-6px' }} />
                </div>
              )}
            </React.Fragment>
          ))
        ) : (
          // Animated carousel elements
          displaySteps.map((step, idx) => (
            <div
              key={`${step.id}-${idx}`}
              ref={(el) => { itemsRef.current[idx] = el; }}
              style={{
                position: 'absolute',
                top: '10px',
                left: 0,
                width: `${ITEM_WIDTH}px`,
                display: 'flex',
                alignItems: 'center',
                willChange: 'transform, opacity',
                opacity: 0, // initially hidden until first frame
              }}
            >
              <CinematicCard
                className="flow-card"
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
                  flexShrink: 0,
                  transition: 'none', // Managed by JS
                }}
              >
                <div
                  className="flow-icon-box"
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    background: `rgba(${step.rgb}, 0.1)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <step.icon size={18} color={`rgb(${step.rgb})`} />
                </div>
                <span className="flow-text" style={{ fontSize: '13px', fontWeight: 700, color: isLight ? '#0F172A' : '#F8FAFC' }}>
                  {step.title}
                </span>
              </CinematicCard>
              
              <div className="flow-arrow" style={{ width: '60px', display: 'flex', justifyContent: 'center', position: 'relative' }}>
                <div style={{ width: '32px', height: '2px', background: `linear-gradient(90deg, rgb(${step.rgb}) 0%, transparent 100%)`, position: 'relative' }}>
                  <ArrowRight size={14} color={`rgb(${step.rgb})`} style={{ position: 'absolute', right: '-8px', top: '-6px' }} />
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
};
