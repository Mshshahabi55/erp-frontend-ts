import { useNavigate } from 'react-router-dom';
import { Box, Typography, Paper } from '@mui/material';
import { useCustomers } from '@/features/customers/hooks/useCustomers';
import { useProducts } from '@/features/products/hooks/useProducts';
import { OrderForm } from '../components/OrderForm/OrderForm';
import { useCreateOrder } from '../hooks/useOrderMutations';
import type { OrderFormData } from '../types/order.schema';

export const OrderCreatePage = () => {
  const navigate = useNavigate();
  const { data: customersResponse } = useCustomers({ limit: 100 });
  const { data: productsResponse } = useProducts({ limit: 100 });
  const createMutation = useCreateOrder();

  const customers = customersResponse?.data ?? [];
  const products = productsResponse?.data ?? [];

  const handleSubmit = async (formData: OrderFormData) => {
    const order = await createMutation.mutateAsync({ formData, products });
    navigate(`/orders/${order.id}`);
  };

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
          New Order
        </Typography>
      </Box>

      <Paper sx={{ borderRadius: 3 }}>
        <OrderForm
          customers={customers}
          products={products}
          onSubmit={handleSubmit}
          isSubmitting={createMutation.isPending}
          submitText="Create Order"
          onCancel={() => navigate('/orders')}
        />
      </Paper>
    </Box>
  );
};

export default OrderCreatePage;
