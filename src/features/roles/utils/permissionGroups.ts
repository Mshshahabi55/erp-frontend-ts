import type { Permission } from '@/shared/rbac';

export interface PermissionGroup {
  resource: string;
  permissions: Permission[];
}

// Every permission follows `${action}_${resource}` - grouping by resource
// here is the one place that structure needs to be spelled out for display;
// everything else (labels, RBAC checks) derives from the permission strings.
export const PERMISSION_GROUPS: PermissionGroup[] = [
  { resource: 'Dashboard', permissions: ['view_dashboard'] },
  { resource: 'Reports', permissions: ['view_reports'] },
  { resource: 'Customers', permissions: ['view_customers', 'create_customers', 'edit_customers', 'delete_customers'] },
  { resource: 'Products', permissions: ['view_products', 'create_products', 'edit_products', 'delete_products'] },
  { resource: 'Categories', permissions: ['view_categories', 'create_categories', 'edit_categories', 'delete_categories'] },
  { resource: 'Suppliers', permissions: ['view_suppliers', 'create_suppliers', 'edit_suppliers', 'delete_suppliers'] },
  { resource: 'Warehouses', permissions: ['view_warehouses', 'create_warehouses', 'edit_warehouses', 'delete_warehouses'] },
  { resource: 'Inventory', permissions: ['view_inventory', 'create_inventory'] },
  { resource: 'Purchases', permissions: ['view_purchases', 'create_purchases', 'edit_purchases', 'delete_purchases'] },
  { resource: 'Sales', permissions: ['view_sales', 'create_sales', 'edit_sales', 'delete_sales'] },
  { resource: 'Employees', permissions: ['view_employees', 'create_employees', 'edit_employees', 'delete_employees'] },
  { resource: 'Orders', permissions: ['view_orders', 'create_orders', 'edit_orders', 'delete_orders'] },
  { resource: 'Users', permissions: ['view_users', 'manage_users'] },
];

const ACTION_LABELS: Record<string, string> = {
  view: 'View',
  create: 'Create',
  edit: 'Edit',
  delete: 'Delete',
  manage: 'Manage',
};

export const getPermissionActionLabel = (permission: Permission): string => {
  const [action] = permission.split('_');
  return ACTION_LABELS[action] ?? action;
};
