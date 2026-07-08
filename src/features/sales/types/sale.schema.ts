import { z } from 'zod';

// Used for both the create and edit sale forms - SaleForm doesn't relax any
// requirements when editing, so one schema covers both.
export const saleFormSchema = z.object({
  invoiceNumber: z.string()
    .min(3, 'Invoice number must be at least 3 characters')
    .max(50, 'Invoice number must not exceed 50 characters'),
  customerId: z.string().min(1, 'Customer is required'),
  totalAmount: z.number().min(0, 'Total amount must be greater than or equal to 0'),
  status: z.enum(['pending', 'completed', 'cancelled']),
  saleDate: z.string().min(1, 'Sale date is required'),
});

export type SaleFormData = z.infer<typeof saleFormSchema>;
