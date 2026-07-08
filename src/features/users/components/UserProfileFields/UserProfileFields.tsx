import { Control, Controller, FieldErrors, Path, UseFormRegister } from 'react-hook-form';
import { Grid, TextField, MenuItem, Select, Chip, Box, FormControlLabel, Switch } from '@mui/material';
import { USER_ROLES } from '../../types/user.types';
import type { UserProfileFormData } from '../../types/user.schema';

const ROLE_LABELS: Record<string, string> = {
  admin: 'Admin',
  manager: 'Manager',
  staff: 'Staff',
};

interface UserProfileFieldsProps<T extends UserProfileFormData> {
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
  control: Control<T>;
  disabled?: boolean;
}

/**
 * The fields shared by both create and edit forms. Generic over T so each
 * form keeps its own concrete react-hook-form type (CreateUserFormData vs
 * UpdateUserFormData) without duplicating this JSX between them.
 */
export function UserProfileFields<T extends UserProfileFormData>({
  register,
  errors,
  control,
  disabled,
}: UserProfileFieldsProps<T>) {
  return (
    <>
      <Grid size={{ xs: 12, md: 6 }}>
        <TextField
          fullWidth
          label="Username"
          required
          disabled={disabled}
          {...register('username' as Path<T>)}
          error={!!errors.username}
          helperText={errors.username?.message as string | undefined}
        />
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <TextField
          fullWidth
          type="email"
          label="Email Address"
          required
          disabled={disabled}
          {...register('email' as Path<T>)}
          error={!!errors.email}
          helperText={errors.email?.message as string | undefined}
        />
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <TextField
          fullWidth
          label="First Name"
          required
          disabled={disabled}
          {...register('firstName' as Path<T>)}
          error={!!errors.firstName}
          helperText={errors.firstName?.message as string | undefined}
        />
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <TextField
          fullWidth
          label="Last Name"
          required
          disabled={disabled}
          {...register('lastName' as Path<T>)}
          error={!!errors.lastName}
          helperText={errors.lastName?.message as string | undefined}
        />
      </Grid>

      <Grid size={{ xs: 12 }}>
        <Controller
          control={control}
          name={'roles' as Path<T>}
          render={({ field }) => (
            <Select
              multiple
              fullWidth
              displayEmpty
              disabled={disabled}
              value={(field.value as string[]) ?? []}
              onChange={(event) => {
                const value = event.target.value;
                field.onChange(typeof value === 'string' ? value.split(',') : value);
              }}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                  {(selected as string[]).length === 0
                    ? 'Select roles'
                    : (selected as string[]).map((role) => (
                        <Chip key={role} label={ROLE_LABELS[role] ?? role} size="small" />
                      ))}
                </Box>
              )}
            >
              {USER_ROLES.map((role) => (
                <MenuItem key={role} value={role}>
                  {ROLE_LABELS[role]}
                </MenuItem>
              ))}
            </Select>
          )}
        />
        {errors.roles && (
          <Box sx={{ color: 'error.main', typography: 'caption', mt: 0.5, ml: 1.5 }}>
            {errors.roles.message as string}
          </Box>
        )}
      </Grid>

      <Grid size={{ xs: 12 }}>
        <Controller
          control={control}
          name={'isActive' as Path<T>}
          render={({ field }) => (
            <FormControlLabel
              control={<Switch checked={!!field.value} onChange={(event) => field.onChange(event.target.checked)} disabled={disabled} />}
              label="Active User"
            />
          )}
        />
      </Grid>
    </>
  );
}
