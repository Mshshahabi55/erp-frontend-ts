import { Box, MenuItem, Select, SelectChangeEvent, FormControl, InputLabel } from '@mui/material';
import { SearchBar } from '@/shared/components';
import { USER_ROLES, type UserRole } from '../../types/user.types';

export type UserRoleFilter = UserRole | 'all';
export type UserStatusFilter = 'all' | 'active' | 'inactive';

// Not annotated with the wide filter types - that would stop the
// `x === ALL_USER_ROLES ? undefined : x` ternaries from narrowing 'all' out.
export const ALL_USER_ROLES = 'all';
export const ALL_USER_STATUSES = 'all';

interface UserFiltersProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  onSearchClear: () => void;
  roleFilter: UserRoleFilter;
  onRoleFilterChange: (value: UserRoleFilter) => void;
  statusFilter: UserStatusFilter;
  onStatusFilterChange: (value: UserStatusFilter) => void;
}

export const UserFilters = ({
  searchValue,
  onSearchChange,
  onSearchClear,
  roleFilter,
  onRoleFilterChange,
  statusFilter,
  onStatusFilterChange,
}: UserFiltersProps) => {
  const handleRoleChange = (event: SelectChangeEvent<UserRoleFilter>) => {
    onRoleFilterChange(event.target.value as UserRoleFilter);
  };

  const handleStatusChange = (event: SelectChangeEvent<UserStatusFilter>) => {
    onStatusFilterChange(event.target.value as UserStatusFilter);
  };

  return (
    <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
      <Box sx={{ flexGrow: 1, minWidth: 240 }}>
        <SearchBar
          value={searchValue}
          onChange={onSearchChange}
          onClear={onSearchClear}
          placeholder="Search by name, username, or email..."
        />
      </Box>
      <FormControl size="small" sx={{ minWidth: 160 }}>
        <InputLabel id="user-role-filter-label">Role</InputLabel>
        <Select labelId="user-role-filter-label" label="Role" value={roleFilter} onChange={handleRoleChange}>
          <MenuItem value={ALL_USER_ROLES}>All roles</MenuItem>
          {USER_ROLES.map((role) => (
            <MenuItem key={role} value={role}>
              {role.charAt(0).toUpperCase() + role.slice(1)}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl size="small" sx={{ minWidth: 160 }}>
        <InputLabel id="user-status-filter-label">Status</InputLabel>
        <Select labelId="user-status-filter-label" label="Status" value={statusFilter} onChange={handleStatusChange}>
          <MenuItem value={ALL_USER_STATUSES}>All statuses</MenuItem>
          <MenuItem value="active">Active</MenuItem>
          <MenuItem value="inactive">Inactive</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
};
