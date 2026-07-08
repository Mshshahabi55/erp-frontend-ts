import { useQuery } from '@tanstack/react-query';
import { createQueryKeyFactory } from '@/shared/query';
import { stockMovementService } from '../services/stockMovementService';
import type { StockMovementQueryParams } from '../types/stockMovement.types';

export const stockMovementKeys = createQueryKeyFactory<StockMovementQueryParams>('stockMovements');

export const useStockMovements = (params?: StockMovementQueryParams) => {
  return useQuery({
    queryKey: stockMovementKeys.list(params),
    queryFn: () => stockMovementService.getAll(params),
  });
};
