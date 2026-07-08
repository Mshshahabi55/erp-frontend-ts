import { useQuery } from '@tanstack/react-query';
import { createQueryKeyFactory } from '@/shared/query';
import { purchaseService } from '../services/purchaseService';
import type { PurchaseQueryParams } from '../types/purchase.types';

export const purchaseKeys = createQueryKeyFactory<PurchaseQueryParams>('purchases');

export const usePurchases = (params?: PurchaseQueryParams) => {
  return useQuery({
    queryKey: purchaseKeys.list(params),
    queryFn: () => purchaseService.getAll(params),
  });
};
