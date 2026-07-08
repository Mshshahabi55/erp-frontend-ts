import { useState } from 'react';
import { Box, Typography, Button, MenuItem, Select, SelectChangeEvent, FormControl, InputLabel } from '@mui/material';
import { Add } from '@mui/icons-material';
import { SearchBar } from '@/shared/components';
import { useDebounce } from '@/shared/hooks';
import { SupplierTable } from '../components/SupplierTable/SupplierTable';
import { SupplierFormDialog } from '../components/SupplierFormDialog/SupplierFormDialog';
import { SupplierDeleteDialog } from '../components/SupplierDeleteDialog/SupplierDeleteDialog';
import { useSuppliers } from '../hooks/useSuppliers';
import { useCreateSupplier, useUpdateSupplier, useDeleteSupplier } from '../hooks/useSupplierMutations';
import type { Supplier, SupplierSortField } from '../types/supplier.types';
import type { SupplierFormData } from '../types/supplier.schema';

type StatusFilter = 'all' | 'active' | 'inactive';

export const SuppliersPage = () => {
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [searchInput, setSearchInput] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [sortBy, setSortBy] = useState<SupplierSortField>();
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const debouncedSearch = useDebounce(searchInput, 500);

  const { data: response, isLoading, error, refetch } = useSuppliers({
    page: page + 1,
    limit: pageSize,
    search: debouncedSearch || undefined,
    isActive: statusFilter === 'all' ? undefined : statusFilter === 'active',
    sortBy,
    sortDirection,
  });

  const suppliers = response?.data ?? [];
  const totalCount = response?.total ?? 0;

  const createMutation = useCreateSupplier();
  const updateMutation = useUpdateSupplier();
  const deleteMutation = useDeleteSupplier();

  const handleCreate = () => {
    setSelectedSupplier(null);
    setIsFormOpen(true);
  };

  const handleEdit = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setIsFormOpen(true);
  };

  const handleDelete = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setIsDeleteOpen(true);
  };

  const handleSortChange = (field: SupplierSortField) => {
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

  const handleFormSubmit = async (data: SupplierFormData) => {
    if (selectedSupplier) {
      await updateMutation.mutateAsync({ id: selectedSupplier.id, data });
    } else {
      await createMutation.mutateAsync(data);
    }
    setIsFormOpen(false);
    setSelectedSupplier(null);
  };

  const handleConfirmDelete = async () => {
    if (selectedSupplier) {
      await deleteMutation.mutateAsync(selectedSupplier.id);
      setIsDeleteOpen(false);
      setSelectedSupplier(null);
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
          Suppliers
        </Typography>
        <Button variant="contained" startIcon={<Add />} onClick={handleCreate}>
          Add Supplier
        </Button>
      </Box>

      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <Box sx={{ flexGrow: 1, minWidth: 240 }}>
          <SearchBar
            value={searchInput}
            onChange={setSearchInput}
            onClear={() => setSearchInput('')}
            placeholder="Search by company, contact, or email..."
          />
        </Box>
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel id="supplier-status-filter-label">Status</InputLabel>
          <Select
            labelId="supplier-status-filter-label"
            label="Status"
            value={statusFilter}
            onChange={handleStatusFilterChange}
          >
            <MenuItem value="all">All statuses</MenuItem>
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="inactive">Inactive</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <SupplierTable
        suppliers={suppliers}
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

      <SupplierFormDialog
        open={isFormOpen}
        supplier={selectedSupplier}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
        onSubmit={handleFormSubmit}
        onClose={() => setIsFormOpen(false)}
      />

      <SupplierDeleteDialog
        open={isDeleteOpen}
        supplier={selectedSupplier}
        isDeleting={deleteMutation.isPending}
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsDeleteOpen(false)}
      />
    </Box>
  );
};

export default SuppliersPage;
