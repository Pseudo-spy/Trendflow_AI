import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

interface SearchBarProps {
  onSearch?: (query: string) => void;
  placeholder?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  placeholder = 'Search SKUs, nodes, suppliers, scenarios...',
}) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const { mode } = useTheme();
  const isLight = mode === 'light';

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        const input = document.getElementById('global-search-input');
        input?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    onSearch?.(e.target.value);
  };

  const handleClear = () => {
    setQuery('');
    onSearch?.('');
  };

  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        maxWidth: '300px',
        minWidth: '120px',
        height: '36px',
        borderRadius: '10px',
        background: isLight ? '#FFFFFF' : '#040705',
        border: isFocused
          ? '1px solid #16A34A'
          : isLight
          ? '1px solid #D1FAE5'
          : '1px solid #162E20',
        boxShadow: isFocused ? '0 0 15px rgba(16, 185, 129, 0.25)' : 'none',
        transition: 'all 0.2s ease',
        padding: '0 10px',
      }}
    >
      <Search
        size={14}
        color={isFocused ? '#16A34A' : isLight ? '#15803D' : '#86A795'}
        style={{ marginRight: '8px', flexShrink: 0 }}
      />
      <input
        id="global-search-input"
        type="text"
        value={query}
        onChange={handleChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        style={{
          width: '100%',
          background: 'transparent',
          border: 'none',
          outline: 'none',
          fontSize: '12px',
          color: isLight ? '#0F172A' : '#F8FAFC',
          fontFamily: "'Plus Jakarta Sans', sans-serif",
        }}
      />
      {query ? (
        <button
          onClick={handleClear}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#94A3B8',
            cursor: 'pointer',
            padding: '2px',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <X size={13} />
        </button>
      ) : (
        <kbd
          style={{
            fontSize: '10px',
            fontFamily: "'JetBrains Mono', monospace",
            fontWeight: 700,
            padding: '2px 5px',
            borderRadius: '4px',
            background: isLight ? 'rgba(15, 23, 42, 0.06)' : 'rgba(255, 255, 255, 0.08)',
            color: isLight ? '#64748B' : '#94A3B8',
            border: isLight ? '1px solid rgba(15, 23, 42, 0.1)' : '1px solid rgba(255, 255, 255, 0.12)',
            flexShrink: 0,
          }}
        >
          ⌘K
        </kbd>
      )}
    </div>
  );
};
