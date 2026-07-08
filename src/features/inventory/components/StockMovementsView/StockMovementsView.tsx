import { useMemo, useState } from 'react';
import { Box, Button } from '@mui/material';
import { Add } from '@mui/icons-material';
import { useProducts } from '@/features/products/hooks/useProducts';
import { useStockMovements } from '../../hooks/useStockMovements';
import { useCreateStockMovement } from '../../hooks/useStockMovementMutations';
import { StockMovementTable } from '../StockMovementTable/StockMovementTable';
import { StockMovementFormDialog } from '../StockMovementFormDialog/StockMovementFormDialog';
import type { StockMovementSortField } from '../../types/stockMovement.types';
import type { StockMovementFormData } from '../../types/stockMovement.schema';
import { useAuth } from '@/features/auth/hooks/useAuth';

export const StockMovementsView = () => {
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [sortBy, setSortBy] = useState<StockMovementSortField>('movementDate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [isFormOpen, setIsFormOpen] = useState(false);

  const { user } = useAuth();

  const { data: response, isLoading, error, refetch } = useStockMovements({
    page: page + 1,
    limit: pageSize,
    sortBy,
    sortDirection,
  });

  const { data: productsResponse } = useProducts({ limit: 100 });
  const productNameById = useMemo(
    () => new Map((productsResponse?.data ?? []).map((product) => [product.id, product.name])),
    [productsResponse]
  );

  const createMutation = useCreateStockMovement();

  const movements = response?.data ?? [];
  const totalCount = response?.total ?? 0;

  const handleSortChange = (field: StockMovementSortField) => {
    if (sortBy === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(field);
      setSortDirection('asc');
    }
  };

  const handleFormSubmit = async (data: StockMovementFormData) => {
    await createMutation.mutateAsync({
      ...data,
      performedBy: user?.fullName ?? 'Unknown user',
    });
    setIsFormOpen(false);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
        <Button variant="contained" startIcon={<Add />} onClick={() => setIsFormOpen(true)}>
          Record Movement
        </Button>
      </Box>

      <StockMovementTable
        movements={movements}
        productNameById={productNameById}
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

      <StockMovementFormDialog
        open={isFormOpen}
        isSubmitting={createMutation.isPending}
        onSubmit={handleFormSubmit}
        onClose={() => setIsFormOpen(false)}
      />
    </Box>
  );
};
