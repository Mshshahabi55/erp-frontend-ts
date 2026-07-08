import { useQuery } from '@tanstack/react-query';
import type { RolePermissionMap } from '@/shared/rbac';
import { rolePermissionService } from '../services/rolePermissionService';
import type { RolePermissionRecord } from '../types/rolePermission.types';

export const rolePermissionKeys = {
  all: ['rolePermissions'] as const,
};

export const toRolePermissionMap = (records: RolePermissionRecord[]): RolePermissionMap =>
  records.reduce((map, record) => {
    map[record.id] = record.permissions;
    return map;
  }, {} as RolePermissionMap);

export const useRolePermissions = () => {
  return useQuery({
    queryKey: rolePermissionKeys.all,
    queryFn: rolePermissionService.getAll,
    select: toRolePermissionMap,
  });
};
