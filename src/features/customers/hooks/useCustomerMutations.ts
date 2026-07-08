import { useMutation, useQueryClient } from '@tanstack/react-query';
import { notify } from '@/shared/notifications';
import { customerService } from '../services/customerService';
import { customerKeys } from './useCustomers';
import type { CreateCustomerDto, UpdateCustomerDto } from '../types/customer.types';

export const useCreateCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCustomerDto) => customerService.create(data),
    onSuccess: (customer) => {
      queryClient.invalidateQueries({ queryKey: customerKeys.lists() });
      notify.success(`Customer "${customer.name}" created successfully!`);
    },
    onError: (error) => {
      notify.error(error, 'Failed to create customer');
    },
  });
};

export const useUpdateCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCustomerDto }) =>
      customerService.update(id, data),
    onSuccess: (customer) => {
      queryClient.invalidateQueries({ queryKey: customerKeys.lists() });
      notify.success(`Customer "${customer.name}" updated successfully!`);
    },
    onError: (error) => {
      notify.error(error, 'Failed to update customer');
    },
  });
};

export const useDeleteCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => customerService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: customerKeys.lists() });
      notify.success('Customer deleted successfully!');
    },
    onError: (error) => {
      notify.error(error, 'Failed to delete customer');
    },
  });
};
