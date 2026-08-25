/**
 * Currency formatting utility
 */
export const formatCurrency = (amount: number, currency: string = 'USD', compact: boolean = false): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    notation: compact ? 'compact' : 'standard',
    maximumFractionDigits: compact ? 1 : 2,
  }).format(amount);
};

/**
 * Number formatting with commas and optional decimals
 */
export const formatNumber = (val: number, compact: boolean = false): string => {
  return new Intl.NumberFormat('en-US', {
    notation: compact ? 'compact' : 'standard',
    maximumFractionDigits: compact ? 1 : 0,
  }).format(val);
};

/**
 * Percentage formatting utility
 */
export const formatPercent = (val: number, decimals: number = 1): string => {
  return `${(val >= 0 ? '+' : '')}${val.toFixed(decimals)}%`;
};

/**
 * Format timestamp into standard enterprise date string
 */
export const formatDate = (date: Date | string | number): string => {
  const d = typeof date === 'object' ? date : new Date(date);
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};
