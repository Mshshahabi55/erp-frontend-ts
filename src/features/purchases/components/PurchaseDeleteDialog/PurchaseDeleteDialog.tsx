import { ConfirmDialog } from '@/shared/components';
import type { Purchase } from '../../types/purchase.types';

interface PurchaseDeleteDialogProps {
  open: boolean;
  purchase: Purchase | null;
  isDeleting: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const PurchaseDeleteDialog = ({ open, purchase, isDeleting, onConfirm, onCancel }: PurchaseDeleteDialogProps) => {
  return (
    <ConfirmDialog
      open={open}
      title="Delete Purchase"
      message={`Are you sure you want to delete purchase "${purchase?.purchaseNumber}"?`}
      confirmText="Delete"
      cancelText="Cancel"
      onConfirm={onConfirm}
      onCancel={onCancel}
      loading={isDeleting}
    />
  );
};
