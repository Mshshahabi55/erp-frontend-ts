import { ConfirmDialog } from '@/shared/components';
import type { Warehouse } from '../../types/warehouse.types';

interface WarehouseDeleteDialogProps {
  open: boolean;
  warehouse: Warehouse | null;
  isDeleting: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const WarehouseDeleteDialog = ({ open, warehouse, isDeleting, onConfirm, onCancel }: WarehouseDeleteDialogProps) => {
  return (
    <ConfirmDialog
      open={open}
      title="Delete Warehouse"
      message={`Are you sure you want to delete "${warehouse?.name}" (${warehouse?.code})? This cannot be undone.`}
      confirmText="Delete"
      cancelText="Cancel"
      onConfirm={onConfirm}
      onCancel={onCancel}
      loading={isDeleting}
    />
  );
};
