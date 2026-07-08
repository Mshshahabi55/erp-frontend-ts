import { z } from 'zod';

// No .default() on isActive - RHF's defaultValues supplies it; a zod default
// makes the resolver's input/output types diverge and breaks useForm's
// generic typing (see CrudForm/Users form fix from the RBAC refactor).
export const categoryFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name must not exceed 50 characters'),
  description: z.string().max(500, 'Description must not exceed 500 characters').optional(),
  isActive: z.boolean(),
});

export type CategoryFormData = z.infer<typeof categoryFormSchema>;
