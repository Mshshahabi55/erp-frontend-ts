import { z } from 'zod';

// performedBy isn't collected here - it's filled in from the signed-in user
// when the movement is submitted (see useCreateStockMovement).
export const stockMovementFormSchema = z.object({
  productId: z.string().min(1, 'Product is required'),
  type: z.enum(['in', 'out', 'adjustment']),
  quantity: z.number().int('Quantity must be a whole number').min(0, 'Quantity must be greater than or equal to 0'),
  reason: z.string().min(2, 'Reason is required').max(200, 'Reason must not exceed 200 characters'),
});

export type StockMovementFormData = z.infer<typeof stockMovementFormSchema>;
