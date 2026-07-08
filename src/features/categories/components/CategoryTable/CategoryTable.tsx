import { Typography, Chip, IconButton } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { DataTable, Column } from '@/shared/components';
import type { Category, CategorySortField } from '../../types/category.types';

interface CategoryTableProps {
  categories: Category[];
  isLoading: boolean;
  error: Error | null;
  totalCount: number;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  onRetry: () => void;
  sortBy?: CategorySortField;
  sortDirection?: 'asc' | 'desc';
  onSortChange: (field: CategorySortField) => void;
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
  isDeleting: boolean;
}

export const CategoryTable = ({
  categories,
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
}: CategoryTableProps) => {
  const columns: Column<Category>[] = [
    {
      key: 'name',
      label: 'Name',
      sortable: true,
      render: (value: string) => <Typography sx={{ fontWeight: 500 }}>{value}</Typography>,
    },
    {
      key: 'description',
      label: 'Description',
      render: (value: string | undefined) => value || '—',
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
      data={categories}
      loading={isLoading}
      error={error}
      totalCount={totalCount}
      page={page}
      pageSize={pageSize}
      onPageChange={onPageChange}
      onPageSizeChange={onPageSizeChange}
      onRetry={onRetry}
      emptyMessage="No categories found. Create your first category!"
      sortBy={sortBy}
      sortDirection={sortDirection}
      onSortChange={(field) => onSortChange(field as CategorySortField)}
    />
  );
};
