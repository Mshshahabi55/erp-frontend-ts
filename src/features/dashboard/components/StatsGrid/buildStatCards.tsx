import {
  People,
  Inventory2,
  LocalShipping,
  Badge,
  PointOfSale,
  ShoppingCart,
  Warehouse,
  WarningAmber,
} from '@mui/icons-material';
import { numberFormatter, currencyFormatter } from '@/shared/utils';
import type { DashboardStat, DashboardStatsDto } from '../../types/dashboard.types';

/** Maps the raw aggregated stats DTO to the presentational cards StatsGrid renders. */
export const buildStatCards = (stats: DashboardStatsDto): DashboardStat[] => [
  {
    key: 'customers',
    title: 'Total Customers',
    value: numberFormatter.integer(stats.totalCustomers),
    icon: <People aria-hidden="true" />,
    color: '#1976d2',
  },
  {
    key: 'products',
    title: 'Total Products',
    value: numberFormatter.integer(stats.totalProducts),
    icon: <Inventory2 aria-hidden="true" />,
    color: '#2e7d32',
  },
  {
    key: 'suppliers',
    title: 'Total Suppliers',
    value: numberFormatter.integer(stats.totalSuppliers),
    icon: <LocalShipping aria-hidden="true" />,
    color: '#0288d1',
  },
  {
    key: 'employees',
    title: 'Total Employees',
    value: numberFormatter.integer(stats.totalEmployees),
    icon: <Badge aria-hidden="true" />,
    color: '#6d4c41',
  },
  {
    key: 'sales',
    title: 'Total Sales',
    value: currencyFormatter.usd(stats.totalSalesAmount),
    icon: <PointOfSale aria-hidden="true" />,
    color: '#2e7d32',
  },
  {
    key: 'purchases',
    title: 'Total Purchases',
    value: currencyFormatter.usd(stats.totalPurchasesAmount),
    icon: <ShoppingCart aria-hidden="true" />,
    color: '#ed6c02',
  },
  {
    key: 'inventory-value',
    title: 'Inventory Value',
    value: currencyFormatter.usd(stats.inventoryValue),
    icon: <Warehouse aria-hidden="true" />,
    color: '#9c27b0',
  },
  {
    key: 'low-stock',
    title: 'Low Stock Products',
    value: numberFormatter.integer(stats.lowStockCount),
    icon: <WarningAmber aria-hidden="true" />,
    color: '#d32f2f',
  },
];
