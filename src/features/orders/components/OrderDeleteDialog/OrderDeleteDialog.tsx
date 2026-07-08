import { ConfirmDialog } from '@/shared/components';
import type { Order } from '../../types/order.types';

interface OrderDeleteDialogProps {
  open: boolean;
  order: Order | null;
  isDeleting: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const OrderDeleteDialog = ({ open, order, isDeleting, onConfirm, onCancel }: OrderDeleteDialogProps) => {
  return (
    <ConfirmDialog
      open={open}
      title="Delete Order"
      message={`Are you sure you want to delete order "${order?.orderNumber}"? This cannot be undone.`}
      confirmText="Delete"
      cancelText="Cancel"
      onConfirm={onConfirm}
      onCancel={onCancel}
      loading={isDeleting}
    />
  );
};
