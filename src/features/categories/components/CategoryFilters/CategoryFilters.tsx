import { Box, MenuItem, Select, SelectChangeEvent, FormControl, InputLabel } from '@mui/material';
import { SearchBar } from '@/shared/components';

export type CategoryStatusFilter = 'all' | 'active' | 'inactive';

// Not annotated with CategoryStatusFilter - that would stop
// `statusFilter === ALL_CATEGORY_STATUSES ? undefined : statusFilter` from
// narrowing 'all' out of the else branch (see the Employees/Orders/Sales/Users
// sentinel-narrowing fix from the RBAC refactor).
export const ALL_CATEGORY_STATUSES = 'all';

interface CategoryFiltersProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  onSearchClear: () => void;
  statusFilter: CategoryStatusFilter;
  onStatusFilterChange: (value: CategoryStatusFilter) => void;
}

export const CategoryFilters = ({
  searchValue,
  onSearchChange,
  onSearchClear,
  statusFilter,
  onStatusFilterChange,
}: CategoryFiltersProps) => {
  const handleStatusChange = (event: SelectChangeEvent<CategoryStatusFilter>) => {
    onStatusFilterChange(event.target.value as CategoryStatusFilter);
  };

  return (
    <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
      <Box sx={{ flexGrow: 1, minWidth: 240 }}>
        <SearchBar
          value={searchValue}
          onChange={onSearchChange}
          onClear={onSearchClear}
          placeholder="Search by name or description..."
        />
      </Box>
      <FormControl size="small" sx={{ minWidth: 160 }}>
        <InputLabel id="category-status-filter-label">Status</InputLabel>
        <Select labelId="category-status-filter-label" label="Status" value={statusFilter} onChange={handleStatusChange}>
          <MenuItem value={ALL_CATEGORY_STATUSES}>All statuses</MenuItem>
          <MenuItem value="active">Active</MenuItem>
          <MenuItem value="inactive">Inactive</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
};
