import { z } from 'zod';

// Used for both the create and edit customer forms - CustomerForm doesn't
// relax any requirements when editing, so one schema covers both.
export const customerFormSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must not exceed 100 characters'),
  email: z.string()
    .email('Invalid email address'),
  phone: z.string()
    .min(10, 'Phone number must be at least 10 characters')
    .regex(/^[0-9+\-\s()]+$/, 'Invalid phone format'),
  company: z.string()
    .max(100, 'Company name must not exceed 100 characters')
    .optional(),
  address: z.string()
    .max(200, 'Address must not exceed 200 characters')
    .optional(),
  // No .default() - a zod default makes the resolver's input/output types
  // diverge and breaks useForm's generic typing (CrudForm passes schema
  // generically). RHF's defaultValues supplies the initial value instead
  // (see CustomerForm).
  isActive: z.boolean(),
});

export type CustomerFormData = z.infer<typeof customerFormSchema>;
