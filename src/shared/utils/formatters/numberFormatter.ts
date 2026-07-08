export const numberFormatter = {
  // Format: "1,234"
  integer: (num: number): string => {
    return new Intl.NumberFormat('en-GB').format(num);
  },

  // Format: "1,234.56"
  decimal: (num: number, decimals: number = 2): string => {
    return new Intl.NumberFormat('en-GB', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(num);
  },

  // Format: "1.2K", "2.5M"
  compact: (num: number): string => {
    return new Intl.NumberFormat('en-GB', {
      notation: 'compact',
      compactDisplay: 'short',
    }).format(num);
  },

  // Format percentage: "45.6%"
  percentage: (num: number, decimals: number = 1): string => {
    return new Intl.NumberFormat('en-GB', {
      style: 'percent',
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(num / 100);
  },

  // Pad with leading zeros: "00123"
  pad: (num: number, length: number = 5): string => {
    return String(num).padStart(length, '0');
  },
};