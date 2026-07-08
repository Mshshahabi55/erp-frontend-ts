import { useState } from 'react';
import { Box, Typography, Button, MenuItem, Select, SelectChangeEvent, FormControl, InputLabel } from '@mui/material';
import { Add } from '@mui/icons-material';
import { SearchBar } from '@/shared/components';
import { useDebounce } from '@/shared/hooks';
import { CustomerTable } from '../components/CustomerTable/CustomerTable';
import { CustomerFormDialog } from '../components/CustomerFormDialog/CustomerFormDialog';
import { CustomerDeleteDialog } from '../components/CustomerDeleteDialog/CustomerDeleteDialog';
import { useCustomers } from '../hooks/useCustomers';
import { useCreateCustomer, useUpdateCustomer, useDeleteCustomer } from '../hooks/useCustomerMutations';
import type { Customer, CustomerSortField } from '../types/customer.types';
import type { CustomerFormData } from '../types/customer.schema';

type StatusFilter = 'all' | 'active' | 'inactive';

export const CustomersPage = () => {
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [searchInput, setSearchInput] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [sortBy, setSortBy] = useState<CustomerSortField>();
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const debouncedSearch = useDebounce(searchInput, 500);

  const { data: response, isLoading, error, refetch } = useCustomers({
    page: page + 1,
    limit: pageSize,
    search: debouncedSearch || undefined,
    isActive: statusFilter === 'all' ? undefined : statusFilter === 'active',
    sortBy,
    sortDirection,
  });

  const customers = response?.data ?? [];
  const totalCount = response?.total ?? 0;

  const createMutation = useCreateCustomer();
  const updateMutation = useUpdateCustomer();
  const deleteMutation = useDeleteCustomer();

  const handleCreate = () => {
    setSelectedCustomer(null);
    setIsFormOpen(true);
  };

  const handleEdit = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsFormOpen(true);
  };

  const handleDelete = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsDeleteOpen(true);
  };

  const handleSortChange = (field: CustomerSortField) => {
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

  const handleFormSubmit = async (data: CustomerFormData) => {
    if (selectedCustomer) {
      await updateMutation.mutateAsync({ id: selectedCustomer.id, data });
    } else {
      await createMutation.mutateAsync(data);
    }
    setIsFormOpen(false);
    setSelectedCustomer(null);
  };

  const handleConfirmDelete = async () => {
    if (selectedCustomer) {
      await deleteMutation.mutateAsync(selectedCustomer.id);
      setIsDeleteOpen(false);
      setSelectedCustomer(null);
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
          Customers
        </Typography>
        <Button variant="contained" startIcon={<Add />} onClick={handleCreate}>
          Add Customer
        </Button>
      </Box>

      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <Box sx={{ flexGrow: 1, minWidth: 240 }}>
          <SearchBar
            value={searchInput}
            onChange={setSearchInput}
            onClear={() => setSearchInput('')}
            placeholder="Search by name, email, or company..."
          />
        </Box>
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel id="customer-status-filter-label">Status</InputLabel>
          <Select
            labelId="customer-status-filter-label"
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

      <CustomerTable
        customers={customers}
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

      <CustomerFormDialog
        open={isFormOpen}
        customer={selectedCustomer}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
        onSubmit={handleFormSubmit}
        onClose={() => setIsFormOpen(false)}
      />

      <CustomerDeleteDialog
        open={isDeleteOpen}
        customer={selectedCustomer}
        isDeleting={deleteMutation.isPending}
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsDeleteOpen(false)}
      />
    </Box>
  );
};

export default CustomersPage;
