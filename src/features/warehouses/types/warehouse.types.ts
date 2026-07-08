export interface Warehouse {
  id: string;
  name: string;
  /** Short unique identifier, e.g. "WH-EAST". */
  code: string;
  address: string;
  city: string;
  state: string;
  managerName: string;
  phone: string;
  /** Storage capacity in units. */
  capacity: number;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateWarehouseDto {
  name: string;
  code: string;
  address: string;
  city: string;
  state: string;
  managerName: string;
  phone: string;
  capacity: number;
  isActive: boolean;
}

export interface UpdateWarehouseDto {
  name?: string;
  code?: string;
  address?: string;
  city?: string;
  state?: string;
  managerName?: string;
  phone?: string;
  capacity?: number;
  isActive?: boolean;
}

export type WarehouseSortField = 'name' | 'code' | 'city' | 'capacity' | 'createdAt';

export interface WarehouseQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
  sortBy?: WarehouseSortField;
  sortDirection?: 'asc' | 'desc';
}
