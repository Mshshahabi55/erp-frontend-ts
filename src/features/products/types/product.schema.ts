import { z } from 'zod';

// Used for both the create and edit product forms - ProductForm doesn't
// relax any requirements when editing, so one schema covers both.
export const productFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  sku: z.string().min(3, 'SKU must be at least 3 characters'),
  category: z.string().min(2, 'Category must be at least 2 characters'),
  price: z.number().min(0, 'Price must be greater than or equal to 0'),
  stock: z.number().min(0, 'Stock must be greater than or equal to 0').int(),
  unit: z.string().min(1, 'Unit is required'),
  description: z.string().optional(),
  // No .default() - see CustomerForm for why; RHF's defaultValues supplies it.
  isAvailable: z.boolean(),
});

export type ProductFormData = z.infer<typeof productFormSchema>;
