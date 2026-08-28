import React, { type ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { pageFadeSlideVariants } from '../utils/animations';

interface PageTransitionLayoutProps {
  children: ReactNode;
}

export const PageTransitionLayout: React.FC<PageTransitionLayoutProps> = ({ children }) => {
  const prefersReducedMotion = useReducedMotion();
  
  return (
    <motion.div
      variants={prefersReducedMotion ? undefined : pageFadeSlideVariants}
      initial={prefersReducedMotion ? undefined : "initial"}
      animate={prefersReducedMotion ? undefined : "animate"}
      exit={prefersReducedMotion ? undefined : "exit"}
      style={{
        position: 'relative',
        zIndex: 10,
        width: '100%',
      }}
    >
      {children}
    </motion.div>
  );
};
