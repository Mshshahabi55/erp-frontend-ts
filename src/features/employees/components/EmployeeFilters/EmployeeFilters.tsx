import { Box, MenuItem, Select, SelectChangeEvent, FormControl, InputLabel } from '@mui/material';
import { SearchBar } from '@/shared/components';
import { DEPARTMENTS, type Department } from '../../types/employee.types';

export type EmployeeStatusFilter = 'all' | 'active' | 'inactive';
export type EmployeeDepartmentFilter = Department | 'all';

// Deliberately not annotated with the wide filter type - that would stop
// `departmentFilter === ALL_DEPARTMENTS ? undefined : departmentFilter`
// from narrowing 'all' out of the else branch.
export const ALL_EMPLOYEE_STATUSES = 'all';
export const ALL_DEPARTMENTS = 'all';

interface EmployeeFiltersProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  onSearchClear: () => void;
  departmentFilter: EmployeeDepartmentFilter;
  onDepartmentFilterChange: (value: EmployeeDepartmentFilter) => void;
  statusFilter: EmployeeStatusFilter;
  onStatusFilterChange: (value: EmployeeStatusFilter) => void;
}

export const EmployeeFilters = ({
  searchValue,
  onSearchChange,
  onSearchClear,
  departmentFilter,
  onDepartmentFilterChange,
  statusFilter,
  onStatusFilterChange,
}: EmployeeFiltersProps) => {
  const handleDepartmentChange = (event: SelectChangeEvent<EmployeeDepartmentFilter>) => {
    onDepartmentFilterChange(event.target.value as EmployeeDepartmentFilter);
  };

  const handleStatusChange = (event: SelectChangeEvent<EmployeeStatusFilter>) => {
    onStatusFilterChange(event.target.value as EmployeeStatusFilter);
  };

  return (
    <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
      <Box sx={{ flexGrow: 1, minWidth: 240 }}>
        <SearchBar
          value={searchValue}
          onChange={onSearchChange}
          onClear={onSearchClear}
          placeholder="Search by name, email, or position..."
        />
      </Box>
      <FormControl size="small" sx={{ minWidth: 180 }}>
        <InputLabel id="employee-department-filter-label">Department</InputLabel>
        <Select
          labelId="employee-department-filter-label"
          label="Department"
          value={departmentFilter}
          onChange={handleDepartmentChange}
        >
          <MenuItem value={ALL_DEPARTMENTS}>All departments</MenuItem>
          {DEPARTMENTS.map((department) => (
            <MenuItem key={department} value={department}>
              {department}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl size="small" sx={{ minWidth: 160 }}>
        <InputLabel id="employee-status-filter-label">Status</InputLabel>
        <Select
          labelId="employee-status-filter-label"
          label="Status"
          value={statusFilter}
          onChange={handleStatusChange}
        >
          <MenuItem value={ALL_EMPLOYEE_STATUSES}>All statuses</MenuItem>
          <MenuItem value="active">Active</MenuItem>
          <MenuItem value="inactive">Inactive</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
};
