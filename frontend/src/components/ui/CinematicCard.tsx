import React, { type ReactNode } from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '../../utils/cn';
import { cardEntranceVariants } from '../../utils/animations';

export interface CinematicCardProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  children: ReactNode;
  glowColor?: 'cyan' | 'indigo' | 'emerald' | 'amber' | 'rose' | 'none';
  interactive?: boolean;
  headerAction?: ReactNode;
  title?: string;
  subtitle?: string;
  icon?: ReactNode;
  className?: string;
}

export const CinematicCard: React.FC<CinematicCardProps> = ({
  children,
  glowColor = 'none',
  interactive = false,
  headerAction,
  title,
  subtitle,
  icon,
  className,
  style,
  ...props
}) => {
  return (
    <motion.div
      variants={cardEntranceVariants}
      whileHover={interactive ? { y: -1, transition: { duration: 0.15 } } : undefined}
      className={cn(
        'glass-panel relative overflow-hidden p-5',
        interactive && 'glass-panel-interactive cursor-pointer',
        className
      )}
      style={{
        ...style,
      }}
      {...props}
    >
      {(title || headerAction || icon) && (
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            marginBottom: '16px',
            gap: '16px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0, flex: 1 }}>
            {icon && (
              <div
                style={{
                  padding: '8px',
                  borderRadius: '8px',
                  background: '#07150E',
                  border: '1px solid #1B3B2B',
                  color: '#16A34A',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {icon}
              </div>
            )}
            <div>
              {title && (
                <h3
                  style={{
                    fontSize: '15px',
                    fontWeight: 700,
                    color: 'inherit',
                    letterSpacing: '-0.01em',
                  }}
                >
                  {title}
                </h3>
              )}
              {subtitle && (
                <p
                  style={{
                    fontSize: '12px',
                    color: '#94A3B8',
                    marginTop: '2px',
                  }}
                >
                  {subtitle}
                </p>
              )}
            </div>
          </div>
          {headerAction && <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center' }}>{headerAction}</div>}
        </div>
      )}

      {children}
    </motion.div>
  );
};
