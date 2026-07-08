export const AUDIT_ACTIONS = ['create', 'update', 'delete', 'login', 'logout', 'status_change', 'export'] as const;
export type AuditAction = (typeof AUDIT_ACTIONS)[number];

export const AUDIT_RESOURCES = [
  'Customer', 'Product', 'Category', 'Supplier', 'Warehouse',
  'Employee', 'Sale', 'Purchase', 'Order', 'User', 'Inventory',
  'Role', 'Settings', 'Auth',
] as const;
export type AuditResource = (typeof AUDIT_RESOURCES)[number];

// userName is a snapshot at log time - a user record can be renamed or
// deleted later, but the audit trail must keep reading correctly regardless
// (same reasoning as Order's line-item product name/SKU snapshot).
export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  action: AuditAction;
  resource: AuditResource;
  resourceId?: string;
  description: string;
  ipAddress: string;
  createdAt: string;
}

export type AuditLogSortField = 'createdAt' | 'action' | 'resource' | 'userName';

export interface AuditLogQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  action?: AuditAction;
  resource?: AuditResource;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: AuditLogSortField;
  sortDirection?: 'asc' | 'desc';
}
