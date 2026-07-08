import { z } from 'zod';

export const companySettingsFormSchema = z.object({
  name: z.string().min(2, 'Company name must be at least 2 characters').max(150, 'Company name must not exceed 150 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string()
    .min(10, 'Phone number must be at least 10 characters')
    .regex(/^[0-9+\-\s()]+$/, 'Invalid phone format'),
  address: z.string().min(2, 'Address is required').max(200, 'Address must not exceed 200 characters'),
  taxId: z.string().min(2, 'Tax ID is required').max(50, 'Tax ID must not exceed 50 characters'),
});

export type CompanySettingsFormData = z.infer<typeof companySettingsFormSchema>;

export const applicationSettingsFormSchema = z.object({
  defaultPageSize: z.number().int('Must be a whole number').min(5, 'Must be at least 5').max(100, 'Must not exceed 100'),
  lowStockThreshold: z.number().int('Must be a whole number').min(0, 'Must be 0 or greater'),
  defaultCurrency: z.enum(['USD', 'EUR', 'GBP']),
  dateFormat: z.enum(['short', 'long', 'iso']),
});

export type ApplicationSettingsFormData = z.infer<typeof applicationSettingsFormSchema>;
