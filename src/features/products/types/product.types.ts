export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  stock: number;
  unit: string;
  description?: string;
  isAvailable: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateProductDto {
  name: string;
  sku: string;
  category: string;
  price: number;
  stock: number;
  unit: string;
  description?: string;
  isAvailable: boolean;
}

export interface UpdateProductDto {
  name?: string;
  sku?: string;
  category?: string;
  price?: number;
  stock?: number;
  unit?: string;
  description?: string;
  isAvailable?: boolean;
}

export type ProductSortField = 'name' | 'sku' | 'category' | 'price' | 'stock' | 'createdAt';

export type StockStatus = 'in-stock' | 'low-stock' | 'out-of-stock';

export interface ProductQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  /** Filters by computed stock level - used by the Inventory feature's Stock List view. */
  stockStatus?: StockStatus;
  sortBy?: ProductSortField;
  sortDirection?: 'asc' | 'desc';
}