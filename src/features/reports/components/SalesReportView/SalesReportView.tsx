import { Chip } from '@mui/material';
import { Column } from '@/shared/components';
import { currencyFormatter, dateFormatter, type CsvColumn } from '@/shared/utils';
import { getSaleStatusColor, getSaleStatusLabel } from '@/features/sales/utils/saleStatusStyles';
import { ReportView } from '../ReportView/ReportView';
import { useSalesReportData } from '../../hooks/useReportData';
import type { SalesReportRow } from '../../types/report.types';
import type { SaleStatus } from '@/features/sales/types/sale.types';

// Matches SaleStatus exactly (sale.types.ts).
const STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
];

const COLUMNS: Column<SalesReportRow>[] = [
  { key: 'invoiceNumber', label: 'Invoice' },
  { key: 'customerName', label: 'Customer' },
  { key: 'totalAmount', label: 'Amount', align: 'right', render: (value: number) => currencyFormatter.usd(value) },
  { key: 'date', label: 'Date', render: (value: string) => dateFormatter.short(value) },
  {
    key: 'status',
    label: 'Status',
    render: (value: SaleStatus) => <Chip label={getSaleStatusLabel(value)} color={getSaleStatusColor(value)} size="small" />,
  },
];

const CSV_COLUMNS: CsvColumn<SalesReportRow>[] = [
  { key: 'invoiceNumber', label: 'Invoice Number' },
  { key: 'customerName', label: 'Customer' },
  { key: 'totalAmount', label: 'Amount', format: (value) => Number(value).toFixed(2) },
  { key: 'date', label: 'Date', format: (value) => dateFormatter.iso(value as string) },
  { key: 'status', label: 'Status' },
];

export const SalesReportView = () => (
  <ReportView<SalesReportRow>
    useData={useSalesReportData}
    columns={COLUMNS}
    statusOptions={STATUS_OPTIONS}
    csvColumns={CSV_COLUMNS}
    filename="sales-report.csv"
    chartTitle="Sales Trend"
    chartColor="#2e7d32"
    seriesLabel="Sales ($)"
    totalLabel="Total Sales"
    errorMessage="Failed to load the sales report."
    emptyMessage="No sales in this range."
  />
);
