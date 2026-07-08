export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderItem {
  productId: string;
  /** Snapshot of the product name/SKU at order time - the catalog can change later, the order shouldn't. */
  productName: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  items: OrderItem[];
  subtotal: number;
  discountPercent: number;
  discountAmount: number;
  taxPercent: number;
  taxAmount: number;
  totalAmount: number;
  status: OrderStatus;
  orderDate: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateOrderDto {
  orderNumber: string;
  customerId: string;
  items: OrderItem[];
  subtotal: number;
  discountPercent: number;
  discountAmount: number;
  taxPercent: number;
  taxAmount: number;
  totalAmount: number;
  status: OrderStatus;
  orderDate: string;
}

export interface UpdateOrderDto {
  orderNumber?: string;
  customerId?: string;
  items?: OrderItem[];
  subtotal?: number;
  discountPercent?: number;
  discountAmount?: number;
  taxPercent?: number;
  taxAmount?: number;
  totalAmount?: number;
  status?: OrderStatus;
  orderDate?: string;
}

export type OrderSortField = 'orderNumber' | 'totalAmount' | 'orderDate' | 'status';

export interface OrderQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  customerId?: string;
  status?: OrderStatus;
  sortBy?: OrderSortField;
  sortDirection?: 'asc' | 'desc';
}
