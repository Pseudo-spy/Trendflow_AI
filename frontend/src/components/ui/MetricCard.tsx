import React, { type ReactNode } from 'react';
import { CinematicCard } from './CinematicCard';
import { Badge, type BadgeVariant } from './Badge';
import { useCountUp } from '../../hooks/useCountUp';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export interface MetricCardProps {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  change?: number; // e.g. +5.2% or -1.4%
  changeLabel?: string;
  icon?: ReactNode;
  statusBadge?: { label: string; variant: BadgeVariant };
  glowColor?: 'cyan' | 'indigo' | 'emerald' | 'amber' | 'rose' | 'none';
  className?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  prefix = '',
  suffix = '',
  decimals = 0,
  change,
  changeLabel = 'vs last cycle',
  icon,
  statusBadge,
  glowColor = 'none',
  className,
}) => {
  const animatedValue = useCountUp(value, {
    prefix,
    suffix,
    decimals,
  });

  const isPositive = change !== undefined && change > 0;
  const isNegative = change !== undefined && change < 0;

  return (
    <CinematicCard
      glowColor={glowColor}
      className={className}
      interactive
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {icon && (
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: '#07150E',
                border: '1px solid #1B3B2B',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#16A34A',
              }}
            >
              {icon}
            </div>
          )}
          <span style={{ fontSize: '13px', fontWeight: 600, color: '#86A795' }}>{label}</span>
        </div>
        {statusBadge && (
          <Badge variant={statusBadge.variant} pulse>
            {statusBadge.label}
          </Badge>
        )}
      </div>

      <div style={{ marginTop: '16px' }}>
        <div
          style={{
            fontSize: '28px',
            fontWeight: 800,
            color: '#F8FAFC',
            fontFamily: "'JetBrains Mono', monospace",
            letterSpacing: '-0.02em',
          }}
        >
          {animatedValue}
        </div>

        {change !== undefined && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              marginTop: '8px',
              fontSize: '12px',
              fontWeight: 600,
            }}
          >
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '2px',
                color: isPositive ? '#16A34A' : isNegative ? '#F43F5E' : '#94A3B8',
              }}
            >
              {isPositive ? <TrendingUp size={14} /> : isNegative ? <TrendingDown size={14} /> : <Minus size={14} />}
              {isPositive ? `+${change}%` : `${change}%`}
            </span>
            <span style={{ color: '#64748B', fontWeight: 400 }}>{changeLabel}</span>
          </div>
        )}
      </div>
    </CinematicCard>
  );
};
