import { useQuery } from '@tanstack/react-query';
import { createQueryKeyFactory } from '@/shared/query';
import { supplierService } from '../services/supplierService';
import type { SupplierQueryParams } from '../types/supplier.types';

export const supplierKeys = createQueryKeyFactory<SupplierQueryParams>('suppliers');

export const useSuppliers = (params?: SupplierQueryParams) => {
  return useQuery({
    queryKey: supplierKeys.list(params),
    queryFn: () => supplierService.getAll(params),
  });
};
