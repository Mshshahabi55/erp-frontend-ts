import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Grid, TextField, MenuItem, Button, CircularProgress } from '@mui/material';
import { orderFormSchema, OrderFormData } from '../../types/order.schema';
import { calculateOrderTotals } from '../../utils/orderCalculations';
import { OrderItemsEditor } from '../OrderItemsEditor/OrderItemsEditor';
import { OrderTotalsSummary } from '../OrderTotalsSummary/OrderTotalsSummary';
import type { Customer } from '@/features/customers/types/customer.types';
import type { Product } from '@/features/products/types/product.types';

const DEFAULT_ITEM = { productId: '', quantity: 1, unitPrice: 0 };

const buildDefaultValues = (defaultValues?: Partial<OrderFormData>): OrderFormData => ({
  customerId: defaultValues?.customerId ?? '',
  orderDate: defaultValues?.orderDate ?? new Date().toISOString().slice(0, 10),
  items: defaultValues?.items?.length ? defaultValues.items : [DEFAULT_ITEM],
  discountPercent: defaultValues?.discountPercent ?? 0,
  taxPercent: defaultValues?.taxPercent ?? 0,
});

interface OrderFormProps {
  defaultValues?: Partial<OrderFormData>;
  customers: Customer[];
  products: Product[];
  onSubmit: (data: OrderFormData) => Promise<void>;
  isSubmitting?: boolean;
  submitText?: string;
  onCancel: () => void;
}

export const OrderForm = ({
  defaultValues,
  customers,
  products,
  onSubmit,
  isSubmitting = false,
  submitText = 'Save Order',
  onCancel,
}: OrderFormProps) => {
  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<OrderFormData>({
    resolver: zodResolver(orderFormSchema),
    defaultValues: buildDefaultValues(defaultValues),
  });

  const watchedItems = watch('items');
  const discountPercent = watch('discountPercent');
  const taxPercent = watch('taxPercent');

  const totals = useMemo(
    () => calculateOrderTotals(watchedItems ?? [], discountPercent || 0, taxPercent || 0),
    [watchedItems, discountPercent, taxPercent]
  );

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ p: 2 }}>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            select
            fullWidth
            label="Customer"
            required
            disabled={isSubmitting}
            {...register('customerId')}
            error={!!errors.customerId}
            helperText={errors.customerId?.message}
          >
            {customers.map((customer) => (
              <MenuItem key={customer.id} value={customer.id}>
                {customer.name}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            type="date"
            fullWidth
            label="Order Date"
            required
            disabled={isSubmitting}
            slotProps={{ inputLabel: { shrink: true } }}
            {...register('orderDate')}
            error={!!errors.orderDate}
            helperText={errors.orderDate?.message}
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <OrderItemsEditor
            control={control}
            register={register}
            errors={errors}
            watch={watch}
            setValue={setValue}
            products={products}
            disabled={isSubmitting}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            type="number"
            fullWidth
            label="Discount (%)"
            disabled={isSubmitting}
            slotProps={{ htmlInput: { min: 0, max: 100, step: 0.1 } }}
            {...register('discountPercent', { valueAsNumber: true })}
            error={!!errors.discountPercent}
            helperText={errors.discountPercent?.message}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            type="number"
            fullWidth
            label="Tax (%)"
            disabled={isSubmitting}
            slotProps={{ htmlInput: { min: 0, max: 100, step: 0.1 } }}
            {...register('taxPercent', { valueAsNumber: true })}
            error={!!errors.taxPercent}
            helperText={errors.taxPercent?.message}
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <OrderTotalsSummary totals={totals} discountPercent={discountPercent || 0} taxPercent={taxPercent || 0} />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
            <Button onClick={onCancel} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={isSubmitting}
              startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : undefined}
            >
              {isSubmitting ? 'Saving...' : submitText}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};
