import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from '@/features/auth/components/ProtectedRoute';
import { MainLayout } from '@/layouts/MainLayout/MainLayout';
import { LoadingSpinner } from '@/shared/components';

const LoginPage = lazy(() => import('@/features/auth/pages/LoginPage'));
const DashboardPage = lazy(() => import('@/features/dashboard/pages/DashboardPage'));
const CustomersPage = lazy(() => import('@/features/customers/pages/CustomersPage'));
const SalesPage = lazy(() => import('@/features/sales/pages/SalesPage'));
const ProductsPage = lazy(() => import('@/features/products/pages/ProductsPage'));
const SuppliersPage = lazy(() => import('@/features/suppliers/pages/SuppliersPage'));
const InventoryPage = lazy(() => import('@/features/inventory/pages/InventoryPage'));
const PurchasesPage = lazy(() => import('@/features/purchases/pages/PurchasesPage'));
const EmployeesPage = lazy(() => import('@/features/employees/pages/EmployeesPage'));
const ReportsPage = lazy(() => import('@/features/reports/pages/ReportsPage'));
const OrdersPage = lazy(() => import('@/features/orders/pages/OrdersPage'));
const OrderCreatePage = lazy(() => import('@/features/orders/pages/OrderCreatePage'));
const OrderEditPage = lazy(() => import('@/features/orders/pages/OrderEditPage'));
const OrderDetailsPage = lazy(() => import('@/features/orders/pages/OrderDetailsPage'));
const UsersPage = lazy(() => import('@/features/users/pages/UsersPage'));
const CategoriesPage = lazy(() => import('@/features/categories/pages/CategoriesPage'));
const WarehousesPage = lazy(() => import('@/features/warehouses/pages/WarehousesPage'));
const RolesPermissionsPage = lazy(() => import('@/features/roles/pages/RolesPermissionsPage'));
const SettingsPage = lazy(() => import('@/features/settings/pages/SettingsPage'));
const AuditLogsPage = lazy(() => import('@/features/audit/pages/AuditLogsPage'));
const NotificationsPage = lazy(() => import('@/features/notifications/pages/NotificationsPage'));

const withSuspense = (Component: React.LazyExoticComponent<React.ComponentType>) => (
  <Suspense fallback={<LoadingSpinner fullScreen message="Loading page..." />}>
    <Component />
  </Suspense>
);

export const AppRouter = () => {
  return (
    <Routes>
      <Route path="/login" element={withSuspense(LoginPage)} />
      
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={withSuspense(DashboardPage)} />
          <Route path="/customers" element={withSuspense(CustomersPage)} />
          <Route path="/sales" element={withSuspense(SalesPage)} />
          <Route path="/products" element={withSuspense(ProductsPage)} />
          <Route path="/categories" element={withSuspense(CategoriesPage)} />
          <Route path="/suppliers" element={withSuspense(SuppliersPage)} />
          <Route path="/inventory" element={withSuspense(InventoryPage)} />
          <Route path="/warehouses" element={withSuspense(WarehousesPage)} />
          <Route path="/purchases" element={withSuspense(PurchasesPage)} />
          <Route path="/employees" element={withSuspense(EmployeesPage)} />
          <Route path="/orders" element={withSuspense(OrdersPage)} />
          <Route path="/orders/new" element={withSuspense(OrderCreatePage)} />
          <Route path="/orders/:id" element={withSuspense(OrderDetailsPage)} />
          <Route path="/orders/:id/edit" element={withSuspense(OrderEditPage)} />
          <Route path="/reports" element={withSuspense(ReportsPage)} />
          <Route path="/users" element={withSuspense(UsersPage)} />
          <Route path="/settings" element={withSuspense(SettingsPage)} />
          <Route path="/notifications" element={withSuspense(NotificationsPage)} />

          <Route element={<ProtectedRoute requiredPermission="manage_users" />}>
            <Route path="/roles-permissions" element={withSuspense(RolesPermissionsPage)} />
            <Route path="/audit-logs" element={withSuspense(AuditLogsPage)} />
          </Route>
        </Route>
      </Route>
      
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};