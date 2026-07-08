import { ConfirmDialog } from '@/shared/components';
import type { Sale } from '../../types/sale.types';

interface SaleDeleteDialogProps {
  open: boolean;
  sale: Sale | null;
  isDeleting: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const SaleDeleteDialog = ({ open, sale, isDeleting, onConfirm, onCancel }: SaleDeleteDialogProps) => {
  return (
    <ConfirmDialog
      open={open}
      title="Delete Sale"
      message={`Are you sure you want to delete sale "${sale?.invoiceNumber}"?`}
      confirmText="Delete"
      cancelText="Cancel"
      onConfirm={onConfirm}
      onCancel={onCancel}
      loading={isDeleting}
    />
  );
};
