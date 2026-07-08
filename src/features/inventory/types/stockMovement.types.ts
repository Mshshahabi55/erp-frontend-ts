export type StockMovementType = 'in' | 'out' | 'adjustment';

export interface StockMovement {
  id: string;
  productId: string;
  type: StockMovementType;
  /** For 'in'/'out' this is a delta; for 'adjustment' it's the corrected absolute stock level. */
  quantity: number;
  reason: string;
  performedBy: string;
  movementDate: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateStockMovementDto {
  productId: string;
  type: StockMovementType;
  quantity: number;
  reason: string;
  performedBy: string;
}

export type StockMovementSortField = 'movementDate' | 'type' | 'quantity';

export interface StockMovementQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  productId?: string;
  type?: StockMovementType;
  sortBy?: StockMovementSortField;
  sortDirection?: 'asc' | 'desc';
}
