export interface Supplier {
  id: string;
  name: string;
  contactName: string;
  email: string;
  phone: string;
  address: string;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateSupplierDto {
  name: string;
  contactName: string;
  email: string;
  phone: string;
  address: string;
  isActive: boolean;
}

export interface UpdateSupplierDto {
  name?: string;
  contactName?: string;
  email?: string;
  phone?: string;
  address?: string;
  isActive?: boolean;
}

export type SupplierSortField = 'name' | 'contactName' | 'email' | 'createdAt';

export interface SupplierQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
  sortBy?: SupplierSortField;
  sortDirection?: 'asc' | 'desc';
}
