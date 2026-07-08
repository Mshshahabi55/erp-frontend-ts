import { ROLES, type Role } from '@/shared/rbac';

// Re-exported under this feature's own naming so existing consumers here
// (user.schema.ts, UserForm, UserTable, UserFilters...) don't need to change -
// the role vocabulary itself now has one home in @/shared/rbac, shared with
// the auth feature's session-permission model.
export const USER_ROLES = ROLES;
export type UserRole = Role;

// Never carries a credential - this is the read/display shape only.
export interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  roles: UserRole[];
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateUserDto {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  roles: UserRole[];
  isActive: boolean;
  /** Mock backend only - a real API would never accept/store this as plaintext. */
  password: string;
}

// No password here - password changes go through their own dedicated flow,
// not general profile editing (mirrors how the auth feature already
// separates login from changePassword).
export interface UpdateUserDto {
  username?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  roles?: UserRole[];
  isActive?: boolean;
}

export type UserSortField = 'fullName' | 'username' | 'email' | 'createdAt';

export interface UserQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: UserRole;
  isActive?: boolean;
  sortBy?: UserSortField;
  sortDirection?: 'asc' | 'desc';
}
