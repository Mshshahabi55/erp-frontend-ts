import { saleService } from '@/features/sales/services/saleService';
import { customerService } from '@/features/customers/services/customerService';
import { purchaseService } from '@/features/purchases/services/purchaseService';
import { supplierService } from '@/features/suppliers/services/supplierService';
import { orderService } from '@/features/orders/services/orderService';
import type { SalesReportRow, PurchasesReportRow, OrdersReportRow } from '../types/report.types';

const FETCH_ALL_LIMIT = 100;

export const reportService = {
  async getSalesReportRows(): Promise<SalesReportRow[]> {
    const [salesResult, customersResult] = await Promise.all([
      saleService.getAll({ limit: FETCH_ALL_LIMIT }),
      customerService.getAll({ limit: FETCH_ALL_LIMIT }),
    ]);

    const customerNameById = new Map(customersResult.data.map((customer) => [customer.id, customer.name]));

    return salesResult.data.map((sale) => ({
      id: sale.id,
      invoiceNumber: sale.invoiceNumber,
      customerName: customerNameById.get(sale.customerId) ?? 'Unknown customer',
      totalAmount: sale.totalAmount,
      status: sale.status,
      date: sale.saleDate,
    }));
  },

  async getPurchasesReportRows(): Promise<PurchasesReportRow[]> {
    const [purchasesResult, suppliersResult] = await Promise.all([
      purchaseService.getAll({ limit: FETCH_ALL_LIMIT }),
      supplierService.getAll({ limit: FETCH_ALL_LIMIT }),
    ]);

    const supplierNameById = new Map(suppliersResult.data.map((supplier) => [supplier.id, supplier.name]));

    return purchasesResult.data.map((purchase) => ({
      id: purchase.id,
      purchaseNumber: purchase.purchaseNumber,
      supplierName: supplierNameById.get(purchase.supplierId) ?? 'Unknown supplier',
      totalAmount: purchase.totalAmount,
      status: purchase.status,
      date: purchase.purchaseDate,
    }));
  },

  async getOrdersReportRows(): Promise<OrdersReportRow[]> {
    const [ordersResult, customersResult] = await Promise.all([
      orderService.getAll({ limit: FETCH_ALL_LIMIT }),
      customerService.getAll({ limit: FETCH_ALL_LIMIT }),
    ]);

    const customerNameById = new Map(customersResult.data.map((customer) => [customer.id, customer.name]));

    return ordersResult.data.map((order) => ({
      id: order.id,
      orderNumber: order.orderNumber,
      customerName: customerNameById.get(order.customerId) ?? 'Unknown customer',
      totalAmount: order.totalAmount,
      status: order.status,
      date: order.orderDate,
      itemCount: order.items.length,
    }));
  },
};
