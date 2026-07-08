/**
 * Single source of truth for every permission string in the app. Previously
 * these existed only as untyped literals duplicated between authService's
 * mock user and the (unused) usePermissions hook - a typo in either would
 * have silently created a permission nothing could ever grant.
 */
export const PERMISSIONS = [
  'view_dashboard',
  'view_reports',

  'view_customers', 'create_customers', 'edit_customers', 'delete_customers',
  'view_products', 'create_products', 'edit_products', 'delete_products',
  'view_categories', 'create_categories', 'edit_categories', 'delete_categories',
  'view_suppliers', 'create_suppliers', 'edit_suppliers', 'delete_suppliers',
  'view_warehouses', 'create_warehouses', 'edit_warehouses', 'delete_warehouses',
  'view_inventory', 'create_inventory',
  'view_purchases', 'create_purchases', 'edit_purchases', 'delete_purchases',
  'view_sales', 'create_sales', 'edit_sales', 'delete_sales',
  'view_employees', 'create_employees', 'edit_employees', 'delete_employees',
  'view_orders', 'create_orders', 'edit_orders', 'delete_orders',

  'view_users', 'manage_users',
] as const;

export type Permission = (typeof PERMISSIONS)[number];
