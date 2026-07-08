import { Fragment } from 'react';
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
  Checkbox,
  Typography,
  Tooltip,
} from '@mui/material';
import { ROLES, type RolePermissionMap } from '@/shared/rbac';
import { PERMISSION_GROUPS, getPermissionActionLabel } from '../../utils/permissionGroups';

const ROLE_LABELS: Record<string, string> = {
  admin: 'Admin',
  manager: 'Manager',
  staff: 'Staff',
};

interface RolePermissionMatrixProps {
  value: RolePermissionMap;
  onChange: (map: RolePermissionMap) => void;
  disabled?: boolean;
}

export const RolePermissionMatrix = ({ value, onChange, disabled }: RolePermissionMatrixProps) => {
  const handleToggle = (role: (typeof ROLES)[number], permission: string, checked: boolean) => {
    const current = value[role] ?? [];
    const next = checked ? [...current, permission] : current.filter((p) => p !== permission);
    onChange({ ...value, [role]: next });
  };

  return (
    <TableContainer component={Paper} variant="outlined">
      <Table size="small" aria-label="Role permission matrix">
        <TableHead>
          <TableRow>
            <TableCell>Permission</TableCell>
            {ROLES.map((role) => (
              <TableCell key={role} align="center">
                {ROLE_LABELS[role]}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {PERMISSION_GROUPS.map((group) => (
            <Fragment key={group.resource}>
              <TableRow>
                <TableCell colSpan={ROLES.length + 1} sx={{ bgcolor: 'action.hover' }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                    {group.resource}
                  </Typography>
                </TableCell>
              </TableRow>
              {group.permissions.map((permission) => (
                <TableRow key={permission}>
                  <TableCell sx={{ pl: 3 }}>{getPermissionActionLabel(permission)}</TableCell>
                  {ROLES.map((role) => {
                    const isAdmin = role === 'admin';
                    const checked = isAdmin ? true : (value[role] ?? []).includes(permission);
                    const checkbox = (
                      <Checkbox
                        checked={checked}
                        disabled={disabled || isAdmin}
                        onChange={(event) => handleToggle(role, permission, event.target.checked)}
                        slotProps={{ input: { 'aria-label': `${ROLE_LABELS[role]}: ${getPermissionActionLabel(permission)} ${group.resource}` } }}
                      />
                    );
                    return (
                      <TableCell key={role} align="center">
                        {isAdmin ? (
                          <Tooltip title="Admin always has full access">
                            <span>{checkbox}</span>
                          </Tooltip>
                        ) : (
                          checkbox
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </Fragment>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
