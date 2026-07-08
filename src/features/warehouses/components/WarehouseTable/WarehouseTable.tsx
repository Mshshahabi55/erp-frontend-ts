import { Typography, Chip, IconButton } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { DataTable, Column } from '@/shared/components';
import { numberFormatter } from '@/shared/utils';
import type { Warehouse, WarehouseSortField } from '../../types/warehouse.types';

interface WarehouseTableProps {
  warehouses: Warehouse[];
  isLoading: boolean;
  error: Error | null;
  totalCount: number;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  onRetry: () => void;
  sortBy?: WarehouseSortField;
  sortDirection?: 'asc' | 'desc';
  onSortChange: (field: WarehouseSortField) => void;
  onEdit: (warehouse: Warehouse) => void;
  onDelete: (warehouse: Warehouse) => void;
  isDeleting: boolean;
}

export const WarehouseTable = ({
  warehouses,
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
  onEdit,
  onDelete,
  isDeleting,
}: WarehouseTableProps) => {
  const columns: Column<Warehouse>[] = [
    {
      key: 'name',
      label: 'Name',
      sortable: true,
      render: (value: string) => <Typography sx={{ fontWeight: 500 }}>{value}</Typography>,
    },
    { key: 'code', label: 'Code', sortable: true },
    {
      key: 'city',
      label: 'Location',
      sortable: true,
      render: (_, row) => `${row.city}, ${row.state}`,
    },
    { key: 'managerName', label: 'Manager' },
    {
      key: 'capacity',
      label: 'Capacity',
      sortable: true,
      align: 'right',
      render: (value: number) => numberFormatter.integer(value),
    },
    {
      key: 'isActive',
      label: 'Status',
      render: (value: boolean) => (
        <Chip label={value ? 'Active' : 'Inactive'} color={value ? 'success' : 'default'} size="small" />
      ),
    },
    {
      key: 'id',
      label: 'Actions',
      align: 'right',
      render: (_, row) => (
        <>
          <IconButton
            size="small"
            color="primary"
            onClick={() => onEdit(row)}
            title="Edit"
            aria-label={`Edit ${row.name}`}
          >
            <Edit />
          </IconButton>
          <IconButton
            size="small"
            color="error"
            onClick={() => onDelete(row)}
            disabled={isDeleting}
            title="Delete"
            aria-label={`Delete ${row.name}`}
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
      data={warehouses}
      loading={isLoading}
      error={error}
      totalCount={totalCount}
      page={page}
      pageSize={pageSize}
      onPageChange={onPageChange}
      onPageSizeChange={onPageSizeChange}
      onRetry={onRetry}
      emptyMessage="No warehouses found. Create your first warehouse!"
      sortBy={sortBy}
      sortDirection={sortDirection}
      onSortChange={(field) => onSortChange(field as WarehouseSortField)}
    />
  );
};
