import { Chip } from '@mui/material';
import { Column } from '@/shared/components';
import { currencyFormatter, dateFormatter, type CsvColumn } from '@/shared/utils';
import { getPurchaseStatusColor, getPurchaseStatusLabel } from '@/features/purchases/utils/purchaseStatusStyles';
import { ReportView } from '../ReportView/ReportView';
import { usePurchasesReportData } from '../../hooks/useReportData';
import type { PurchasesReportRow } from '../../types/report.types';
import type { PurchaseStatus } from '@/features/purchases/types/purchase.types';

// Matches PurchaseStatus exactly (purchase.types.ts).
const STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending' },
  { value: 'received', label: 'Received' },
  { value: 'cancelled', label: 'Cancelled' },
];

const COLUMNS: Column<PurchasesReportRow>[] = [
  { key: 'purchaseNumber', label: 'PO Number' },
  { key: 'supplierName', label: 'Supplier' },
  { key: 'totalAmount', label: 'Amount', align: 'right', render: (value: number) => currencyFormatter.usd(value) },
  { key: 'date', label: 'Date', render: (value: string) => dateFormatter.short(value) },
  {
    key: 'status',
    label: 'Status',
    render: (value: PurchaseStatus) => <Chip label={getPurchaseStatusLabel(value)} color={getPurchaseStatusColor(value)} size="small" />,
  },
];

const CSV_COLUMNS: CsvColumn<PurchasesReportRow>[] = [
  { key: 'purchaseNumber', label: 'PO Number' },
  { key: 'supplierName', label: 'Supplier' },
  { key: 'totalAmount', label: 'Amount', format: (value) => Number(value).toFixed(2) },
  { key: 'date', label: 'Date', format: (value) => dateFormatter.iso(value as string) },
  { key: 'status', label: 'Status' },
];

export const PurchasesReportView = () => (
  <ReportView<PurchasesReportRow>
    useData={usePurchasesReportData}
    columns={COLUMNS}
    statusOptions={STATUS_OPTIONS}
    csvColumns={CSV_COLUMNS}
    filename="purchases-report.csv"
    chartTitle="Purchases Trend"
    chartColor="#ed6c02"
    seriesLabel="Purchases ($)"
    totalLabel="Total Purchases"
    errorMessage="Failed to load the purchases report."
    emptyMessage="No purchases in this range."
  />
);
