import { Button } from '@mui/material';
import { Download } from '@mui/icons-material';
import { exportToCsv, type CsvColumn } from '@/shared/utils';

interface ReportExportButtonProps<T> {
  rows: T[];
  columns: CsvColumn<T>[];
  filename: string;
}

export function ReportExportButton<T>({ rows, columns, filename }: ReportExportButtonProps<T>) {
  return (
    <Button
      className="no-print"
      variant="outlined"
      startIcon={<Download />}
      onClick={() => exportToCsv(rows, columns, filename)}
      disabled={rows.length === 0}
    >
      Export CSV
    </Button>
  );
}
