import type { OrderStatus } from '../types/order.types';

const VALID_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  pending: ['processing', 'cancelled'],
  processing: ['shipped', 'cancelled'],
  shipped: ['delivered'],
  delivered: [],
  cancelled: [],
};

export const getValidNextStatuses = (current: OrderStatus): OrderStatus[] => VALID_TRANSITIONS[current];

export const canTransitionStatus = (from: OrderStatus, to: OrderStatus): boolean =>
  VALID_TRANSITIONS[from].includes(to);

export const isTerminalStatus = (status: OrderStatus): boolean => VALID_TRANSITIONS[status].length === 0;
