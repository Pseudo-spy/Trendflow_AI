import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

export const ThemeToggle: React.FC = () => {
  const { mode, toggleTheme } = useTheme();
  const isLight = mode === 'light';

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggleTheme}
      title={`Current: ${mode} mode. Click to switch theme.`}
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '6px',
        height: '36px',
        padding: '0 12px',
        borderRadius: '10px',
        background: isLight ? 'rgba(2, 132, 199, 0.1)' : 'rgba(255, 255, 255, 0.06)',
        border: isLight ? '1px solid rgba(2, 132, 199, 0.25)' : '1px solid rgba(255, 255, 255, 0.12)',
        color: isLight ? '#0284C7' : '#FBBF24',
        cursor: 'pointer',
        overflow: 'hidden',
        fontSize: '12px',
        fontWeight: 600,
        boxShadow: isLight ? '0 0 12px rgba(2, 132, 199, 0.15)' : '0 0 12px rgba(245, 158, 11, 0.15)',
      }}
    >
      <AnimatePresence mode="wait" initial={false}>
        {isLight ? (
          <motion.div
            key="moon-icon"
            initial={{ rotate: -90, scale: 0, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            exit={{ rotate: 90, scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Moon size={15} color="#0284C7" />
            <span style={{ color: '#0F172A' }}>Light</span>
          </motion.div>
        ) : (
          <motion.div
            key="sun-icon"
            initial={{ rotate: 90, scale: 0, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            exit={{ rotate: -90, scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Sun size={15} color="#FBBF24" />
            <span style={{ color: '#F8FAFC' }}>Dark</span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
};
