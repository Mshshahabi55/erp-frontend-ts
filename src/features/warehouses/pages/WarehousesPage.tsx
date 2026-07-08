import { useState } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Add } from '@mui/icons-material';
import { useDebounce } from '@/shared/hooks';
import { WarehouseFilters, ALL_WAREHOUSE_STATUSES, type WarehouseStatusFilter } from '../components/WarehouseFilters/WarehouseFilters';
import { WarehouseTable } from '../components/WarehouseTable/WarehouseTable';
import { WarehouseFormDialog } from '../components/WarehouseFormDialog/WarehouseFormDialog';
import { WarehouseDeleteDialog } from '../components/WarehouseDeleteDialog/WarehouseDeleteDialog';
import { useWarehouses } from '../hooks/useWarehouses';
import { useCreateWarehouse, useUpdateWarehouse, useDeleteWarehouse } from '../hooks/useWarehouseMutations';
import type { Warehouse, WarehouseSortField } from '../types/warehouse.types';
import type { WarehouseFormData } from '../types/warehouse.schema';

export const WarehousesPage = () => {
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [searchInput, setSearchInput] = useState('');
  const [statusFilter, setStatusFilter] = useState<WarehouseStatusFilter>(ALL_WAREHOUSE_STATUSES);
  const [sortBy, setSortBy] = useState<WarehouseSortField>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [selectedWarehouse, setSelectedWarehouse] = useState<Warehouse | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const debouncedSearch = useDebounce(searchInput, 500);

  const { data: response, isLoading, error, refetch } = useWarehouses({
    page: page + 1,
    limit: pageSize,
    search: debouncedSearch || undefined,
    isActive: statusFilter === ALL_WAREHOUSE_STATUSES ? undefined : statusFilter === 'active',
    sortBy,
    sortDirection,
  });

  const warehouses = response?.data ?? [];
  const totalCount = response?.total ?? 0;

  const createMutation = useCreateWarehouse();
  const updateMutation = useUpdateWarehouse();
  const deleteMutation = useDeleteWarehouse();

  const handleCreate = () => {
    setSelectedWarehouse(null);
    setIsFormOpen(true);
  };

  const handleEdit = (warehouse: Warehouse) => {
    setSelectedWarehouse(warehouse);
    setIsFormOpen(true);
  };

  const handleDelete = (warehouse: Warehouse) => {
    setSelectedWarehouse(warehouse);
    setIsDeleteOpen(true);
  };

  const handleSortChange = (field: WarehouseSortField) => {
    if (sortBy === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(field);
      setSortDirection('asc');
    }
  };

  const handleStatusFilterChange = (value: WarehouseStatusFilter) => {
    setStatusFilter(value);
    setPage(0);
  };

  const handleFormSubmit = async (data: WarehouseFormData) => {
    if (selectedWarehouse) {
      await updateMutation.mutateAsync({ id: selectedWarehouse.id, data });
    } else {
      await createMutation.mutateAsync(data);
    }
    setIsFormOpen(false);
    setSelectedWarehouse(null);
  };

  const handleConfirmDelete = async () => {
    if (selectedWarehouse) {
      await deleteMutation.mutateAsync(selectedWarehouse.id);
      setIsDeleteOpen(false);
      setSelectedWarehouse(null);
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
          Warehouses
        </Typography>
        <Button variant="contained" startIcon={<Add />} onClick={handleCreate}>
          Add Warehouse
        </Button>
      </Box>

      <WarehouseFilters
        searchValue={searchInput}
        onSearchChange={setSearchInput}
        onSearchClear={() => setSearchInput('')}
        statusFilter={statusFilter}
        onStatusFilterChange={handleStatusFilterChange}
      />

      <WarehouseTable
        warehouses={warehouses}
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
        onEdit={handleEdit}
        onDelete={handleDelete}
        isDeleting={deleteMutation.isPending}
      />

      <WarehouseFormDialog
        open={isFormOpen}
        warehouse={selectedWarehouse}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
        onSubmit={handleFormSubmit}
        onClose={() => setIsFormOpen(false)}
      />

      <WarehouseDeleteDialog
        open={isDeleteOpen}
        warehouse={selectedWarehouse}
        isDeleting={deleteMutation.isPending}
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsDeleteOpen(false)}
      />
    </Box>
  );
};

export default WarehousesPage;
