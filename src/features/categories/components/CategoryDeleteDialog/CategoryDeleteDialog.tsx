import { ConfirmDialog } from '@/shared/components';
import type { Category } from '../../types/category.types';

interface CategoryDeleteDialogProps {
  open: boolean;
  category: Category | null;
  isDeleting: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const CategoryDeleteDialog = ({ open, category, isDeleting, onConfirm, onCancel }: CategoryDeleteDialogProps) => {
  return (
    <ConfirmDialog
      open={open}
      title="Delete Category"
      message={`Are you sure you want to delete "${category?.name}"? Products already assigned to this category will keep their existing category text.`}
      confirmText="Delete"
      cancelText="Cancel"
      onConfirm={onConfirm}
      onCancel={onCancel}
      loading={isDeleting}
    />
  );
};
