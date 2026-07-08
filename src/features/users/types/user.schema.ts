import { z } from 'zod';
import { USER_ROLES } from './user.types';

// Shared by both create and edit - defined once so the two forms can't
// validate the same fields differently.
export const userProfileSchema = z.object({
  username: z.string()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username must not exceed 30 characters')
    .regex(/^[a-zA-Z0-9_.-]+$/, 'Only letters, numbers, dots, underscores, and hyphens are allowed'),
  email: z.string().email('Invalid email address'),
  firstName: z.string().min(2, 'First name must be at least 2 characters').max(50, 'First name must not exceed 50 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters').max(50, 'Last name must not exceed 50 characters'),
  roles: z.array(z.enum(USER_ROLES)).min(1, 'Assign at least one role'),
  // No .default() here - RHF's defaultValues already supplies it, and a zod
  // default makes the resolver's input/output types diverge (isActive
  // becomes optional-in/required-out), which breaks useForm's generic typing.
  isActive: z.boolean(),
});

export const createUserFormSchema = userProfileSchema
  .extend({
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(1, 'Please confirm the password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const updateUserFormSchema = userProfileSchema;

export type UserProfileFormData = z.infer<typeof userProfileSchema>;
export type CreateUserFormData = z.infer<typeof createUserFormSchema>;
export type UpdateUserFormData = z.infer<typeof updateUserFormSchema>;
