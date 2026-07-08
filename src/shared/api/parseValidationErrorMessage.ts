import type { ValidationError } from '@/shared/types/api.types';

export interface ValidationErrorResponseBody {
  errors?: ValidationError[] | Record<string, string[]>;
}

/**
 * Flattens a 400 response body's `errors` (array or field-keyed record shape)
 * into a single human-readable message. Returns null when there is nothing to report.
 */
export const parseValidationErrorMessage = (data: ValidationErrorResponseBody | undefined): string | null => {
  const errors = data?.errors;
  if (!errors) {
    return null;
  }

  if (Array.isArray(errors)) {
    return errors.map((e) => `${e.property}: ${e.message}`).join('; ');
  }

  return Object.entries(errors)
    .map(([field, messages]) => `${field}: ${messages.join(', ')}`)
    .join('; ');
};
