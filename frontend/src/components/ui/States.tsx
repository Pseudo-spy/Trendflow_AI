import React from 'react';
import { RefreshCcw, AlertTriangle, Inbox } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { GlowButton } from './GlowButton';

export const LoadingState: React.FC<{ message?: string }> = ({ message = 'Loading...' }) => {
  const { mode } = useTheme();
  const isLight = mode === 'light';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 20px', color: isLight ? '#64748B' : '#94A3B8' }}>
      <RefreshCcw className="animate-spin" size={32} style={{ marginBottom: '16px', color: '#06B6D4' }} />
      <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '14px' }}>{message}</p>
    </div>
  );
};

export const ErrorState: React.FC<{ error: string; onRetry?: () => void }> = ({ error, onRetry }) => {
  const { mode } = useTheme();
  const isLight = mode === 'light';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 20px', color: isLight ? '#64748B' : '#94A3B8', textAlign: 'center' }}>
      <AlertTriangle size={48} style={{ marginBottom: '16px', color: '#F43F5E' }} />
      <h3 style={{ fontSize: '18px', fontWeight: 600, color: isLight ? '#0F172A' : '#F8FAFC', marginBottom: '8px' }}>Something went wrong</h3>
      <p style={{ marginBottom: '24px', maxWidth: '400px' }}>{error}</p>
      {onRetry && (
        <GlowButton onClick={onRetry} variant="secondary" icon={<RefreshCcw size={16} />}>
          Retry
        </GlowButton>
      )}
    </div>
  );
};

export const EmptyState: React.FC<{ title?: string; message?: string }> = ({ title = 'No Data Found', message = 'There is currently no data available to display.' }) => {
  const { mode } = useTheme();
  const isLight = mode === 'light';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 20px', color: isLight ? '#64748B' : '#94A3B8', textAlign: 'center' }}>
      <Inbox size={48} style={{ marginBottom: '16px', color: '#06B6D4', opacity: 0.5 }} />
      <h3 style={{ fontSize: '18px', fontWeight: 600, color: isLight ? '#0F172A' : '#F8FAFC', marginBottom: '8px' }}>{title}</h3>
      <p style={{ maxWidth: '400px' }}>{message}</p>
    </div>
  );
};
