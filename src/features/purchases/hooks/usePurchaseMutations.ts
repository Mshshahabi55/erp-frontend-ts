import { useMutation, useQueryClient } from '@tanstack/react-query';
import { notify } from '@/shared/notifications';
import { purchaseService } from '../services/purchaseService';
import { purchaseKeys } from './usePurchases';
import type { CreatePurchaseDto, UpdatePurchaseDto } from '../types/purchase.types';

export const useCreatePurchase = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePurchaseDto) => purchaseService.create(data),
    onSuccess: (purchase) => {
      queryClient.invalidateQueries({ queryKey: purchaseKeys.lists() });
      notify.success(`Purchase "${purchase.purchaseNumber}" created successfully!`);
    },
    onError: (error) => {
      notify.error(error, 'Failed to create purchase');
    },
  });
};

export const useUpdatePurchase = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePurchaseDto }) =>
      purchaseService.update(id, data),
    onSuccess: (purchase) => {
      queryClient.invalidateQueries({ queryKey: purchaseKeys.lists() });
      notify.success(`Purchase "${purchase.purchaseNumber}" updated successfully!`);
    },
    onError: (error) => {
      notify.error(error, 'Failed to update purchase');
    },
  });
};

export const useDeletePurchase = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => purchaseService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: purchaseKeys.lists() });
      notify.success('Purchase deleted successfully!');
    },
    onError: (error) => {
      notify.error(error, 'Failed to delete purchase');
    },
  });
};
