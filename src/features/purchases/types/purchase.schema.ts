import { z } from 'zod';

// Used for both the create and edit purchase forms - PurchaseForm doesn't
// relax any requirements when editing, so one schema covers both.
export const purchaseFormSchema = z.object({
  purchaseNumber: z.string()
    .min(3, 'Purchase number must be at least 3 characters')
    .max(50, 'Purchase number must not exceed 50 characters'),
  supplierId: z.string().min(1, 'Supplier is required'),
  totalAmount: z.number().min(0, 'Total amount must be greater than or equal to 0'),
  status: z.enum(['pending', 'received', 'cancelled']),
  purchaseDate: z.string().min(1, 'Purchase date is required'),
});

export type PurchaseFormData = z.infer<typeof purchaseFormSchema>;
