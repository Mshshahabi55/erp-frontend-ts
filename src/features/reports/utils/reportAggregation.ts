import { groupByMonth, type MonthlyAmount } from '@/shared/utils';
import type { DateRange, ReportSummary } from '../types/report.types';

export interface ReportRowBase {
  date: string;
  totalAmount: number;
  status: string;
}

/** Filters report rows to a date range (inclusive, compared on the date part only) and an optional status. */
export const filterReportRows = <T extends ReportRowBase>(rows: T[], dateRange: DateRange, status?: string): T[] => {
  return rows.filter((row) => {
    const rowDate = row.date.slice(0, 10);
    if (rowDate < dateRange.from || rowDate > dateRange.to) {
      return false;
    }
    if (status && row.status !== status) {
      return false;
    }
    return true;
  });
};

export const summarizeReportRows = (rows: ReportRowBase[]): ReportSummary => {
  const transactionCount = rows.length;
  const totalAmount = rows.reduce((sum, row) => sum + row.totalAmount, 0);
  const averageAmount = transactionCount === 0 ? 0 : totalAmount / transactionCount;

  return {
    totalAmount: Math.round(totalAmount * 100) / 100,
    transactionCount,
    averageAmount: Math.round(averageAmount * 100) / 100,
  };
};

export const buildReportTrend = (rows: ReportRowBase[]): MonthlyAmount[] =>
  groupByMonth(rows.map((row) => ({ date: row.date, amount: row.totalAmount })));

const TODAY = () => new Date().toISOString().slice(0, 10);
const FALLBACK_RANGE_DAYS = 90;

/** Defaults to the full span of the available data, so the report isn't empty on first load. */
export const computeDefaultDateRange = (rows: ReportRowBase[]): DateRange => {
  if (rows.length === 0) {
    const to = new Date();
    const from = new Date();
    from.setDate(from.getDate() - FALLBACK_RANGE_DAYS);
    return { from: from.toISOString().slice(0, 10), to: to.toISOString().slice(0, 10) };
  }

  const dates = rows.map((row) => row.date.slice(0, 10)).sort();
  return { from: dates[0], to: dates[dates.length - 1] ?? TODAY() };
};
