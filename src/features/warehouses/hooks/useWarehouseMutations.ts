import { useMutation, useQueryClient } from '@tanstack/react-query';
import { notify } from '@/shared/notifications';
import { warehouseService } from '../services/warehouseService';
import { warehouseKeys } from './useWarehouses';
import type { WarehouseFormData } from '../types/warehouse.schema';

const WAREHOUSE_UNIQUENESS_CHECK_LIMIT = 100;

// json-server enforces no uniqueness constraints, and a warehouse code is
// meant to be a stable, unique identifier used elsewhere (labels, transfer
// paperwork) - a silent duplicate would be confusing rather than just messy.
const assertUniqueCode = async (code: string, excludeId?: string): Promise<void> => {
  const { data: existing } = await warehouseService.getAll({ limit: WAREHOUSE_UNIQUENESS_CHECK_LIMIT });
  const collision = existing.find(
    (warehouse) => warehouse.id !== excludeId && warehouse.code.toLowerCase() === code.toLowerCase()
  );
  if (collision) {
    throw new Error(`A warehouse with code "${code}" already exists`);
  }
};

export const useCreateWarehouse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: WarehouseFormData) => {
      await assertUniqueCode(data.code);
      return warehouseService.create(data);
    },
    onSuccess: (warehouse) => {
      queryClient.invalidateQueries({ queryKey: warehouseKeys.lists() });
      notify.success(`Warehouse "${warehouse.name}" created successfully!`);
    },
    onError: (error) => {
      notify.error(error, 'Failed to create warehouse');
    },
  });
};

export const useUpdateWarehouse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: WarehouseFormData }) => {
      await assertUniqueCode(data.code, id);
      return warehouseService.update(id, data);
    },
    onSuccess: (warehouse) => {
      queryClient.invalidateQueries({ queryKey: warehouseKeys.lists() });
      notify.success(`Warehouse "${warehouse.name}" updated successfully!`);
    },
    onError: (error) => {
      notify.error(error, 'Failed to update warehouse');
    },
  });
};

export const useDeleteWarehouse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => warehouseService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: warehouseKeys.lists() });
      notify.success('Warehouse deleted successfully!');
    },
    onError: (error) => {
      notify.error(error, 'Failed to delete warehouse');
    },
  });
};
