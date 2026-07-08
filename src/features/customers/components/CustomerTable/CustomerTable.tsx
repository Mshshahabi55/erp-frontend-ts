import { Typography, Chip, IconButton } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { DataTable, Column } from '@/shared/components';
import type { Customer, CustomerSortField } from '../../types/customer.types';

interface CustomerTableProps {
  customers: Customer[];
  isLoading: boolean;
  error: Error | null;
  totalCount: number;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  onRetry: () => void;
  sortBy?: CustomerSortField;
  sortDirection?: 'asc' | 'desc';
  onSortChange: (field: CustomerSortField) => void;
  onEdit: (customer: Customer) => void;
  onDelete: (customer: Customer) => void;
  isDeleting: boolean;
}

export const CustomerTable = ({
  customers,
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
}: CustomerTableProps) => {
  const columns: Column<Customer>[] = [
    {
      key: 'name',
      label: 'Name',
      sortable: true,
      render: (value: string) => <Typography sx={{ fontWeight: 500 }}>{value}</Typography>,
    },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'phone', label: 'Phone' },
    {
      key: 'company',
      label: 'Company',
      sortable: true,
      render: (value: string) => value || '-',
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
      data={customers}
      loading={isLoading}
      error={error}
      totalCount={totalCount}
      page={page}
      pageSize={pageSize}
      onPageChange={onPageChange}
      onPageSizeChange={onPageSizeChange}
      onRetry={onRetry}
      emptyMessage="No customers found. Create your first customer!"
      sortBy={sortBy}
      sortDirection={sortDirection}
      onSortChange={(field) => onSortChange(field as CustomerSortField)}
    />
  );
};
