import { Typography, Chip, IconButton } from '@mui/material';
import { Visibility, Edit, Delete } from '@mui/icons-material';
import { DataTable, Column } from '@/shared/components';
import { currencyFormatter, dateFormatter } from '@/shared/utils';
import { getSaleStatusColor, getSaleStatusLabel } from '../../utils/saleStatusStyles';
import type { Sale, SaleSortField, SaleStatus } from '../../types/sale.types';

interface SaleTableProps {
  sales: Sale[];
  customerNameById: Map<string, string>;
  isLoading: boolean;
  error: Error | null;
  totalCount: number;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  onRetry: () => void;
  sortBy?: SaleSortField;
  sortDirection?: 'asc' | 'desc';
  onSortChange: (field: SaleSortField) => void;
  onView: (sale: Sale) => void;
  onEdit: (sale: Sale) => void;
  onDelete: (sale: Sale) => void;
  isDeleting: boolean;
}

export const SaleTable = ({
  sales,
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
  onDelete,
  isDeleting,
}: SaleTableProps) => {
  const columns: Column<Sale>[] = [
    {
      key: 'invoiceNumber',
      label: 'Invoice',
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
      label: 'Amount',
      sortable: true,
      align: 'right',
      render: (value: number) => currencyFormatter.usd(value),
    },
    {
      key: 'saleDate',
      label: 'Date',
      sortable: true,
      render: (value: string) => dateFormatter.short(value),
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (value: SaleStatus) => <Chip label={getSaleStatusLabel(value)} color={getSaleStatusColor(value)} size="small" />,
    },
    {
      key: 'id',
      label: 'Actions',
      align: 'right',
      render: (_, row) => (
        <>
          <IconButton size="small" onClick={() => onView(row)} title="View invoice" aria-label={`View invoice ${row.invoiceNumber}`}>
            <Visibility />
          </IconButton>
          <IconButton
            size="small"
            color="primary"
            onClick={() => onEdit(row)}
            title="Edit"
            aria-label={`Edit ${row.invoiceNumber}`}
          >
            <Edit />
          </IconButton>
          <IconButton
            size="small"
            color="error"
            onClick={() => onDelete(row)}
            disabled={isDeleting}
            title="Delete"
            aria-label={`Delete ${row.invoiceNumber}`}
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
      data={sales}
      loading={isLoading}
      error={error}
      totalCount={totalCount}
      page={page}
      pageSize={pageSize}
      onPageChange={onPageChange}
      onPageSizeChange={onPageSizeChange}
      onRetry={onRetry}
      emptyMessage="No sales found. Create your first sale!"
      sortBy={sortBy}
      sortDirection={sortDirection}
      onSortChange={(field) => onSortChange(field as SaleSortField)}
    />
  );
};
