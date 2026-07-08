import type { ReactNode } from 'react';
import type { MonthlyAmount } from '@/shared/utils';
import type { Sale } from '@/features/sales/types/sale.types';

export type { MonthlyAmount };

export interface DashboardStat {
  key: string;
  title: string;
  value: string;
  icon: ReactNode;
  color: string;
}

export interface CategoryDistribution {
  category: string;
  value: number;
}

export interface RecentSale {
  id: string;
  invoiceNumber: string;
  customerName: string;
  totalAmount: number;
  status: Sale['status'];
  saleDate: string;
}

export interface DashboardStatsDto {
  totalCustomers: number;
  totalProducts: number;
  totalSuppliers: number;
  totalEmployees: number;
  totalSalesAmount: number;
  totalPurchasesAmount: number;
  inventoryValue: number;
  lowStockCount: number;
  monthlySales: MonthlyAmount[];
  monthlyPurchases: MonthlyAmount[];
  categoryDistribution: CategoryDistribution[];
  recentSales: RecentSale[];
}
