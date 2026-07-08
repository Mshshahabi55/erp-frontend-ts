import { z } from 'zod';

// Used for both create and edit - WarehouseForm doesn't relax any
// requirements when editing, so one schema covers both. No .default() on
// isActive - RHF's defaultValues supplies it; a zod default makes the
// resolver's input/output types diverge and breaks useForm's generic typing.
export const warehouseFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name must not exceed 100 characters'),
  code: z.string()
    .min(2, 'Code must be at least 2 characters')
    .max(20, 'Code must not exceed 20 characters')
    .regex(/^[A-Z0-9-]+$/, 'Use uppercase letters, numbers, and hyphens only'),
  address: z.string().min(2, 'Address is required').max(200, 'Address must not exceed 200 characters'),
  city: z.string().min(2, 'City is required').max(100, 'City must not exceed 100 characters'),
  state: z.string().min(2, 'State is required').max(100, 'State must not exceed 100 characters'),
  managerName: z.string().min(2, 'Manager name must be at least 2 characters').max(100, 'Manager name must not exceed 100 characters'),
  phone: z.string()
    .min(10, 'Phone number must be at least 10 characters')
    .regex(/^[0-9+\-\s()]+$/, 'Invalid phone format'),
  capacity: z.number().min(1, 'Capacity must be greater than 0').int('Capacity must be a whole number'),
  isActive: z.boolean(),
});

export type WarehouseFormData = z.infer<typeof warehouseFormSchema>;
