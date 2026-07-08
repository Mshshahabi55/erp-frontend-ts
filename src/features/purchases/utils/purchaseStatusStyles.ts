import type { PurchaseStatus } from '../types/purchase.types';

const statusColors: Record<PurchaseStatus, 'warning' | 'success' | 'error'> = {
  pending: 'warning',
  received: 'success',
  cancelled: 'error',
};

const statusLabels: Record<PurchaseStatus, string> = {
  pending: 'Pending',
  received: 'Received',
  cancelled: 'Cancelled',
};

export const getPurchaseStatusColor = (status: PurchaseStatus): 'warning' | 'success' | 'error' => statusColors[status];

export const getPurchaseStatusLabel = (status: PurchaseStatus): string => statusLabels[status];
