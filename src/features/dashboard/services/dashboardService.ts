import { compareAsc } from 'date-fns';
import { LOW_STOCK_THRESHOLD } from '@/shared/constants';
import { groupByMonth } from '@/shared/utils';
import { customerService } from '@/features/customers/services/customerService';
import { productService } from '@/features/products/services/productService';
import { supplierService } from '@/features/suppliers/services/supplierService';
import { purchaseService } from '@/features/purchases/services/purchaseService';
import { saleService } from '@/features/sales/services/saleService';
import { employeeService } from '@/features/employees/services/employeeService';
import type { DashboardStatsDto, CategoryDistribution, RecentSale } from '../types/dashboard.types';

const RECENT_SALES_LIMIT = 5;

export const dashboardService = {
  async getDashboardStats(): Promise<DashboardStatsDto> {
    const [customersResult, productsResult, suppliersResult, purchasesResult, salesResult, employeesResult] =
      await Promise.all([
        customerService.getAll({ limit: 100 }),
        productService.getAll({ limit: 100 }),
        supplierService.getAll({ limit: 100 }),
        purchaseService.getAll({ limit: 100 }),
        saleService.getAll({ limit: 100 }),
        employeeService.getAll({ limit: 100 }),
      ]);

    const customers = customersResult.data;
    const products = productsResult.data;
    const purchases = purchasesResult.data;
    const sales = salesResult.data;

    const inventoryValue = products.reduce((sum, product) => sum + product.price * product.stock, 0);
    const lowStockCount = products.filter((product) => product.stock <= LOW_STOCK_THRESHOLD).length;

    const totalSalesAmount = sales.reduce((sum, sale) => sum + sale.totalAmount, 0);
    const totalPurchasesAmount = purchases.reduce((sum, purchase) => sum + purchase.totalAmount, 0);

    const monthlySales = groupByMonth(sales.map((sale) => ({ date: sale.saleDate, amount: sale.totalAmount })));
    const monthlyPurchases = groupByMonth(
      purchases.map((purchase) => ({ date: purchase.purchaseDate, amount: purchase.totalAmount }))
    );

    const inventoryByCategory = new Map<string, number>();
    for (const product of products) {
      const current = inventoryByCategory.get(product.category) ?? 0;
      inventoryByCategory.set(product.category, current + product.price * product.stock);
    }
    const categoryDistribution: CategoryDistribution[] = Array.from(inventoryByCategory.entries())
      .map(([category, value]) => ({ category, value: Math.round(value * 100) / 100 }))
      .sort((a, b) => b.value - a.value);

    const customerNameById = new Map(customers.map((customer) => [customer.id, customer.name]));
    const recentSales: RecentSale[] = [...sales]
      .sort((a, b) => compareAsc(new Date(b.saleDate), new Date(a.saleDate)))
      .slice(0, RECENT_SALES_LIMIT)
      .map((sale) => ({
        id: sale.id,
        invoiceNumber: sale.invoiceNumber,
        customerName: customerNameById.get(sale.customerId) ?? 'Unknown customer',
        totalAmount: sale.totalAmount,
        status: sale.status,
        saleDate: sale.saleDate,
      }));

    return {
      totalCustomers: customersResult.total,
      totalProducts: productsResult.total,
      totalSuppliers: suppliersResult.total,
      totalEmployees: employeesResult.total,
      totalSalesAmount: Math.round(totalSalesAmount * 100) / 100,
      totalPurchasesAmount: Math.round(totalPurchasesAmount * 100) / 100,
      inventoryValue: Math.round(inventoryValue * 100) / 100,
      lowStockCount,
      monthlySales,
      monthlyPurchases,
      categoryDistribution,
      recentSales,
    };
  },
};
