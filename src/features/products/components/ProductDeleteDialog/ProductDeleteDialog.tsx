import { ConfirmDialog } from '@/shared/components';
import type { Product } from '../../types/product.types';

interface ProductDeleteDialogProps {
  open: boolean;
  product: Product | null;
  isDeleting: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ProductDeleteDialog = ({ open, product, isDeleting, onConfirm, onCancel }: ProductDeleteDialogProps) => {
  return (
    <ConfirmDialog
      open={open}
      title="Delete Product"
      message={`Are you sure you want to delete "${product?.name}"?`}
      confirmText="Delete"
      cancelText="Cancel"
      onConfirm={onConfirm}
      onCancel={onCancel}
      loading={isDeleting}
    />
  );
};
