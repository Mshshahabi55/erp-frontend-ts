import { createJsonServerResource } from '@/shared/api';
import type { WithRawId } from '@/shared/types';
import { Warehouse, CreateWarehouseDto, UpdateWarehouseDto, WarehouseQueryParams } from '../types/warehouse.types';

export type { Warehouse, CreateWarehouseDto, UpdateWarehouseDto, WarehouseQueryParams };

type RawWarehouse = Omit<WithRawId<Warehouse>, 'capacity'> & { capacity: string | number };

const normalizeWarehouse = (raw: RawWarehouse): Warehouse => ({
  ...raw,
  id: String(raw.id),
  capacity: Number(raw.capacity),
});

export const warehouseService = createJsonServerResource<
  Warehouse,
  RawWarehouse,
  CreateWarehouseDto,
  UpdateWarehouseDto,
  WarehouseQueryParams
>({
  resourcePath: '/warehouses',
  normalize: normalizeWarehouse,
  searchFields: ['name', 'code', 'city', 'managerName'],
  buildFilters: (params) => {
    const filters: Record<string, unknown> = {};

    if (params?.isActive !== undefined) {
      filters.isActive = params.isActive;
    }

    if (params?.sortBy) {
      filters._sort = params.sortDirection === 'desc' ? `-${params.sortBy}` : params.sortBy;
    }

    return filters;
  },
});
