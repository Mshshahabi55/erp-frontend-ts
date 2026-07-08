import { useMutation, useQueryClient } from '@tanstack/react-query';
import { notify } from '@/shared/notifications';
import { saleService } from '../services/saleService';
import { saleKeys } from './useSales';
import type { CreateSaleDto, UpdateSaleDto } from '../types/sale.types';

export const useCreateSale = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateSaleDto) => saleService.create(data),
    onSuccess: (sale) => {
      queryClient.invalidateQueries({ queryKey: saleKeys.lists() });
      notify.success(`Sale "${sale.invoiceNumber}" created successfully!`);
    },
    onError: (error) => {
      notify.error(error, 'Failed to create sale');
    },
  });
};

export const useUpdateSale = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateSaleDto }) =>
      saleService.update(id, data),
    onSuccess: (sale) => {
      queryClient.invalidateQueries({ queryKey: saleKeys.lists() });
      notify.success(`Sale "${sale.invoiceNumber}" updated successfully!`);
    },
    onError: (error) => {
      notify.error(error, 'Failed to update sale');
    },
  });
};

export const useDeleteSale = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => saleService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: saleKeys.lists() });
      notify.success('Sale deleted successfully!');
    },
    onError: (error) => {
      notify.error(error, 'Failed to delete sale');
    },
  });
};
