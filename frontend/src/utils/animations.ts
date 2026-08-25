import type { Variants, Transition } from 'framer-motion';

export const springTransition: Transition = {
  type: 'spring',
  stiffness: 300,
  damping: 30,
};

export const smoothTransition: Transition = {
  duration: 0.2,
  ease: [0.16, 1, 0.3, 1],
};

export const pageFadeSlideVariants: Variants = {
  initial: {
    opacity: 0,
    y: 4,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.25,
      ease: [0.16, 1, 0.3, 1],
      when: 'beforeChildren',
      staggerChildren: 0.04,
    },
  },
  exit: {
    opacity: 0,
    y: -6,
    transition: {
      duration: 0.15,
      ease: 'easeInOut',
    },
  },
};

export const staggerContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.04,
      delayChildren: 0.05,
    },
  },
};

export const cardEntranceVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 4,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: smoothTransition,
  },
};

export const modalBackdropVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.15 } },
  exit: { opacity: 0, transition: { duration: 0.1 } },
};

export const modalPanelVariants: Variants = {
  hidden: { opacity: 0, scale: 0.97, y: 10 },
  visible: { opacity: 1, scale: 1, y: 0, transition: smoothTransition },
  exit: { opacity: 0, scale: 0.98, y: 8, transition: { duration: 0.12 } },
};

export const drawerVariants: Variants = {
  hidden: { x: '100%', opacity: 0.8 },
  visible: { x: 0, opacity: 1, transition: smoothTransition },
  exit: { x: '100%', opacity: 0, transition: { duration: 0.2, ease: 'easeInOut' } },
};

// Static glow — no animation, just a style reference
export const glowPulseVariants: Variants = {
  idle: {
    boxShadow: '0 0 8px rgba(16, 185, 129, 0.15)',
  },
  pulse: {
    boxShadow: '0 0 8px rgba(16, 185, 129, 0.15)',
  },
};

// Single entrance float — no infinite repeat
export const floatVariants: Variants = {
  float: {
    y: 0,
    transition: {
      duration: 0.3,
      ease: 'easeOut',
    },
  },
};
