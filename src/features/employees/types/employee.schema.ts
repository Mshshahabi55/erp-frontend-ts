import { z } from 'zod';
import { DEPARTMENTS } from './employee.types';

// Used for both the create and edit employee forms - EmployeeForm doesn't
// relax any requirements when editing, so one schema covers both.
// fullName isn't collected here - it's derived from firstName + lastName
// when the form is submitted (see useCreateEmployee/useUpdateEmployee), so
// there's no separate field that could drift out of sync with the name.
export const employeeFormSchema = z.object({
  firstName: z.string()
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must not exceed 50 characters'),
  lastName: z.string()
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must not exceed 50 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string()
    .min(10, 'Phone number must be at least 10 characters')
    .regex(/^[0-9+\-\s()]+$/, 'Invalid phone format'),
  department: z.enum(DEPARTMENTS),
  position: z.string()
    .min(2, 'Position must be at least 2 characters')
    .max(100, 'Position must not exceed 100 characters'),
  hireDate: z.string().min(1, 'Hire date is required'),
  // No .default() - see CustomerForm for why; RHF's defaultValues supplies it.
  isActive: z.boolean(),
});

export type EmployeeFormData = z.infer<typeof employeeFormSchema>;
