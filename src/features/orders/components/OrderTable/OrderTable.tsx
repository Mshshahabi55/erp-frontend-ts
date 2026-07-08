import { Typography, Chip, IconButton } from '@mui/material';
import { Visibility, Edit, Delete, Sync } from '@mui/icons-material';
import { DataTable, Column } from '@/shared/components';
import { currencyFormatter, dateFormatter } from '@/shared/utils';
import { getOrderStatusColor, getOrderStatusLabel } from '../../utils/orderStatusStyles';
import { isTerminalStatus } from '../../utils/orderStatusTransitions';
import type { Order, OrderSortField, OrderStatus } from '../../types/order.types';

interface OrderTableProps {
  orders: Order[];
  customerNameById: Map<string, string>;
  isLoading: boolean;
  error: Error | null;
  totalCount: number;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  onRetry: () => void;
  sortBy?: OrderSortField;
  sortDirection?: 'asc' | 'desc';
  onSortChange: (field: OrderSortField) => void;
  onView: (order: Order) => void;
  onEdit: (order: Order) => void;
  onChangeStatus: (order: Order) => void;
  onDelete: (order: Order) => void;
  isDeleting: boolean;
}

export const OrderTable = ({
  orders,
  customerNameById,
  isLoading,
  error,
  totalCount,
  page,
  pageSize,
  onPageChange,
  onPageSizeChange,
  onRetry,
  sortBy,
  sortDirection,
  onSortChange,
  onView,
  onEdit,
  onChangeStatus,
  onDelete,
  isDeleting,
}: OrderTableProps) => {
  const columns: Column<Order>[] = [
    {
      key: 'orderNumber',
      label: 'Order #',
      sortable: true,
      render: (value: string) => <Typography sx={{ fontWeight: 500 }}>{value}</Typography>,
    },
    {
      key: 'customerId',
      label: 'Customer',
      render: (value: string) => customerNameById.get(value) ?? 'Unknown customer',
    },
    {
      key: 'totalAmount',
      label: 'Total',
      sortable: true,
      align: 'right',
      render: (value: number) => currencyFormatter.usd(value),
    },
    {
      key: 'orderDate',
      label: 'Date',
      sortable: true,
      render: (value: string) => dateFormatter.short(value),
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (value: OrderStatus) => <Chip label={getOrderStatusLabel(value)} color={getOrderStatusColor(value)} size="small" />,
    },
    {
      key: 'id',
      label: 'Actions',
      align: 'right',
      render: (_, row) => (
        <>
          <IconButton size="small" onClick={() => onView(row)} title="View" aria-label={`View ${row.orderNumber}`}>
            <Visibility />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => onChangeStatus(row)}
            disabled={isTerminalStatus(row.status)}
            title="Change status"
            aria-label={`Change status of ${row.orderNumber}`}
          >
            <Sync />
          </IconButton>
          <IconButton
            size="small"
            color="primary"
            onClick={() => onEdit(row)}
            title="Edit"
            aria-label={`Edit ${row.orderNumber}`}
          >
            <Edit />
          </IconButton>
          <IconButton
            size="small"
            color="error"
            onClick={() => onDelete(row)}
            disabled={isDeleting}
            title="Delete"
            aria-label={`Delete ${row.orderNumber}`}
          >
            <Delete />
          </IconButton>
        </>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={orders}
      loading={isLoading}
      error={error}
      totalCount={totalCount}
      page={page}
      pageSize={pageSize}
      onPageChange={onPageChange}
      onPageSizeChange={onPageSizeChange}
      onRetry={onRetry}
      emptyMessage="No orders found. Create your first order!"
      sortBy={sortBy}
      sortDirection={sortDirection}
      onSortChange={(field) => onSortChange(field as OrderSortField)}
    />
  );
};
