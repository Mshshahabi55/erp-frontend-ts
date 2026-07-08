import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Grid, TextField, Button, CircularProgress } from '@mui/material';
import { createUserFormSchema, CreateUserFormData } from '../../types/user.schema';
import { UserProfileFields } from '../UserProfileFields/UserProfileFields';

interface UserCreateFormProps {
  onSubmit: (data: CreateUserFormData) => Promise<void>;
  isSubmitting?: boolean;
  onCancel: () => void;
}

export const UserCreateForm = ({ onSubmit, isSubmitting = false, onCancel }: UserCreateFormProps) => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserFormSchema),
    defaultValues: { username: '', email: '', firstName: '', lastName: '', roles: [], isActive: true, password: '', confirmPassword: '' },
  });

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ p: 2 }}>
      <Grid container spacing={3}>
        <UserProfileFields register={register} errors={errors} control={control} disabled={isSubmitting} />

        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            type="password"
            label="Password"
            required
            disabled={isSubmitting}
            {...register('password')}
            error={!!errors.password}
            helperText={errors.password?.message}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            type="password"
            label="Confirm Password"
            required
            disabled={isSubmitting}
            {...register('confirmPassword')}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword?.message}
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
            <Button onClick={onCancel} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={isSubmitting}
              startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : undefined}
            >
              {isSubmitting ? 'Saving...' : 'Create User'}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};
