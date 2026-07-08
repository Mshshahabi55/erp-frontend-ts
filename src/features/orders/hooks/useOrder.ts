import { useQuery } from '@tanstack/react-query';
import { orderService } from '../services/orderService';
import { orderKeys } from './useOrders';

export const useOrder = (id: string | undefined) => {
  return useQuery({
    queryKey: orderKeys.detail(id ?? ''),
    queryFn: () => orderService.getById(id!),
    enabled: !!id,
  });
};
