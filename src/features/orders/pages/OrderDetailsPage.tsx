import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Alert,
  Button,
  Chip,
  Grid,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Divider,
} from '@mui/material';
import { Refresh, Edit, Delete, Sync, ArrowBack } from '@mui/icons-material';
import { LoadingSpinner } from '@/shared/components';
import { currencyFormatter, dateFormatter } from '@/shared/utils';
import { useCustomers } from '@/features/customers/hooks/useCustomers';
import { useOrder } from '../hooks/useOrder';
import { useDeleteOrder } from '../hooks/useOrderMutations';
import { useUpdateOrderStatus } from '../hooks/useOrderStatusMutation';
import { OrderTotalsSummary } from '../components/OrderTotalsSummary/OrderTotalsSummary';
import { OrderStatusDialog } from '../components/OrderStatusDialog/OrderStatusDialog';
import { OrderDeleteDialog } from '../components/OrderDeleteDialog/OrderDeleteDialog';
import { getOrderStatusColor, getOrderStatusLabel } from '../utils/orderStatusStyles';
import { isTerminalStatus } from '../utils/orderStatusTransitions';
import type { OrderStatus } from '../types/order.types';

export const OrderDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const { data: order, isLoading, error, refetch } = useOrder(id);
  const { data: customersResponse } = useCustomers({ limit: 100 });
  const customerNameById = useMemo(
    () => new Map((customersResponse?.data ?? []).map((customer) => [customer.id, customer.name])),
    [customersResponse]
  );

  const updateStatusMutation = useUpdateOrderStatus();
  const deleteMutation = useDeleteOrder();

  if (isLoading) {
    return <LoadingSpinner message="Loading order..." />;
  }

  if (error || !order) {
    return (
      <Alert
        severity="error"
        action={
          <Button color="inherit" size="small" onClick={() => refetch()} startIcon={<Refresh />}>
            Retry
          </Button>
        }
      >
        Failed to load this order.
      </Alert>
    );
  }

  const handleConfirmStatusChange = (status: OrderStatus) => {
    updateStatusMutation.mutate({ id: order.id, status }, { onSuccess: () => setIsStatusDialogOpen(false) });
  };

  const handleConfirmDelete = async () => {
    await deleteMutation.mutateAsync(order.id);
    navigate('/orders');
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button startIcon={<ArrowBack />} onClick={() => navigate('/orders')}>
            Back
          </Button>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
            {order.orderNumber}
          </Typography>
          <Chip label={getOrderStatusLabel(order.status)} color={getOrderStatusColor(order.status)} />
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<Sync />}
            disabled={isTerminalStatus(order.status)}
            onClick={() => setIsStatusDialogOpen(true)}
          >
            Change Status
          </Button>
          <Button variant="outlined" startIcon={<Edit />} onClick={() => navigate(`/orders/${order.id}/edit`)}>
            Edit
          </Button>
          <Button variant="outlined" color="error" startIcon={<Delete />} onClick={() => setIsDeleteOpen(true)}>
            Delete
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Customer
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 600, mb: 2 }}>
              {customerNameById.get(order.customerId) ?? 'Unknown customer'}
            </Typography>
            <Typography variant="subtitle2" color="text.secondary">
              Order Date
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 600 }}>
              {dateFormatter.short(order.orderDate)}
            </Typography>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 8 }}>
          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h6" component="h2" sx={{ fontWeight: 600, mb: 2 }}>
              Items
            </Typography>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Product</TableCell>
                  <TableCell>SKU</TableCell>
                  <TableCell align="right">Quantity</TableCell>
                  <TableCell align="right">Unit Price</TableCell>
                  <TableCell align="right">Line Total</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {order.items.map((item, index) => (
                  <TableRow key={`${item.productId}-${index}`}>
                    <TableCell>{item.productName}</TableCell>
                    <TableCell>{item.sku}</TableCell>
                    <TableCell align="right">{item.quantity}</TableCell>
                    <TableCell align="right">{currencyFormatter.usd(item.unitPrice)}</TableCell>
                    <TableCell align="right">{currencyFormatter.usd(item.lineTotal)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <Divider sx={{ my: 3 }} />

            <OrderTotalsSummary
              totals={{
                subtotal: order.subtotal,
                discountAmount: order.discountAmount,
                taxAmount: order.taxAmount,
                totalAmount: order.totalAmount,
              }}
              discountPercent={order.discountPercent}
              taxPercent={order.taxPercent}
            />
          </Paper>
        </Grid>
      </Grid>

      <OrderStatusDialog
        open={isStatusDialogOpen}
        order={order}
        isUpdating={updateStatusMutation.isPending}
        onConfirm={handleConfirmStatusChange}
        onCancel={() => setIsStatusDialogOpen(false)}
      />

      <OrderDeleteDialog
        open={isDeleteOpen}
        order={order}
        isDeleting={deleteMutation.isPending}
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsDeleteOpen(false)}
      />
    </Box>
  );
};

export default OrderDetailsPage;
