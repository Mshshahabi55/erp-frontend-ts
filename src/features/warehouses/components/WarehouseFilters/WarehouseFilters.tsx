import { Box, MenuItem, Select, SelectChangeEvent, FormControl, InputLabel } from '@mui/material';
import { SearchBar } from '@/shared/components';

export type WarehouseStatusFilter = 'all' | 'active' | 'inactive';

// Not annotated with WarehouseStatusFilter - that would stop
// `statusFilter === ALL_WAREHOUSE_STATUSES ? undefined : statusFilter` from
// narrowing 'all' out of the else branch.
export const ALL_WAREHOUSE_STATUSES = 'all';

interface WarehouseFiltersProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  onSearchClear: () => void;
  statusFilter: WarehouseStatusFilter;
  onStatusFilterChange: (value: WarehouseStatusFilter) => void;
}

export const WarehouseFilters = ({
  searchValue,
  onSearchChange,
  onSearchClear,
  statusFilter,
  onStatusFilterChange,
}: WarehouseFiltersProps) => {
  const handleStatusChange = (event: SelectChangeEvent<WarehouseStatusFilter>) => {
    onStatusFilterChange(event.target.value as WarehouseStatusFilter);
  };

  return (
    <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
      <Box sx={{ flexGrow: 1, minWidth: 240 }}>
        <SearchBar
          value={searchValue}
          onChange={onSearchChange}
          onClear={onSearchClear}
          placeholder="Search by name, code, city, or manager..."
        />
      </Box>
      <FormControl size="small" sx={{ minWidth: 160 }}>
        <InputLabel id="warehouse-status-filter-label">Status</InputLabel>
        <Select labelId="warehouse-status-filter-label" label="Status" value={statusFilter} onChange={handleStatusChange}>
          <MenuItem value={ALL_WAREHOUSE_STATUSES}>All statuses</MenuItem>
          <MenuItem value="active">Active</MenuItem>
          <MenuItem value="inactive">Inactive</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
};
