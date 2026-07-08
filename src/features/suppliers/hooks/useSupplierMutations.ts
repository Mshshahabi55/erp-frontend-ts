import { useMutation, useQueryClient } from '@tanstack/react-query';
import { notify } from '@/shared/notifications';
import { supplierService } from '../services/supplierService';
import { supplierKeys } from './useSuppliers';
import type { CreateSupplierDto, UpdateSupplierDto } from '../types/supplier.types';

export const useCreateSupplier = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateSupplierDto) => supplierService.create(data),
    onSuccess: (supplier) => {
      queryClient.invalidateQueries({ queryKey: supplierKeys.lists() });
      notify.success(`Supplier "${supplier.name}" created successfully!`);
    },
    onError: (error) => {
      notify.error(error, 'Failed to create supplier');
    },
  });
};

export const useUpdateSupplier = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateSupplierDto }) =>
      supplierService.update(id, data),
    onSuccess: (supplier) => {
      queryClient.invalidateQueries({ queryKey: supplierKeys.lists() });
      notify.success(`Supplier "${supplier.name}" updated successfully!`);
    },
    onError: (error) => {
      notify.error(error, 'Failed to update supplier');
    },
  });
};

export const useDeleteSupplier = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => supplierService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: supplierKeys.lists() });
      notify.success('Supplier deleted successfully!');
    },
    onError: (error) => {
      notify.error(error, 'Failed to delete supplier');
    },
  });
};
