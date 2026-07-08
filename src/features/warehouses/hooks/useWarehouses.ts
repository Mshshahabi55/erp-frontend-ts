import { useQuery } from '@tanstack/react-query';
import { createQueryKeyFactory } from '@/shared/query';
import { warehouseService } from '../services/warehouseService';
import type { WarehouseQueryParams } from '../types/warehouse.types';

export const warehouseKeys = createQueryKeyFactory<WarehouseQueryParams>('warehouses');

export const useWarehouses = (params?: WarehouseQueryParams) => {
  return useQuery({
    queryKey: warehouseKeys.list(params),
    queryFn: () => warehouseService.getAll(params),
  });
};
