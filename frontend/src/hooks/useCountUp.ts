import { useState, useEffect } from 'react';

interface UseCountUpOptions {
  duration?: number; // duration in ms
  startVal?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
}

export function useCountUp(targetVal: number, options: UseCountUpOptions = {}) {
  const { duration = 1200, startVal = 0, decimals = 0, prefix = '', suffix = '' } = options;
  const [displayValue, setDisplayValue] = useState<string>(
    `${prefix}${startVal.toFixed(decimals)}${suffix}`
  );

  useEffect(() => {
    let startTimestamp: number | null = null;
    let animationFrameId: number;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // Ease out cubic
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const current = startVal + (targetVal - startVal) * easeProgress;

      setDisplayValue(
        `${prefix}${current.toLocaleString('en-US', {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        })}${suffix}`
      );

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(step);
      }
    };

    animationFrameId = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [targetVal, duration, startVal, decimals, prefix, suffix]);

  return displayValue;
}
