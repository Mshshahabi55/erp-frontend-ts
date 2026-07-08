import { Chip } from '@mui/material';
import { DataTable, Column } from '@/shared/components';
import { dateFormatter } from '@/shared/utils';
import type { StockMovement, StockMovementSortField, StockMovementType } from '../../types/stockMovement.types';

interface StockMovementTableProps {
  movements: StockMovement[];
  productNameById: Map<string, string>;
  isLoading: boolean;
  error: Error | null;
  totalCount: number;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  onRetry: () => void;
  sortBy?: StockMovementSortField;
  sortDirection?: 'asc' | 'desc';
  onSortChange: (field: StockMovementSortField) => void;
}

const typeLabels: Record<StockMovementType, string> = {
  in: 'Stock In',
  out: 'Stock Out',
  adjustment: 'Adjustment',
};

const typeColors: Record<StockMovementType, 'success' | 'error' | 'info'> = {
  in: 'success',
  out: 'error',
  adjustment: 'info',
};

export const StockMovementTable = ({
  movements,
  productNameById,
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
}: StockMovementTableProps) => {
  const columns: Column<StockMovement>[] = [
    {
      key: 'movementDate',
      label: 'Date',
      sortable: true,
      render: (value: string) => dateFormatter.short(value),
    },
    {
      key: 'productId',
      label: 'Product',
      render: (value: string) => productNameById.get(value) ?? 'Unknown product',
    },
    {
      key: 'type',
      label: 'Type',
      sortable: true,
      render: (value: StockMovementType) => <Chip label={typeLabels[value]} color={typeColors[value]} size="small" />,
    },
    { key: 'quantity', label: 'Quantity', sortable: true, align: 'right' },
    { key: 'reason', label: 'Reason' },
    { key: 'performedBy', label: 'Performed By' },
  ];

  return (
    <DataTable
      columns={columns}
      data={movements}
      loading={isLoading}
      error={error}
      totalCount={totalCount}
      page={page}
      pageSize={pageSize}
      onPageChange={onPageChange}
      onPageSizeChange={onPageSizeChange}
      onRetry={onRetry}
      emptyMessage="No stock movements recorded yet."
      sortBy={sortBy}
      sortDirection={sortDirection}
      onSortChange={(field) => onSortChange(field as StockMovementSortField)}
    />
  );
};
