import { apiClient } from '@/shared/api';
import { ROLES, type RolePermissionMap } from '@/shared/rbac';
import type { RolePermissionRecord } from '../types/rolePermission.types';

const RESOURCE_PATH = '/rolePermissions';

// Not built on createJsonServerResource - that factory assumes a paginated,
// arbitrarily-sized collection. This is a fixed, always-exactly-3-row config
// table (one row per role), so a plain get-all/update-each pair is simpler
// and more honest about what this resource actually is.
export const rolePermissionService = {
  async getAll(): Promise<RolePermissionRecord[]> {
    const response = await apiClient.get<RolePermissionRecord[]>(RESOURCE_PATH);
    return response.data;
  },

  /** Persists every role's permission list. json-server has no bulk-update endpoint, so each role is PATCHed individually. */
  async updateAll(map: RolePermissionMap): Promise<RolePermissionRecord[]> {
    return Promise.all(
      ROLES.map(async (role) => {
        const response = await apiClient.patch<RolePermissionRecord>(`${RESOURCE_PATH}/${role}`, {
          permissions: map[role],
        });
        return response.data;
      })
    );
  },
};
