import { format, formatDistance, parseISO, differenceInDays, isToday, isPast } from 'date-fns';

export const dateFormatter = {
  /**
   * Short date format: "20 Jan 2025"
   */
  short: (date: string | Date): string => {
    const d = typeof date === 'string' ? parseISO(date) : date;
    return format(d, 'dd MMM yyyy');
  },

  /**
   * Long date format: "20 January 2025, 14:30"
   */
  long: (date: string | Date): string => {
    const d = typeof date === 'string' ? parseISO(date) : date;
    return format(d, 'dd MMMM yyyy, HH:mm');
  },

  /**
   * ISO date format: "2025-01-20"
   */
  iso: (date: string | Date): string => {
    const d = typeof date === 'string' ? parseISO(date) : date;
    return format(d, 'yyyy-MM-dd');
  },

  /**
   * Time ago: "2 days ago"
   */
  timeAgo: (date: string | Date): string => {
    const d = typeof date === 'string' ? parseISO(date) : date;
    return formatDistance(d, new Date(), { addSuffix: true });
  },

  /**
   * Days between two dates
   */
  daysBetween: (date1: string | Date, date2: string | Date): number => {
    const d1 = typeof date1 === 'string' ? parseISO(date1) : date1;
    const d2 = typeof date2 === 'string' ? parseISO(date2) : date2;
    return differenceInDays(d2, d1);
  },

  /**
   * Check if date is today
   */
  isToday: (date: string | Date): boolean => {
    const d = typeof date === 'string' ? parseISO(date) : date;
    return isToday(d);
  },

  /**
   * Check if date is in the past
   */
  isPast: (date: string | Date): boolean => {
    const d = typeof date === 'string' ? parseISO(date) : date;
    return isPast(d);
  },

  /**
   * Format with custom pattern
   */
  custom: (date: string | Date, pattern: string): string => {
    const d = typeof date === 'string' ? parseISO(date) : date;
    return format(d, pattern);
  },
};