import type { SaleStatus } from '../types/sale.types';

const statusColors: Record<SaleStatus, 'warning' | 'success' | 'error'> = {
  pending: 'warning',
  completed: 'success',
  cancelled: 'error',
};

const statusLabels: Record<SaleStatus, string> = {
  pending: 'Pending',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

export const getSaleStatusColor = (status: SaleStatus): 'warning' | 'success' | 'error' => statusColors[status];

export const getSaleStatusLabel = (status: SaleStatus): string => statusLabels[status];
