import { useState } from 'react';
import { Box, MenuItem, Select, SelectChangeEvent, FormControl, InputLabel } from '@mui/material';
import { SearchBar } from '@/shared/components';
import { useDebounce } from '@/shared/hooks';
import { useProducts } from '@/features/products/hooks/useProducts';
import type { ProductSortField, StockStatus } from '@/features/products/types/product.types';
import { StockListTable } from '../StockListTable/StockListTable';

const ALL_STATUSES = 'all';
type StatusFilter = StockStatus | typeof ALL_STATUSES;

export const StockListView = () => {
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [searchInput, setSearchInput] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>(ALL_STATUSES);
  const [sortBy, setSortBy] = useState<ProductSortField>('stock');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const debouncedSearch = useDebounce(searchInput, 500);

  const { data: response, isLoading, error, refetch } = useProducts({
    page: page + 1,
    limit: pageSize,
    search: debouncedSearch || undefined,
    stockStatus: statusFilter === ALL_STATUSES ? undefined : statusFilter,
    sortBy,
    sortDirection,
  });

  const products = response?.data ?? [];
  const totalCount = response?.total ?? 0;

  const handleSortChange = (field: ProductSortField) => {
    if (sortBy === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(field);
      setSortDirection('asc');
    }
  };

  const handleStatusFilterChange = (event: SelectChangeEvent<StatusFilter>) => {
    setStatusFilter(event.target.value as StatusFilter);
    setPage(0);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <Box sx={{ flexGrow: 1, minWidth: 240 }}>
          <SearchBar
            value={searchInput}
            onChange={setSearchInput}
            onClear={() => setSearchInput('')}
            placeholder="Search by name or SKU..."
          />
        </Box>
        <FormControl size="small" sx={{ minWidth: 180 }}>
          <InputLabel id="stock-status-filter-label">Stock status</InputLabel>
          <Select
            labelId="stock-status-filter-label"
            label="Stock status"
            value={statusFilter}
            onChange={handleStatusFilterChange}
          >
            <MenuItem value={ALL_STATUSES}>All stock levels</MenuItem>
            <MenuItem value="in-stock">In Stock</MenuItem>
            <MenuItem value="low-stock">Low Stock</MenuItem>
            <MenuItem value="out-of-stock">Out of Stock</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <StockListTable
        products={products}
        isLoading={isLoading}
        error={error}
        totalCount={totalCount}
        page={page}
        pageSize={pageSize}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
        onRetry={refetch}
        sortBy={sortBy}
        sortDirection={sortDirection}
        onSortChange={handleSortChange}
      />
    </Box>
  );
};
