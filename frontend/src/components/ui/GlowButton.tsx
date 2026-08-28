import React, { type ButtonHTMLAttributes, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

export type ButtonVariant = 'primary' | 'secondary' | 'accent' | 'danger' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface GlowButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onAnimationStart' | 'onDragStart' | 'onDragEnd' | 'onDrag'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  glow?: boolean;
  loading?: boolean;
  children: ReactNode;
}

const variantStyles: Record<ButtonVariant, { base: string; glow: string; style: React.CSSProperties }> = {
  primary: {
    base: 'bg-green-600 hover:bg-green-500 text-white',
    glow: '0 0 10px rgba(22, 163, 74, 0.25)',
    style: {
      background: 'linear-gradient(135deg, #16A34A 0%, #15803D 100%)',
      border: '1px solid #22C55E',
      color: '#FFFFFF',
    },
  },
  secondary: {
    base: 'bg-black hover:bg-zinc-900 text-green-100',
    glow: '0 0 8px rgba(22, 163, 74, 0.08)',
    style: {
      background: '#0A0F0B',
      border: '1px solid #202E25',
      color: '#F0FDF4',
    },
  },
  accent: {
    base: 'bg-green-700 hover:bg-green-600 text-white',
    glow: '0 0 10px rgba(21, 128, 61, 0.25)',
    style: {
      background: 'linear-gradient(135deg, #15803D 0%, #166534 100%)',
      border: '1px solid #16A34A',
      color: '#FFFFFF',
    },
  },
  danger: {
    base: 'bg-rose-600 hover:bg-rose-500 text-white',
    glow: '0 0 10px rgba(239, 68, 68, 0.25)',
    style: {
      background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
      border: '1px solid #F87171',
      color: '#FFFFFF',
    },
  },
  ghost: {
    base: 'hover:bg-green-950/40 text-green-300',
    glow: 'none',
    style: {
      background: 'transparent',
      border: '1px solid transparent',
      color: '#86EFAC',
    },
  },
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-xs rounded-lg gap-1.5',
  md: 'px-4 py-2 text-sm rounded-xl gap-2',
  lg: 'px-6 py-3 text-base rounded-xl gap-2.5',
};

export const GlowButton: React.FC<GlowButtonProps> = ({
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  glow = true,
  loading = false,
  children,
  className,
  disabled,
  style,
  ...props
}) => {
  const currentVariant = variantStyles[variant];
  const [isHovered, setIsHovered] = React.useState(false);

  // Apply hover styles for primary variant manually if hovered
  const isPrimary = variant === 'primary';
  const activeBg = isHovered && isPrimary && !disabled 
    ? 'linear-gradient(135deg, #14532D 0%, #064E3B 100%)' 
    : currentVariant.style.background;
    
  const activeBorder = isHovered && isPrimary && !disabled
    ? '1px solid #14532D'
    : currentVariant.style.border;

  const activeShadow = isHovered && isPrimary && !disabled
    ? 'none'
    : glow && !disabled ? currentVariant.glow : 'none';

  return (
    <motion.button
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={undefined}
      whileTap={disabled ? undefined : { scale: 0.99 }}
      className={cn(
        'inline-flex items-center justify-center font-medium transition-all duration-200 cursor-pointer select-none disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap',
        currentVariant.base,
        sizeStyles[size],
        className
      )}
      style={{
        ...currentVariant.style,
        background: activeBg,
        border: activeBorder,
        boxShadow: activeShadow,
        ...style,
      }}
      disabled={disabled || loading}
      {...(props as React.ComponentProps<typeof motion.button>)}
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      ) : (
        <>
          {icon && iconPosition === 'left' && <span className="flex items-center">{icon}</span>}
          <span>{children}</span>
          {icon && iconPosition === 'right' && <span className="flex items-center">{icon}</span>}
        </>
      )}
    </motion.button>
  );
};
