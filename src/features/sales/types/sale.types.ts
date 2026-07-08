export type SaleStatus = 'pending' | 'completed' | 'cancelled';

export interface Sale {
  id: string;
  invoiceNumber: string;
  customerId: string;
  totalAmount: number;
  status: SaleStatus;
  saleDate: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateSaleDto {
  invoiceNumber: string;
  customerId: string;
  totalAmount: number;
  status: SaleStatus;
  saleDate: string;
}

export interface UpdateSaleDto {
  invoiceNumber?: string;
  customerId?: string;
  totalAmount?: number;
  status?: SaleStatus;
  saleDate?: string;
}

export type SaleSortField = 'invoiceNumber' | 'totalAmount' | 'saleDate' | 'status';

export interface SaleQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  customerId?: string;
  status?: SaleStatus;
  sortBy?: SaleSortField;
  sortDirection?: 'asc' | 'desc';
}
