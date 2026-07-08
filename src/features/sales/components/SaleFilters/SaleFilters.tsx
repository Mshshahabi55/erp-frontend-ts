import { Box, MenuItem, Select, SelectChangeEvent, FormControl, InputLabel } from '@mui/material';
import { SearchBar } from '@/shared/components';
import type { Customer } from '@/features/customers/types/customer.types';
import type { SaleStatus } from '../../types/sale.types';

export type SaleStatusFilter = SaleStatus | 'all';

// Not annotated with SaleStatusFilter - that would stop
// `statusFilter === ALL_SALE_STATUSES ? undefined : statusFilter` from
// narrowing 'all' out of the else branch.
export const ALL_SALE_STATUSES = 'all';
export const ALL_SALE_CUSTOMERS = 'all';

interface SaleFiltersProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  onSearchClear: () => void;
  customers: Customer[];
  customerFilter: string;
  onCustomerFilterChange: (value: string) => void;
  statusFilter: SaleStatusFilter;
  onStatusFilterChange: (value: SaleStatusFilter) => void;
}

export const SaleFilters = ({
  searchValue,
  onSearchChange,
  onSearchClear,
  customers,
  customerFilter,
  onCustomerFilterChange,
  statusFilter,
  onStatusFilterChange,
}: SaleFiltersProps) => {
  const handleCustomerChange = (event: SelectChangeEvent) => {
    onCustomerFilterChange(event.target.value);
  };

  const handleStatusChange = (event: SelectChangeEvent<SaleStatusFilter>) => {
    onStatusFilterChange(event.target.value as SaleStatusFilter);
  };

  return (
    <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
      <Box sx={{ flexGrow: 1, minWidth: 240 }}>
        <SearchBar
          value={searchValue}
          onChange={onSearchChange}
          onClear={onSearchClear}
          placeholder="Search by invoice number..."
        />
      </Box>
      <FormControl size="small" sx={{ minWidth: 180 }}>
        <InputLabel id="sale-customer-filter-label">Customer</InputLabel>
        <Select
          labelId="sale-customer-filter-label"
          label="Customer"
          value={customerFilter}
          onChange={handleCustomerChange}
        >
          <MenuItem value={ALL_SALE_CUSTOMERS}>All customers</MenuItem>
          {customers.map((customer) => (
            <MenuItem key={customer.id} value={customer.id}>
              {customer.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl size="small" sx={{ minWidth: 160 }}>
        <InputLabel id="sale-status-filter-label">Status</InputLabel>
        <Select
          labelId="sale-status-filter-label"
          label="Status"
          value={statusFilter}
          onChange={handleStatusChange}
        >
          <MenuItem value={ALL_SALE_STATUSES}>All statuses</MenuItem>
          <MenuItem value="pending">Pending</MenuItem>
          <MenuItem value="completed">Completed</MenuItem>
          <MenuItem value="cancelled">Cancelled</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
};
