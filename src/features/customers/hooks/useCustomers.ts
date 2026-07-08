import { useQuery } from '@tanstack/react-query';
import { createQueryKeyFactory } from '@/shared/query';
import { customerService } from '../services/customerService';
import type { CustomerQueryParams } from '../types/customer.types';

export const customerKeys = createQueryKeyFactory<CustomerQueryParams>('customers');

export const useCustomers = (params?: CustomerQueryParams) => {
  return useQuery({
    queryKey: customerKeys.list(params),
    queryFn: () => customerService.getAll(params),
  });
};
