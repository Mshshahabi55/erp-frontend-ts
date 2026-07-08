import { useMemo, useState } from 'react';
import { Box, Typography, Button, MenuItem, Select, SelectChangeEvent, FormControl, InputLabel } from '@mui/material';
import { Add } from '@mui/icons-material';
import { SearchBar } from '@/shared/components';
import { useDebounce } from '@/shared/hooks';
import { useSuppliers } from '@/features/suppliers/hooks/useSuppliers';
import { PurchaseTable } from '../components/PurchaseTable/PurchaseTable';
import { PurchaseFormDialog } from '../components/PurchaseFormDialog/PurchaseFormDialog';
import { PurchaseDetailsDialog } from '../components/PurchaseDetailsDialog/PurchaseDetailsDialog';
import { PurchaseDeleteDialog } from '../components/PurchaseDeleteDialog/PurchaseDeleteDialog';
import { usePurchases } from '../hooks/usePurchases';
import { useCreatePurchase, useUpdatePurchase, useDeletePurchase } from '../hooks/usePurchaseMutations';
import type { Purchase, PurchaseSortField, PurchaseStatus } from '../types/purchase.types';
import type { PurchaseFormData } from '../types/purchase.schema';

type StatusFilter = PurchaseStatus | 'all';
const ALL_STATUSES: StatusFilter = 'all';
const ALL_SUPPLIERS = 'all';

export const PurchasesPage = () => {
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [searchInput, setSearchInput] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>(ALL_STATUSES);
  const [supplierFilter, setSupplierFilter] = useState(ALL_SUPPLIERS);
  const [sortBy, setSortBy] = useState<PurchaseSortField>('purchaseDate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [selectedPurchase, setSelectedPurchase] = useState<Purchase | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const debouncedSearch = useDebounce(searchInput, 500);

  const { data: suppliersResponse } = useSuppliers({ limit: 100 });
  const suppliers = useMemo(() => suppliersResponse?.data ?? [], [suppliersResponse]);
  const supplierNameById = useMemo(
    () => new Map(suppliers.map((supplier) => [supplier.id, supplier.name])),
    [suppliers]
  );

  const { data: response, isLoading, error, refetch } = usePurchases({
    page: page + 1,
    limit: pageSize,
    search: debouncedSearch || undefined,
    status: statusFilter === ALL_STATUSES ? undefined : statusFilter,
    supplierId: supplierFilter === ALL_SUPPLIERS ? undefined : supplierFilter,
    sortBy,
    sortDirection,
  });

  const purchases = response?.data ?? [];
  const totalCount = response?.total ?? 0;

  const createMutation = useCreatePurchase();
  const updateMutation = useUpdatePurchase();
  const deleteMutation = useDeletePurchase();

  const handleCreate = () => {
    setSelectedPurchase(null);
    setIsFormOpen(true);
  };

  const handleView = (purchase: Purchase) => {
    setSelectedPurchase(purchase);
    setIsDetailsOpen(true);
  };

  const handleEdit = (purchase: Purchase) => {
    setSelectedPurchase(purchase);
    setIsFormOpen(true);
  };

  const handleDelete = (purchase: Purchase) => {
    setSelectedPurchase(purchase);
    setIsDeleteOpen(true);
  };

  const handleSortChange = (field: PurchaseSortField) => {
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

  const handleSupplierFilterChange = (event: SelectChangeEvent) => {
    setSupplierFilter(event.target.value);
    setPage(0);
  };

  const handleFormSubmit = async (data: PurchaseFormData) => {
    if (selectedPurchase) {
      await updateMutation.mutateAsync({ id: selectedPurchase.id, data });
    } else {
      await createMutation.mutateAsync(data);
    }
    setIsFormOpen(false);
    setSelectedPurchase(null);
  };

  const handleConfirmDelete = async () => {
    if (selectedPurchase) {
      await deleteMutation.mutateAsync(selectedPurchase.id);
      setIsDeleteOpen(false);
      setSelectedPurchase(null);
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
          Purchases
        </Typography>
        <Button variant="contained" startIcon={<Add />} onClick={handleCreate}>
          Add Purchase
        </Button>
      </Box>

      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <Box sx={{ flexGrow: 1, minWidth: 240 }}>
          <SearchBar
            value={searchInput}
            onChange={setSearchInput}
            onClear={() => setSearchInput('')}
            placeholder="Search by PO number..."
          />
        </Box>
        <FormControl size="small" sx={{ minWidth: 180 }}>
          <InputLabel id="purchase-supplier-filter-label">Supplier</InputLabel>
          <Select
            labelId="purchase-supplier-filter-label"
            label="Supplier"
            value={supplierFilter}
            onChange={handleSupplierFilterChange}
          >
            <MenuItem value={ALL_SUPPLIERS}>All suppliers</MenuItem>
            {suppliers.map((supplier) => (
              <MenuItem key={supplier.id} value={supplier.id}>
                {supplier.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel id="purchase-status-filter-label">Status</InputLabel>
          <Select
            labelId="purchase-status-filter-label"
            label="Status"
            value={statusFilter}
            onChange={handleStatusFilterChange}
          >
            <MenuItem value={ALL_STATUSES}>All statuses</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="received">Received</MenuItem>
            <MenuItem value="cancelled">Cancelled</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <PurchaseTable
        purchases={purchases}
        supplierNameById={supplierNameById}
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

      <PurchaseFormDialog
        open={isFormOpen}
        purchase={selectedPurchase}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
        onSubmit={handleFormSubmit}
        onClose={() => setIsFormOpen(false)}
      />

      <PurchaseDetailsDialog
        open={isDetailsOpen}
        purchase={selectedPurchase}
        supplierName={selectedPurchase ? supplierNameById.get(selectedPurchase.supplierId) ?? 'Unknown supplier' : ''}
        onClose={() => setIsDetailsOpen(false)}
      />

      <PurchaseDeleteDialog
        open={isDeleteOpen}
        purchase={selectedPurchase}
        isDeleting={deleteMutation.isPending}
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsDeleteOpen(false)}
      />
    </Box>
  );
};

export default PurchasesPage;
