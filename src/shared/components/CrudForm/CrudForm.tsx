import { DefaultValues, FieldErrors, FieldValues, Path, Resolver, UseFormRegister, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ZodSchema } from 'zod';
import {
  Box,
  Button,
  CircularProgress,
  FormControlLabel,
  Grid,
  MenuItem,
  Switch,
  TextField,
  Typography,
} from '@mui/material';

export type CrudFieldType =
  | 'text'
  | 'email'
  | 'number'
  | 'textarea'
  | 'switch'
  | 'select'
  | 'date';

export interface CrudFieldOption {
  value: string;
  label: string;
}

export interface CrudField<T extends FieldValues> {
  name: Path<T>;
  label: string;
  type: CrudFieldType;
  gridSize?: number;
  placeholder?: string;
  required?: boolean;
  /** Options for type: 'select'. */
  options?: CrudFieldOption[];
}

interface CrudFormFieldProps<T extends FieldValues> {
  field: CrudField<T>;
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
  defaultValues?: Partial<T>;
  disabled: boolean;
}

/** Renders a single field per its CrudFieldType - split out from CrudForm so form orchestration and per-field rendering aren't tangled in one function. */
function CrudFormField<T extends FieldValues>({ field, register, errors, defaultValues, disabled }: CrudFormFieldProps<T>) {
  if (field.type === 'switch') {
    return (
      <Grid size={{ xs: 12 }}>
        <FormControlLabel
          control={
            <Switch
              {...register(field.name)}
              defaultChecked={defaultValues?.[field.name] as boolean}
            />
          }
          label={field.label}
        />
      </Grid>
    );
  }

  const registerOptions = field.type === 'number' ? { valueAsNumber: true } : {};

  return (
    <Grid size={{ xs: 12, md: field.gridSize ?? 6 }}>
      <TextField
        {...register(field.name, registerOptions)}
        select={field.type === 'select'}
        fullWidth
        disabled={disabled}
        label={field.label}
        placeholder={field.placeholder}
        required={field.required}
        type={
          field.type === 'number'
            ? 'number'
            : field.type === 'email'
            ? 'email'
            : field.type === 'date'
            ? 'date'
            : 'text'
        }
        slotProps={field.type === 'date' ? { inputLabel: { shrink: true } } : undefined}
        multiline={field.type === 'textarea'}
        rows={field.type === 'textarea' ? 3 : undefined}
        error={!!errors[field.name]}
        helperText={errors[field.name]?.message as string | undefined}
      >
        {field.type === 'select' &&
          field.options?.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
      </TextField>
    </Grid>
  );
}

interface CrudFormProps<T extends FieldValues> {
  schema: ZodSchema<T>;
  defaultValues?: Partial<T>;
  fields: CrudField<T>[];
  onSubmit: (data: T) => Promise<void>;
  isLoading?: boolean;
  submitText?: string;
  title?: string;
  onCancel?: () => void;
}

export function CrudForm<T extends FieldValues>({
  schema,
  defaultValues,
  fields,
  onSubmit,
  isLoading = false,
  submitText = 'Save',
  title,
  onCancel,
}: CrudFormProps<T>) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<T>({
    // zodResolver's overloads can't resolve against a *generic* schema type
    // (they need a concrete literal schema to infer input/output shapes, and
    // fail overload resolution entirely otherwise - a wrapping cast can't
    // rescue that). The runtime behavior is correct regardless of what TS
    // can verify here, so this one boundary is intentionally erased rather
    // than fighting zod's internal generic structure indefinitely.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- documented generic-wrapper exception, see comment above
    resolver: zodResolver(schema as any) as unknown as Resolver<T>,
    defaultValues: defaultValues as DefaultValues<T> | undefined,
  });

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ p: 2 }}>
      <Grid container spacing={3}>
        {title && (
          <Grid size={{ xs: 12 }}>
            <Typography variant="h6">{title}</Typography>
          </Grid>
        )}

        {fields.map((field) => (
          <CrudFormField
            key={String(field.name)}
            field={field}
            register={register}
            errors={errors}
            defaultValues={defaultValues}
            disabled={isLoading}
          />
        ))}

        <Grid size={{ xs: 12 }}>
          <Box
            sx={{
              mt: 2,
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 2,
            }}
          >
            {onCancel && (
              <Button onClick={onCancel} disabled={isLoading}>
                Cancel
              </Button>
            )}

            <Button
              type="submit"
              variant="contained"
              disabled={isLoading}
              startIcon={
                isLoading ? <CircularProgress size={20} color="inherit" /> : undefined
              }
            >
              {isLoading ? 'Saving...' : submitText}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
