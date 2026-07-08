import { ConfirmDialog } from '@/shared/components';
import type { Customer } from '../../types/customer.types';

interface CustomerDeleteDialogProps {
  open: boolean;
  customer: Customer | null;
  isDeleting: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const CustomerDeleteDialog = ({ open, customer, isDeleting, onConfirm, onCancel }: CustomerDeleteDialogProps) => {
  return (
    <ConfirmDialog
      open={open}
      title="Delete Customer"
      message={`Are you sure you want to delete "${customer?.name}"?`}
      confirmText="Delete"
      cancelText="Cancel"
      onConfirm={onConfirm}
      onCancel={onCancel}
      loading={isDeleting}
    />
  );
};
