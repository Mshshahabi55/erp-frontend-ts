import { useMemo, useState } from 'react';
import { Box, Alert, Button } from '@mui/material';
import { Refresh } from '@mui/icons-material';
import type { Column } from '@/shared/components';
import type { CsvColumn } from '@/shared/utils';
import { ReportDateRangeFilter, ALL_REPORT_STATUSES } from '../ReportDateRangeFilter/ReportDateRangeFilter';
import { ReportSummaryCards } from '../ReportSummaryCards/ReportSummaryCards';
import { ReportTrendChart } from '../ReportTrendChart/ReportTrendChart';
import { ReportTable } from '../ReportTable/ReportTable';
import { ReportExportButton } from '../ReportExportButton/ReportExportButton';
import { ReportPrintButton } from '../ReportPrintButton/ReportPrintButton';
import {
  filterReportRows,
  summarizeReportRows,
  buildReportTrend,
  computeDefaultDateRange,
  type ReportRowBase,
} from '../../utils/reportAggregation';
import type { DateRange } from '../../types/report.types';

interface ReportDataResult<T> {
  data: T[] | undefined;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

interface StatusOption {
  value: string;
  label: string;
}

export interface ReportViewConfig<T extends ReportRowBase & { id: string | number }> {
  useData: () => ReportDataResult<T>;
  columns: Column<T>[];
  statusOptions: StatusOption[];
  csvColumns: CsvColumn<T>[];
  filename: string;
  chartTitle: string;
  chartColor: string;
  seriesLabel: string;
  totalLabel: string;
  errorMessage: string;
  emptyMessage: string;
}

/**
 * Every transactional report (Sales/Purchases/Orders) is the same shape:
 * date-range + status filtering, a summary, a trend chart, an export/print
 * pair, and a paginated table - only the data source, columns, and labels
 * differ. This is that shape, built once; each report supplies its own
 * config instead of re-implementing the state/filtering/layout.
 */
export function ReportView<T extends ReportRowBase & { id: string | number }>({
  useData,
  columns,
  statusOptions,
  csvColumns,
  filename,
  chartTitle,
  chartColor,
  seriesLabel,
  totalLabel,
  errorMessage,
  emptyMessage,
}: ReportViewConfig<T>) {
  const { data: rawRows, isLoading, error, refetch } = useData();
  const [dateRange, setDateRange] = useState<DateRange | null>(null);
  const [statusFilter, setStatusFilter] = useState(ALL_REPORT_STATUSES);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const defaultRange = useMemo(() => computeDefaultDateRange(rawRows ?? []), [rawRows]);
  const effectiveRange = dateRange ?? defaultRange;

  const filteredRows = useMemo(
    () =>
      filterReportRows(
        rawRows ?? [],
        effectiveRange,
        statusFilter === ALL_REPORT_STATUSES ? undefined : statusFilter
      ),
    [rawRows, effectiveRange, statusFilter]
  );

  const summary = useMemo(() => summarizeReportRows(filteredRows), [filteredRows]);
  const trend = useMemo(() => buildReportTrend(filteredRows), [filteredRows]);

  const handleDateRangeChange = (range: DateRange) => {
    setDateRange(range);
    setPage(0);
  };

  const handleStatusFilterChange = (status: string) => {
    setStatusFilter(status);
    setPage(0);
  };

  if (error) {
    return (
      <Alert
        severity="error"
        action={
          <Button color="inherit" size="small" onClick={() => refetch()} startIcon={<Refresh />}>
            Retry
          </Button>
        }
      >
        {errorMessage}
      </Alert>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
        <ReportDateRangeFilter
          dateRange={effectiveRange}
          onDateRangeChange={handleDateRangeChange}
          statusFilter={statusFilter}
          onStatusFilterChange={handleStatusFilterChange}
          statusOptions={statusOptions}
        />
        <Box className="no-print" sx={{ display: 'flex', gap: 1, mb: 3 }}>
          <ReportExportButton rows={filteredRows} columns={csvColumns} filename={filename} />
          <ReportPrintButton />
        </Box>
      </Box>

      <ReportSummaryCards summary={summary} isLoading={isLoading} totalLabel={totalLabel} />

      <Box sx={{ mb: 3 }}>
        <ReportTrendChart title={chartTitle} seriesLabel={seriesLabel} data={trend} isLoading={isLoading} color={chartColor} />
      </Box>

      <ReportTable
        columns={columns}
        rows={filteredRows}
        isLoading={isLoading}
        page={page}
        pageSize={pageSize}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
        emptyMessage={emptyMessage}
      />
    </Box>
  );
}
