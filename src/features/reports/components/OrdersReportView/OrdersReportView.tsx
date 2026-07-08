import { Chip } from '@mui/material';
import { Column } from '@/shared/components';
import { currencyFormatter, dateFormatter, type CsvColumn } from '@/shared/utils';
import { getOrderStatusColor, getOrderStatusLabel } from '@/features/orders/utils/orderStatusStyles';
import { ReportView } from '../ReportView/ReportView';
import { useOrdersReportData } from '../../hooks/useReportData';
import type { OrdersReportRow } from '../../types/report.types';
import type { OrderStatus } from '@/features/orders/types/order.types';

// Matches OrderStatus exactly (order.types.ts).
const STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending' },
  { value: 'processing', label: 'Processing' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
];

const COLUMNS: Column<OrdersReportRow>[] = [
  { key: 'orderNumber', label: 'Order #' },
  { key: 'customerName', label: 'Customer' },
  { key: 'itemCount', label: 'Items', align: 'right' },
  { key: 'totalAmount', label: 'Amount', align: 'right', render: (value: number) => currencyFormatter.usd(value) },
  { key: 'date', label: 'Date', render: (value: string) => dateFormatter.short(value) },
  {
    key: 'status',
    label: 'Status',
    render: (value: OrderStatus) => <Chip label={getOrderStatusLabel(value)} color={getOrderStatusColor(value)} size="small" />,
  },
];

const CSV_COLUMNS: CsvColumn<OrdersReportRow>[] = [
  { key: 'orderNumber', label: 'Order Number' },
  { key: 'customerName', label: 'Customer' },
  { key: 'itemCount', label: 'Items' },
  { key: 'totalAmount', label: 'Amount', format: (value) => Number(value).toFixed(2) },
  { key: 'date', label: 'Date', format: (value) => dateFormatter.iso(value as string) },
  { key: 'status', label: 'Status' },
];

export const OrdersReportView = () => (
  <ReportView<OrdersReportRow>
    useData={useOrdersReportData}
    columns={COLUMNS}
    statusOptions={STATUS_OPTIONS}
    csvColumns={CSV_COLUMNS}
    filename="orders-report.csv"
    chartTitle="Orders Trend"
    chartColor="#1976d2"
    seriesLabel="Orders ($)"
    totalLabel="Total Orders"
    errorMessage="Failed to load the orders report."
    emptyMessage="No orders in this range."
  />
);
