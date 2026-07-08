import { format, compareAsc } from 'date-fns';

export interface DatedAmount {
  date: string;
  amount: number;
}

export interface MonthlyAmount {
  month: string;
  amount: number;
}

const monthKey = (isoDate: string): string => format(new Date(isoDate), 'MMM yyyy');

/** Buckets amounts by calendar month, in chronological order, formatted for chart axes. */
export const groupByMonth = (records: DatedAmount[]): MonthlyAmount[] => {
  const totalsByMonth = new Map<string, { label: string; sortDate: Date; total: number }>();

  for (const record of records) {
    const date = new Date(record.date);
    const label = monthKey(record.date);
    const existing = totalsByMonth.get(label);
    if (existing) {
      existing.total += record.amount;
    } else {
      totalsByMonth.set(label, { label, sortDate: date, total: record.amount });
    }
  }

  return Array.from(totalsByMonth.values())
    .sort((a, b) => compareAsc(a.sortDate, b.sortDate))
    .map((entry) => ({ month: entry.label, amount: Math.round(entry.total * 100) / 100 }));
};
