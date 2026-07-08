export interface CsvColumn<T> {
  key: keyof T;
  label: string;
  format?: (value: T[keyof T], row: T) => string;
}

const escapeCsvValue = (value: string): string => {
  if (/[",\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
};

/** Builds a CSV file from rows and triggers a browser download. */
export function exportToCsv<T>(rows: T[], columns: CsvColumn<T>[], filename: string): void {
  const header = columns.map((column) => escapeCsvValue(column.label)).join(',');

  const body = rows.map((row) =>
    columns
      .map((column) => {
        const rawValue = row[column.key];
        const formatted = column.format ? column.format(rawValue, row) : String(rawValue ?? '');
        return escapeCsvValue(formatted);
      })
      .join(',')
  );

  const csvContent = [header, ...body].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
