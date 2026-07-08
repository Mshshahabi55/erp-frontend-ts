import { ConfirmDialog } from '@/shared/components';
import type { User } from '../../types/user.types';

interface UserDeleteDialogProps {
  open: boolean;
  user: User | null;
  isDeleting: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const UserDeleteDialog = ({ open, user, isDeleting, onConfirm, onCancel }: UserDeleteDialogProps) => {
  return (
    <ConfirmDialog
      open={open}
      title="Delete User"
      message={`Are you sure you want to delete "${user?.fullName}"?`}
      confirmText="Delete"
      cancelText="Cancel"
      onConfirm={onConfirm}
      onCancel={onCancel}
      loading={isDeleting}
    />
  );
};
