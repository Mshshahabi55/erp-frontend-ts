export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  address?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateCustomerDto {
  name: string;
  email: string;
  phone: string;
  company?: string;
  address?: string;
  isActive: boolean;
}

export interface UpdateCustomerDto {
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  address?: string;
  isActive?: boolean;
}

export type CustomerSortField = 'name' | 'email' | 'company' | 'createdAt';

export interface CustomerQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
  sortBy?: CustomerSortField;
  sortDirection?: 'asc' | 'desc';
}