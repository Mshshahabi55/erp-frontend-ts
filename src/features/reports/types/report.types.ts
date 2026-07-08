import type { SaleStatus } from '@/features/sales/types/sale.types';
import type { PurchaseStatus } from '@/features/purchases/types/purchase.types';
import type { OrderStatus } from '@/features/orders/types/order.types';

// Re-exported for backward compatibility with existing imports in this
// feature - the canonical definition now lives in shared/types since
// Audit Logs needs the identical {from, to} shape.
export type { DateRange } from '@/shared/types';

export interface ReportSummary {
  totalAmount: number;
  transactionCount: number;
  averageAmount: number;
}

export interface SalesReportRow {
  id: string;
  invoiceNumber: string;
  customerName: string;
  totalAmount: number;
  status: SaleStatus;
  date: string;
}

export interface PurchasesReportRow {
  id: string;
  purchaseNumber: string;
  supplierName: string;
  totalAmount: number;
  status: PurchaseStatus;
  date: string;
}

export interface OrdersReportRow {
  id: string;
  orderNumber: string;
  customerName: string;
  totalAmount: number;
  status: OrderStatus;
  date: string;
  /** Order-specific - Sales/Purchases don't have line items, so this has no equivalent there. */
  itemCount: number;
}
