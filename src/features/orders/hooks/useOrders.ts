import { useQuery } from '@tanstack/react-query';
import { createQueryKeyFactory } from '@/shared/query';
import { orderService } from '../services/orderService';
import type { OrderQueryParams } from '../types/order.types';

export const orderKeys = createQueryKeyFactory<OrderQueryParams>('orders');

export const useOrders = (params?: OrderQueryParams) => {
  return useQuery({
    queryKey: orderKeys.list(params),
    queryFn: () => orderService.getAll(params),
  });
};
