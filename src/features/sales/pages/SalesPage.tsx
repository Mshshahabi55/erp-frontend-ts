import { useMemo, useState } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Add } from '@mui/icons-material';
import { useDebounce } from '@/shared/hooks';
import { useCustomers } from '@/features/customers/hooks/useCustomers';
import { SaleFilters, ALL_SALE_STATUSES, ALL_SALE_CUSTOMERS, type SaleStatusFilter } from '../components/SaleFilters/SaleFilters';
import { SaleTable } from '../components/SaleTable/SaleTable';
import { SaleFormDialog } from '../components/SaleFormDialog/SaleFormDialog';
import { SaleInvoiceDialog } from '../components/SaleInvoiceDialog/SaleInvoiceDialog';
import { SaleDeleteDialog } from '../components/SaleDeleteDialog/SaleDeleteDialog';
import { useSales } from '../hooks/useSales';
import { useCreateSale, useUpdateSale, useDeleteSale } from '../hooks/useSaleMutations';
import type { Sale, SaleSortField } from '../types/sale.types';
import type { SaleFormData } from '../types/sale.schema';

export const SalesPage = () => {
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [searchInput, setSearchInput] = useState('');
  const [statusFilter, setStatusFilter] = useState<SaleStatusFilter>(ALL_SALE_STATUSES);
  const [customerFilter, setCustomerFilter] = useState(ALL_SALE_CUSTOMERS);
  const [sortBy, setSortBy] = useState<SaleSortField>('saleDate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const debouncedSearch = useDebounce(searchInput, 500);

  const { data: customersResponse } = useCustomers({ limit: 100 });
  const customers = useMemo(() => customersResponse?.data ?? [], [customersResponse]);
  const customerNameById = useMemo(
    () => new Map(customers.map((customer) => [customer.id, customer.name])),
    [customers]
  );

  const { data: response, isLoading, error, refetch } = useSales({
    page: page + 1,
    limit: pageSize,
    search: debouncedSearch || undefined,
    status: statusFilter === ALL_SALE_STATUSES ? undefined : statusFilter,
    customerId: customerFilter === ALL_SALE_CUSTOMERS ? undefined : customerFilter,
    sortBy,
    sortDirection,
  });

  const sales = response?.data ?? [];
  const totalCount = response?.total ?? 0;

  const createMutation = useCreateSale();
  const updateMutation = useUpdateSale();
  const deleteMutation = useDeleteSale();

  const handleCreate = () => {
    setSelectedSale(null);
    setIsFormOpen(true);
  };

  const handleView = (sale: Sale) => {
    setSelectedSale(sale);
    setIsInvoiceOpen(true);
  };

  const handleEdit = (sale: Sale) => {
    setSelectedSale(sale);
    setIsFormOpen(true);
  };

  const handleDelete = (sale: Sale) => {
    setSelectedSale(sale);
    setIsDeleteOpen(true);
  };

  const handleSortChange = (field: SaleSortField) => {
    if (sortBy === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(field);
      setSortDirection('asc');
    }
  };

  const handleStatusFilterChange = (value: SaleStatusFilter) => {
    setStatusFilter(value);
    setPage(0);
  };

  const handleCustomerFilterChange = (value: string) => {
    setCustomerFilter(value);
    setPage(0);
  };

  const handleFormSubmit = async (data: SaleFormData) => {
    if (selectedSale) {
      await updateMutation.mutateAsync({ id: selectedSale.id, data });
    } else {
      await createMutation.mutateAsync(data);
    }
    setIsFormOpen(false);
    setSelectedSale(null);
  };

  const handleConfirmDelete = async () => {
    if (selectedSale) {
      await deleteMutation.mutateAsync(selectedSale.id);
      setIsDeleteOpen(false);
      setSelectedSale(null);
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
          Sales
        </Typography>
        <Button variant="contained" startIcon={<Add />} onClick={handleCreate}>
          Add Sale
        </Button>
      </Box>

      <SaleFilters
        searchValue={searchInput}
        onSearchChange={setSearchInput}
        onSearchClear={() => setSearchInput('')}
        customers={customers}
        customerFilter={customerFilter}
        onCustomerFilterChange={handleCustomerFilterChange}
        statusFilter={statusFilter}
        onStatusFilterChange={handleStatusFilterChange}
      />

      <SaleTable
        sales={sales}
        customerNameById={customerNameById}
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
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isDeleting={deleteMutation.isPending}
      />

      <SaleFormDialog
        open={isFormOpen}
        sale={selectedSale}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
        onSubmit={handleFormSubmit}
        onClose={() => setIsFormOpen(false)}
      />

      <SaleInvoiceDialog
        open={isInvoiceOpen}
        sale={selectedSale}
        customerName={selectedSale ? customerNameById.get(selectedSale.customerId) ?? 'Unknown customer' : ''}
        onClose={() => setIsInvoiceOpen(false)}
      />

      <SaleDeleteDialog
        open={isDeleteOpen}
        sale={selectedSale}
        isDeleting={deleteMutation.isPending}
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsDeleteOpen(false)}
      />
    </Box>
  );
};

export default SalesPage;
