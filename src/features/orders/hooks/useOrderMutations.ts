import { useMutation, useQueryClient } from '@tanstack/react-query';
import { notify } from '@/shared/notifications';
import type { Product } from '@/features/products/types/product.types';
import { orderService } from '../services/orderService';
import { orderKeys } from './useOrders';
import { buildOrderPayload, buildNewOrderPayload } from '../utils/buildOrderPayload';
import type { OrderFormData } from '../types/order.schema';
import type { OrderStatus } from '../types/order.types';

export const useCreateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ formData, products }: { formData: OrderFormData; products: Product[] }) =>
      orderService.create(buildNewOrderPayload(formData, products)),
    onSuccess: (order) => {
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
      notify.success(`Order "${order.orderNumber}" created successfully!`);
    },
    onError: (error) => {
      notify.error(error, 'Failed to create order');
    },
  });
};

export const useUpdateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      formData,
      products,
      status,
    }: {
      id: string;
      formData: OrderFormData;
      products: Product[];
      status: OrderStatus;
    }) => orderService.update(id, buildOrderPayload(formData, products, status)),
    onSuccess: (order) => {
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
      queryClient.invalidateQueries({ queryKey: orderKeys.detail(order.id) });
      notify.success(`Order "${order.orderNumber}" updated successfully!`);
    },
    onError: (error) => {
      notify.error(error, 'Failed to update order');
    },
  });
};

export const useDeleteOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => orderService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
      notify.success('Order deleted successfully!');
    },
    onError: (error) => {
      notify.error(error, 'Failed to delete order');
    },
  });
};
