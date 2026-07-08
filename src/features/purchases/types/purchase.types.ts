export type PurchaseStatus = 'pending' | 'received' | 'cancelled';

export interface Purchase {
  id: string;
  purchaseNumber: string;
  supplierId: string;
  totalAmount: number;
  status: PurchaseStatus;
  purchaseDate: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CreatePurchaseDto {
  purchaseNumber: string;
  supplierId: string;
  totalAmount: number;
  status: PurchaseStatus;
  purchaseDate: string;
}

export interface UpdatePurchaseDto {
  purchaseNumber?: string;
  supplierId?: string;
  totalAmount?: number;
  status?: PurchaseStatus;
  purchaseDate?: string;
}

export type PurchaseSortField = 'purchaseNumber' | 'totalAmount' | 'purchaseDate' | 'status';

export interface PurchaseQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  supplierId?: string;
  status?: PurchaseStatus;
  sortBy?: PurchaseSortField;
  sortDirection?: 'asc' | 'desc';
}
