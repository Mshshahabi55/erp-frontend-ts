import { LOW_STOCK_THRESHOLD } from '@/shared/constants';
import type { StockStatus } from '@/features/products/types/product.types';

export const getStockStatus = (stock: number): StockStatus => {
  if (stock === 0) return 'out-of-stock';
  if (stock <= LOW_STOCK_THRESHOLD) return 'low-stock';
  return 'in-stock';
};

export const stockStatusLabels: Record<StockStatus, string> = {
  'in-stock': 'In Stock',
  'low-stock': 'Low Stock',
  'out-of-stock': 'Out of Stock',
};

export const stockStatusColors: Record<StockStatus, 'success' | 'warning' | 'error'> = {
  'in-stock': 'success',
  'low-stock': 'warning',
  'out-of-stock': 'error',
};
