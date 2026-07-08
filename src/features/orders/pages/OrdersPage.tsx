import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button } from '@mui/material';
import { Add } from '@mui/icons-material';
import { useDebounce } from '@/shared/hooks';
import { useCustomers } from '@/features/customers/hooks/useCustomers';
import { OrderFilters, ALL_ORDER_STATUSES, ALL_ORDER_CUSTOMERS, type OrderStatusFilter } from '../components/OrderFilters/OrderFilters';
import { OrderTable } from '../components/OrderTable/OrderTable';
import { OrderStatusDialog } from '../components/OrderStatusDialog/OrderStatusDialog';
import { OrderDeleteDialog } from '../components/OrderDeleteDialog/OrderDeleteDialog';
import { useOrders } from '../hooks/useOrders';
import { useUpdateOrderStatus } from '../hooks/useOrderStatusMutation';
import { useDeleteOrder } from '../hooks/useOrderMutations';
import type { Order, OrderSortField, OrderStatus } from '../types/order.types';

export const OrdersPage = () => {
  const navigate = useNavigate();

  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [searchInput, setSearchInput] = useState('');
  const [customerFilter, setCustomerFilter] = useState(ALL_ORDER_CUSTOMERS);
  const [statusFilter, setStatusFilter] = useState<OrderStatusFilter>(ALL_ORDER_STATUSES);
  const [sortBy, setSortBy] = useState<OrderSortField>('orderDate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const debouncedSearch = useDebounce(searchInput, 500);

  const { data: customersResponse } = useCustomers({ limit: 100 });
  const customers = useMemo(() => customersResponse?.data ?? [], [customersResponse]);
  const customerNameById = useMemo(
    () => new Map(customers.map((customer) => [customer.id, customer.name])),
    [customers]
  );

  const { data: response, isLoading, error, refetch } = useOrders({
    page: page + 1,
    limit: pageSize,
    search: debouncedSearch || undefined,
    customerId: customerFilter === ALL_ORDER_CUSTOMERS ? undefined : customerFilter,
    status: statusFilter === ALL_ORDER_STATUSES ? undefined : statusFilter,
    sortBy,
    sortDirection,
  });

  const orders = response?.data ?? [];
  const totalCount = response?.total ?? 0;

  const updateStatusMutation = useUpdateOrderStatus();
  const deleteMutation = useDeleteOrder();

  const handleSortChange = (field: OrderSortField) => {
    if (sortBy === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(field);
      setSortDirection('asc');
    }
  };

  const handleCustomerFilterChange = (value: string) => {
    setCustomerFilter(value);
    setPage(0);
  };

  const handleStatusFilterChange = (value: OrderStatusFilter) => {
    setStatusFilter(value);
    setPage(0);
  };

  const handleChangeStatus = (order: Order) => {
    setSelectedOrder(order);
    setIsStatusDialogOpen(true);
  };

  const handleConfirmStatusChange = (status: OrderStatus) => {
    if (selectedOrder) {
      updateStatusMutation.mutate(
        { id: selectedOrder.id, status },
        { onSuccess: () => setIsStatusDialogOpen(false) }
      );
    }
  };

  const handleDelete = (order: Order) => {
    setSelectedOrder(order);
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedOrder) {
      await deleteMutation.mutateAsync(selectedOrder.id);
      setIsDeleteOpen(false);
      setSelectedOrder(null);
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
          Orders
        </Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => navigate('/orders/new')}>
          Add Order
        </Button>
      </Box>

      <OrderFilters
        searchValue={searchInput}
        onSearchChange={setSearchInput}
        onSearchClear={() => setSearchInput('')}
        customers={customers}
        customerFilter={customerFilter}
        onCustomerFilterChange={handleCustomerFilterChange}
        statusFilter={statusFilter}
        onStatusFilterChange={handleStatusFilterChange}
      />

      <OrderTable
        orders={orders}
        customerNameById={customerNameById}
        isLoading={isLoading}
        error={error}
        totalCount={totalCount}
        page={page}
        pageSize={pageSize}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
        onRetry={refetch}
        sortBy={sortBy}
        sortDirection={sortDirection}
        onSortChange={handleSortChange}
        onView={(order) => navigate(`/orders/${order.id}`)}
        onEdit={(order) => navigate(`/orders/${order.id}/edit`)}
        onChangeStatus={handleChangeStatus}
        onDelete={handleDelete}
        isDeleting={deleteMutation.isPending}
      />

      <OrderStatusDialog
        open={isStatusDialogOpen}
        order={selectedOrder}
        isUpdating={updateStatusMutation.isPending}
        onConfirm={handleConfirmStatusChange}
        onCancel={() => setIsStatusDialogOpen(false)}
      />

      <OrderDeleteDialog
        open={isDeleteOpen}
        order={selectedOrder}
        isDeleting={deleteMutation.isPending}
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsDeleteOpen(false)}
      />
    </Box>
  );
};

export default OrdersPage;
