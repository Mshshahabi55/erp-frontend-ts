import { Box, MenuItem, Select, SelectChangeEvent, FormControl, InputLabel } from '@mui/material';
import { SearchBar } from '@/shared/components';
import type { Customer } from '@/features/customers/types/customer.types';
import type { OrderStatus } from '../../types/order.types';

export type OrderStatusFilter = OrderStatus | 'all';
// Not annotated with OrderStatusFilter - that would stop
// `statusFilter === ALL_ORDER_STATUSES ? undefined : statusFilter` from
// narrowing 'all' out of the else branch.
export const ALL_ORDER_STATUSES = 'all';
export const ALL_ORDER_CUSTOMERS = 'all';

const STATUS_OPTIONS: OrderStatus[] = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

interface OrderFiltersProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  onSearchClear: () => void;
  customers: Customer[];
  customerFilter: string;
  onCustomerFilterChange: (value: string) => void;
  statusFilter: OrderStatusFilter;
  onStatusFilterChange: (value: OrderStatusFilter) => void;
}

export const OrderFilters = ({
  searchValue,
  onSearchChange,
  onSearchClear,
  customers,
  customerFilter,
  onCustomerFilterChange,
  statusFilter,
  onStatusFilterChange,
}: OrderFiltersProps) => {
  const handleCustomerChange = (event: SelectChangeEvent) => {
    onCustomerFilterChange(event.target.value);
  };

  const handleStatusChange = (event: SelectChangeEvent<OrderStatusFilter>) => {
    onStatusFilterChange(event.target.value as OrderStatusFilter);
  };

  return (
    <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
      <Box sx={{ flexGrow: 1, minWidth: 240 }}>
        <SearchBar
          value={searchValue}
          onChange={onSearchChange}
          onClear={onSearchClear}
          placeholder="Search by order number..."
        />
      </Box>
      <FormControl size="small" sx={{ minWidth: 180 }}>
        <InputLabel id="order-customer-filter-label">Customer</InputLabel>
        <Select
          labelId="order-customer-filter-label"
          label="Customer"
          value={customerFilter}
          onChange={handleCustomerChange}
        >
          <MenuItem value={ALL_ORDER_CUSTOMERS}>All customers</MenuItem>
          {customers.map((customer) => (
            <MenuItem key={customer.id} value={customer.id}>
              {customer.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl size="small" sx={{ minWidth: 160 }}>
        <InputLabel id="order-status-filter-label">Status</InputLabel>
        <Select
          labelId="order-status-filter-label"
          label="Status"
          value={statusFilter}
          onChange={handleStatusChange}
        >
          <MenuItem value={ALL_ORDER_STATUSES}>All statuses</MenuItem>
          {STATUS_OPTIONS.map((status) => (
            <MenuItem key={status} value={status}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};
