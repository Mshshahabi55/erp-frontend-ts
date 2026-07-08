import { z } from 'zod';

// Used for both the create and edit supplier forms - SupplierForm doesn't
// relax any requirements when editing, so one schema covers both.
export const supplierFormSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must not exceed 100 characters'),
  contactName: z.string()
    .min(2, 'Contact name must be at least 2 characters')
    .max(100, 'Contact name must not exceed 100 characters'),
  email: z.string()
    .email('Invalid email address'),
  phone: z.string()
    .min(10, 'Phone number must be at least 10 characters')
    .regex(/^[0-9+\-\s()]+$/, 'Invalid phone format'),
  address: z.string()
    .min(2, 'Address is required')
    .max(200, 'Address must not exceed 200 characters'),
  // No .default() - see CustomerForm for why; RHF's defaultValues supplies it.
  isActive: z.boolean(),
});

export type SupplierFormData = z.infer<typeof supplierFormSchema>;
