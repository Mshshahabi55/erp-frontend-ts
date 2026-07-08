import { Dialog, DialogTitle, DialogContent } from '@mui/material';
import { UserCreateForm } from '../UserForm/UserCreateForm';
import { UserEditForm } from '../UserForm/UserEditForm';
import type { User } from '../../types/user.types';
import type { CreateUserFormData, UpdateUserFormData } from '../../types/user.schema';

interface UserFormDialogProps {
  open: boolean;
  user: User | null;
  isSubmitting: boolean;
  onCreate: (data: CreateUserFormData) => Promise<void>;
  onUpdate: (data: UpdateUserFormData) => Promise<void>;
  onClose: () => void;
}

export const UserFormDialog = ({ open, user, isSubmitting, onCreate, onUpdate, onClose }: UserFormDialogProps) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{user ? 'Edit User' : 'Add New User'}</DialogTitle>
      <DialogContent>
        {user ? (
          <UserEditForm
            defaultValues={{
              username: user.username,
              email: user.email,
              firstName: user.firstName,
              lastName: user.lastName,
              roles: user.roles,
              isActive: user.isActive,
            }}
            onSubmit={onUpdate}
            isSubmitting={isSubmitting}
            onCancel={onClose}
          />
        ) : (
          <UserCreateForm onSubmit={onCreate} isSubmitting={isSubmitting} onCancel={onClose} />
        )}
      </DialogContent>
    </Dialog>
  );
};
