import React, { useState } from 'react';
import { Calendar, ChevronDown, Check } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

const periods = [
  { id: 'q3-2026', label: 'Q3 FY2026 (Aug – Oct)', status: 'Active Cycle' },
  { id: 'q4-2026', label: 'Q4 FY2026 (Nov – Jan)', status: 'Drafting' },
  { id: 'q1-2027', label: 'Q1 FY2027 (Feb – Apr)', status: 'Long-Range' },
];

export const PlanningPeriodBadge: React.FC = () => {
  const [selected, setSelected] = useState(periods[0]);
  const [isOpen, setIsOpen] = useState(false);
  const { mode } = useTheme();
  const isLight = mode === 'light';

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          height: '36px',
          padding: '0 12px',
          borderRadius: '10px',
          background: isLight ? '#F0FDF4' : '#07150E',
          border: isLight ? '1px solid #A7F3D0' : '1px solid #1B3B2B',
          color: isLight ? '#064E3B' : '#F0FDF4',
          fontSize: '12px',
          fontWeight: 600,
          cursor: 'pointer',
          transition: 'all 0.2s ease',
        }}
      >
        <Calendar size={14} color="#16A34A" />
        <span style={{ fontFamily: "'JetBrains Mono', monospace" }}>{selected.label}</span>
        <span
          style={{
            fontSize: '10px',
            padding: '1px 5px',
            borderRadius: '4px',
            background: '#16A34A',
            color: '#000000',
            fontWeight: 800,
          }}
        >
          {selected.status}
        </span>
        <ChevronDown size={13} color="#86A795" />
      </button>

      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: '42px',
            left: 0,
            width: '240px',
            borderRadius: '12px',
            background: isLight ? '#FFFFFF' : '#0A0F0C',
            border: isLight ? '1px solid #A7F3D0' : '1px solid #1B3B2B',
            boxShadow: '0 10px 30px rgba(0,0,0,0.8)',
            padding: '6px',
            zIndex: 100,
          }}
        >
          <div
            style={{
              fontSize: '10px',
              fontWeight: 700,
              color: '#86A795',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              padding: '6px 10px',
            }}
          >
            Select Planning Horizon
          </div>
          {periods.map((p) => (
            <div
              key={p.id}
              onClick={() => {
                setSelected(p);
                setIsOpen(false);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '8px 10px',
                borderRadius: '8px',
                cursor: 'pointer',
                background: selected.id === p.id ? (isLight ? '#D1FAE5' : '#071A11') : 'transparent',
                color: isLight ? '#064E3B' : '#F0FDF4',
                fontSize: '12px',
                fontWeight: 500,
              }}
            >
              <div>
                <div>{p.label}</div>
                <div style={{ fontSize: '10px', color: '#86A795' }}>{p.status}</div>
              </div>
              {selected.id === p.id && <Check size={14} color="#16A34A" />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
