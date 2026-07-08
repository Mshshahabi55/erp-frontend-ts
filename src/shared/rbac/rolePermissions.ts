import { PERMISSIONS, type Permission } from './permission.types';
import type { Role } from './role.types';

export type RolePermissionMap = Record<Role, Permission[]>;

/**
 * Seed/fallback values - used until the real, admin-editable mapping loads
 * (see features/roles), and as the data the Roles & Permissions feature
 * seeds into db.json the first time. Admin's set matches every permission
 * that exists, so nothing an admin could already do is lost by this change.
 */
export const DEFAULT_ROLE_PERMISSIONS: RolePermissionMap = {
  admin: [...PERMISSIONS],

  manager: [
    'view_dashboard', 'view_reports',
    'view_customers', 'create_customers', 'edit_customers',
    'view_products', 'create_products', 'edit_products',
    'view_categories', 'create_categories', 'edit_categories',
    'view_suppliers', 'create_suppliers', 'edit_suppliers',
    'view_warehouses', 'create_warehouses', 'edit_warehouses',
    'view_inventory', 'create_inventory',
    'view_purchases', 'create_purchases', 'edit_purchases',
    'view_sales', 'create_sales', 'edit_sales',
    'view_orders', 'create_orders', 'edit_orders',
    'view_employees',
    'view_users',
  ],

  staff: [
    'view_dashboard',
    'view_customers',
    'view_products',
    'view_categories',
    'view_suppliers',
    'view_warehouses',
    'view_inventory',
    'view_purchases',
    'view_sales',
    'view_orders',
  ],
};

// The RBAC structure itself: permissions are derived from a user's roles at
// check time via this in-memory mapping, not stored per-user. It starts as
// the static default above and is replaced once with the real, persisted
// mapping when the app initializes (see AuthProvider), and again whenever an
// admin saves changes on the Roles & Permissions page - so hasPermission
// checks reflect saved edits without requiring every caller to become async.
let currentRolePermissions: RolePermissionMap = DEFAULT_ROLE_PERMISSIONS;

export const setRolePermissions = (map: RolePermissionMap): void => {
  currentRolePermissions = map;
};

export const getPermissionsForRoles = (roles: Role[]): Permission[] => {
  const combined = new Set<Permission>();
  roles.forEach((role) => currentRolePermissions[role]?.forEach((permission) => combined.add(permission)));
  return Array.from(combined);
};

export const roleHasPermission = (roles: Role[], permission: Permission): boolean =>
  roles.some((role) => currentRolePermissions[role]?.includes(permission));
