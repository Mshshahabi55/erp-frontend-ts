import { useMutation, useQueryClient } from '@tanstack/react-query';
import { notify } from '@/shared/notifications';
import type { PagedResponse } from '@/shared/types';
import { orderService } from '../services/orderService';
import { orderKeys } from './useOrders';
import type { Order, OrderStatus } from '../types/order.types';

interface UpdateStatusVars {
  id: string;
  status: OrderStatus;
}

interface MutationContext {
  previousLists: [readonly unknown[], PagedResponse<Order> | undefined][];
  previousDetail: Order | undefined;
}

/**
 * Updates an order's status optimistically - the table/details view reflects
 * the new status immediately, before the server confirms, and rolls back if
 * the request fails. Appropriate here specifically because a status change is
 * a small, low-risk, single-field mutation a user expects to feel instant.
 */
export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();

  return useMutation<Order, unknown, UpdateStatusVars, MutationContext>({
    mutationFn: ({ id, status }) => orderService.update(id, { status }),

    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({ queryKey: orderKeys.lists() });
      await queryClient.cancelQueries({ queryKey: orderKeys.detail(id) });

      const previousLists = queryClient.getQueriesData<PagedResponse<Order>>({ queryKey: orderKeys.lists() });
      const previousDetail = queryClient.getQueryData<Order>(orderKeys.detail(id));

      previousLists.forEach(([queryKey, data]) => {
        if (!data) return;
        queryClient.setQueryData<PagedResponse<Order>>(queryKey, {
          ...data,
          data: data.data.map((order) => (order.id === id ? { ...order, status } : order)),
        });
      });

      if (previousDetail) {
        queryClient.setQueryData<Order>(orderKeys.detail(id), { ...previousDetail, status });
      }

      return { previousLists, previousDetail };
    },

    onError: (error, { id }, context) => {
      context?.previousLists.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data);
      });
      if (context?.previousDetail) {
        queryClient.setQueryData(orderKeys.detail(id), context.previousDetail);
      }
      notify.error(error, 'Failed to update order status');
    },

    onSuccess: () => {
      notify.success('Order status updated!');
    },

    onSettled: (_data, _error, { id }) => {
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
      queryClient.invalidateQueries({ queryKey: orderKeys.detail(id) });
    },
  });
};
