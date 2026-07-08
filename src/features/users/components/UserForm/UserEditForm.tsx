import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Grid, Button, CircularProgress } from '@mui/material';
import { updateUserFormSchema, UpdateUserFormData } from '../../types/user.schema';
import { UserProfileFields } from '../UserProfileFields/UserProfileFields';

interface UserEditFormProps {
  defaultValues: UpdateUserFormData;
  onSubmit: (data: UpdateUserFormData) => Promise<void>;
  isSubmitting?: boolean;
  onCancel: () => void;
}

export const UserEditForm = ({ defaultValues, onSubmit, isSubmitting = false, onCancel }: UserEditFormProps) => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateUserFormData>({
    resolver: zodResolver(updateUserFormSchema),
    defaultValues,
  });

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ p: 2 }}>
      <Grid container spacing={3}>
        <UserProfileFields register={register} errors={errors} control={control} disabled={isSubmitting} />

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
              {isSubmitting ? 'Saving...' : 'Update User'}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};
