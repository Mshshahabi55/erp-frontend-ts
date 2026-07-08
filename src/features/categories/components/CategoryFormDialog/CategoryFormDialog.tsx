import { Dialog, DialogTitle, DialogContent } from '@mui/material';
import { CategoryForm } from '../CategoryForm/CategoryForm';
import type { Category } from '../../types/category.types';
import type { CategoryFormData } from '../../types/category.schema';

interface CategoryFormDialogProps {
  open: boolean;
  category: Category | null;
  isSubmitting: boolean;
  onSubmit: (data: CategoryFormData) => Promise<void>;
  onClose: () => void;
}

const toDefaultValues = (category: Category): Partial<CategoryFormData> => ({
  name: category.name,
  description: category.description,
  isActive: category.isActive,
});

export const CategoryFormDialog = ({ open, category, isSubmitting, onSubmit, onClose }: CategoryFormDialogProps) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{category ? 'Edit Category' : 'Add New Category'}</DialogTitle>
      <DialogContent>
        <CategoryForm
          defaultValues={category ? toDefaultValues(category) : undefined}
          onSubmit={onSubmit}
          isLoading={isSubmitting}
          submitText={category ? 'Update Category' : 'Save Category'}
          onCancel={onClose}
        />
      </DialogContent>
    </Dialog>
  );
};
