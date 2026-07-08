import { useMutation, useQueryClient } from '@tanstack/react-query';
import { notify } from '@/shared/notifications';
import { setRolePermissions, type RolePermissionMap } from '@/shared/rbac';
import { rolePermissionService } from '../services/rolePermissionService';
import { rolePermissionKeys } from './useRolePermissions';

export const useUpdateRolePermissions = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (map: RolePermissionMap) => rolePermissionService.updateAll(map),
    onSuccess: (_records, map) => {
      // Applies immediately to this session's live hasPermission checks -
      // without this, a saved change would only take effect after a reload
      // (when AuthProvider re-fetches on init).
      setRolePermissions(map);
      queryClient.invalidateQueries({ queryKey: rolePermissionKeys.all });
      notify.success('Role permissions updated successfully!');
    },
    onError: (error) => {
      notify.error(error, 'Failed to update role permissions');
    },
  });
};
