import { z } from 'zod';

// productName/sku/lineTotal aren't collected here - they're derived from the
// selected product and quantity*unitPrice when the form is submitted (see
// useCreateOrder/useUpdateOrder), so they can't drift out of sync.
export const orderItemFormSchema = z.object({
  productId: z.string().min(1, 'Product is required'),
  quantity: z.number().int('Quantity must be a whole number').min(1, 'Quantity must be at least 1'),
  unitPrice: z.number().min(0, 'Unit price must be greater than or equal to 0'),
});

// Status isn't part of this schema - new orders always start 'pending', and
// status changes go through the dedicated status-transition flow instead of
// general editing (see orderStatusTransitions.ts).
export const orderFormSchema = z.object({
  customerId: z.string().min(1, 'Customer is required'),
  orderDate: z.string().min(1, 'Order date is required'),
  items: z.array(orderItemFormSchema).min(1, 'Add at least one item'),
  discountPercent: z.number().min(0, 'Discount cannot be negative').max(100, 'Discount cannot exceed 100%'),
  taxPercent: z.number().min(0, 'Tax cannot be negative').max(100, 'Tax cannot exceed 100%'),
});

export type OrderItemFormData = z.infer<typeof orderItemFormSchema>;
export type OrderFormData = z.infer<typeof orderFormSchema>;
