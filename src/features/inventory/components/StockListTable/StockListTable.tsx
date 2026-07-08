import { Typography, Chip } from '@mui/material';
import { DataTable, Column } from '@/shared/components';
import { currencyFormatter } from '@/shared/utils';
import type { Product, ProductSortField } from '@/features/products/types/product.types';
import { getStockStatus, stockStatusLabels, stockStatusColors } from '../../utils/stockStatus';

interface StockListTableProps {
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
}

export const StockListTable = ({
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
}: StockListTableProps) => {
  const columns: Column<Product>[] = [
    {
      key: 'name',
      label: 'Product',
      sortable: true,
      render: (value: string) => <Typography sx={{ fontWeight: 500 }}>{value}</Typography>,
    },
    { key: 'sku', label: 'SKU', sortable: true },
    { key: 'category', label: 'Category', sortable: true },
    { key: 'stock', label: 'Stock', sortable: true, align: 'right' },
    {
      key: 'price',
      label: 'Stock Value',
      align: 'right',
      render: (_: number, row: Product) => currencyFormatter.usd(row.price * row.stock),
    },
    {
      key: 'stockStatus',
      label: 'Status',
      render: (_: unknown, row: Product) => {
        const status = getStockStatus(row.stock);
        return <Chip label={stockStatusLabels[status]} color={stockStatusColors[status]} size="small" />;
      },
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
      emptyMessage="No products match this stock view."
      sortBy={sortBy}
      sortDirection={sortDirection}
      onSortChange={(field) => onSortChange(field as ProductSortField)}
    />
  );
};
