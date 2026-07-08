import { useNavigate, useParams } from 'react-router-dom';
import { Box, Typography, Paper, Alert, Button } from '@mui/material';
import { Refresh } from '@mui/icons-material';
import { LoadingSpinner } from '@/shared/components';
import { useCustomers } from '@/features/customers/hooks/useCustomers';
import { useProducts } from '@/features/products/hooks/useProducts';
import { OrderForm } from '../components/OrderForm/OrderForm';
import { useOrder } from '../hooks/useOrder';
import { useUpdateOrder } from '../hooks/useOrderMutations';
import type { OrderFormData } from '../types/order.schema';

export const OrderEditPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: order, isLoading, error, refetch } = useOrder(id);
  const { data: customersResponse } = useCustomers({ limit: 100 });
  const { data: productsResponse } = useProducts({ limit: 100 });
  const updateMutation = useUpdateOrder();

  const customers = customersResponse?.data ?? [];
  const products = productsResponse?.data ?? [];

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

  const handleSubmit = async (formData: OrderFormData) => {
    await updateMutation.mutateAsync({ id: order.id, formData, products, status: order.status });
    navigate(`/orders/${order.id}`);
  };

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
          Edit Order {order.orderNumber}
        </Typography>
      </Box>

      <Paper sx={{ borderRadius: 3 }}>
        <OrderForm
          defaultValues={{
            customerId: order.customerId,
            orderDate: order.orderDate.slice(0, 10),
            items: order.items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
            })),
            discountPercent: order.discountPercent,
            taxPercent: order.taxPercent,
          }}
          customers={customers}
          products={products}
          onSubmit={handleSubmit}
          isSubmitting={updateMutation.isPending}
          submitText="Update Order"
          onCancel={() => navigate(`/orders/${order.id}`)}
        />
      </Paper>
    </Box>
  );
};

export default OrderEditPage;
