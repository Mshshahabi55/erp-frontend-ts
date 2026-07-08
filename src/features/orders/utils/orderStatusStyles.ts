import type { OrderStatus } from '../types/order.types';

const statusColors: Record<OrderStatus, 'warning' | 'info' | 'primary' | 'success' | 'error'> = {
  pending: 'warning',
  processing: 'info',
  shipped: 'primary',
  delivered: 'success',
  cancelled: 'error',
};

const statusLabels: Record<OrderStatus, string> = {
  pending: 'Pending',
  processing: 'Processing',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

export const getOrderStatusColor = (status: OrderStatus): 'warning' | 'info' | 'primary' | 'success' | 'error' =>
  statusColors[status];

export const getOrderStatusLabel = (status: OrderStatus): string => statusLabels[status];
