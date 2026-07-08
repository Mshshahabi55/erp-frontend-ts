import type { Permission, Role } from '@/shared/rbac';

/** One row per role - roles themselves are fixed (admin/manager/staff), only their permission sets are editable. */
export interface RolePermissionRecord {
  id: Role;
  permissions: Permission[];
}
