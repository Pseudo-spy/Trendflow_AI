import { useState, useEffect } from 'react';

/**
 * Hook to coordinate sequential multi-step animated states
 */
export function useAnimationSequence(stepCount: number, intervalMs: number = 2000, loop: boolean = true) {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => {
        if (prev >= stepCount - 1) {
          return loop ? 0 : prev;
        }
        return prev + 1;
      });
    }, intervalMs);

    return () => clearInterval(timer);
  }, [stepCount, intervalMs, loop]);

  return { activeStep, setActiveStep };
}
