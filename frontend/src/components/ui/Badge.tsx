import React, { type ReactNode } from 'react';
import { cn } from '../../utils/cn';
import { useTheme } from '../../hooks/useTheme';

export type BadgeVariant = 'cyan' | 'emerald' | 'indigo' | 'amber' | 'rose' | 'muted';

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  pulse?: boolean;
  className?: string;
  icon?: ReactNode;
}

const getVariantStyles = (variant: BadgeVariant, isLight: boolean) => {
  const styles = {
    cyan: {
      bg: isLight ? '#ECFEFF' : '#0A1310',
      text: isLight ? '#0891B2' : '#22C55E', // Using Cyan text for light mode cyan variant
      border: isLight ? '#A5F3FC' : '#15803D',
      dot: isLight ? '#06B6D4' : '#16A34A',
    },
    emerald: {
      bg: isLight ? '#F0FDF4' : '#0A1310',
      text: isLight ? '#16A34A' : '#16A34A',
      border: isLight ? '#BBF7D0' : '#15803D',
      dot: isLight ? '#22C55E' : '#16A34A',
    },
    indigo: {
      bg: isLight ? '#EEF2FF' : '#0A1310',
      text: isLight ? '#4F46E5' : '#86EFAC',
      border: isLight ? '#C7D2FE' : '#14532D',
      dot: isLight ? '#6366F1' : '#15803D',
    },
    amber: {
      bg: isLight ? '#FFFBEB' : '#140E05',
      text: isLight ? '#D97706' : '#FBBF24',
      border: isLight ? '#FDE68A' : '#3D2A0A',
      dot: isLight ? '#F59E0B' : '#F59E0B',
    },
    rose: {
      bg: isLight ? '#FFF1F2' : '#16080A',
      text: isLight ? '#E11D48' : '#F87171',
      border: isLight ? '#FECDD3' : '#45161C',
      dot: isLight ? '#F43F5E' : '#EF4444',
    },
    muted: {
      bg: isLight ? '#F8FAFC' : '#0A0F0B',
      text: isLight ? '#64748B' : '#6B7280',
      border: isLight ? '#E2E8F0' : '#1A241E',
      dot: isLight ? '#94A3B8' : '#374151',
    },
  };
  return styles[variant] || styles.muted;
};

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'cyan',
  pulse = false,
  className,
  icon,
}) => {
  const { mode } = useTheme();
  const isLight = mode === 'light';
  
  const styles = getVariantStyles(variant, isLight);

  return (
    <span
      className={cn('inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide', className)}
      style={{
        backgroundColor: styles.bg,
        color: styles.text,
        border: `1px solid ${styles.border}`,
      }}
    >
      {pulse ? (
        <span
          className="w-1.5 h-1.5 rounded-full animate-pulse"
          style={{
            backgroundColor: styles.dot,
          }}
        />
      ) : icon ? (
        <span className="flex items-center">{icon}</span>
      ) : null}
      {children}
    </span>
  );
};
