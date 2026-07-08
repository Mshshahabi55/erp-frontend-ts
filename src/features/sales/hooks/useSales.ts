import { useQuery } from '@tanstack/react-query';
import { createQueryKeyFactory } from '@/shared/query';
import { saleService } from '../services/saleService';
import type { SaleQueryParams } from '../types/sale.types';

export const saleKeys = createQueryKeyFactory<SaleQueryParams>('sales');

export const useSales = (params?: SaleQueryParams) => {
  return useQuery({
    queryKey: saleKeys.list(params),
    queryFn: () => saleService.getAll(params),
  });
};
