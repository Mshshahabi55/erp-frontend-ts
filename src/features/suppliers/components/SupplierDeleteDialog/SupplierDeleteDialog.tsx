import { ConfirmDialog } from '@/shared/components';
import type { Supplier } from '../../types/supplier.types';

interface SupplierDeleteDialogProps {
  open: boolean;
  supplier: Supplier | null;
  isDeleting: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const SupplierDeleteDialog = ({ open, supplier, isDeleting, onConfirm, onCancel }: SupplierDeleteDialogProps) => {
  return (
    <ConfirmDialog
      open={open}
      title="Delete Supplier"
      message={`Are you sure you want to delete "${supplier?.name}"?`}
      confirmText="Delete"
      cancelText="Cancel"
      onConfirm={onConfirm}
      onCancel={onCancel}
      loading={isDeleting}
    />
  );
};
