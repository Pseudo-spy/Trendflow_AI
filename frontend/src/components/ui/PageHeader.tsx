import React, { type ReactNode } from 'react';
import { Badge } from './Badge';

export interface PageHeaderProps {
  title: string;
  subtitle?: string;
  badgeText?: string;
  badgeVariant?: 'cyan' | 'emerald' | 'indigo' | 'amber' | 'rose';
  actions?: ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  badgeText,
  badgeVariant = 'cyan',
  actions,
}) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '24px',
        paddingBottom: '16px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.07)',
      }}
    >
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <h1
            style={{
              fontSize: '24px',
              fontWeight: 800,
              color: '#F8FAFC',
              letterSpacing: '-0.02em',
            }}
          >
            {title}
          </h1>
          {badgeText && (
            <Badge variant={badgeVariant} pulse>
              {badgeText}
            </Badge>
          )}
        </div>
        {subtitle && (
          <p
            style={{
              fontSize: '14px',
              color: '#94A3B8',
              marginTop: '4px',
            }}
          >
            {subtitle}
          </p>
        )}
      </div>

      {actions && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {actions}
        </div>
      )}
    </div>
  );
};
