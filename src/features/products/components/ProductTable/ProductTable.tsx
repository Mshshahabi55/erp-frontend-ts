import { Typography, Chip, IconButton } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { DataTable, Column } from '@/shared/components';
import { currencyFormatter } from '@/shared/utils';
import type { Product, ProductSortField } from '../../types/product.types';

interface ProductTableProps {
  products: Product[];
  isLoading: boolean;
  error: Error | null;
  totalCount: number;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  onRetry: () => void;
  sortBy?: ProductSortField;
  sortDirection?: 'asc' | 'desc';
  onSortChange: (field: ProductSortField) => void;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
  isDeleting: boolean;
}

export const ProductTable = ({
  products,
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
}: ProductTableProps) => {
  const columns: Column<Product>[] = [
    {
      key: 'name',
      label: 'Name',
      sortable: true,
      render: (value: string) => <Typography sx={{ fontWeight: 500 }}>{value}</Typography>,
    },
    { key: 'sku', label: 'SKU', sortable: true },
    { key: 'category', label: 'Category', sortable: true },
    {
      key: 'price',
      label: 'Price',
      sortable: true,
      render: (value: number) => currencyFormatter.usd(value),
    },
    {
      key: 'stock',
      label: 'Stock',
      sortable: true,
      render: (value: number) => (
        <Chip label={value > 0 ? `${value}` : 'Out of Stock'} color={value > 0 ? 'info' : 'error'} size="small" />
      ),
    },
    {
      key: 'isAvailable',
      label: 'Status',
      render: (value: boolean) => (
        <Chip label={value ? 'Available' : 'Unavailable'} color={value ? 'success' : 'default'} size="small" />
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
      data={products}
      loading={isLoading}
      error={error}
      totalCount={totalCount}
      page={page}
      pageSize={pageSize}
      onPageChange={onPageChange}
      onPageSizeChange={onPageSizeChange}
      onRetry={onRetry}
      emptyMessage="No products found. Create your first product!"
      sortBy={sortBy}
      sortDirection={sortDirection}
      onSortChange={(field) => onSortChange(field as ProductSortField)}
    />
  );
};
