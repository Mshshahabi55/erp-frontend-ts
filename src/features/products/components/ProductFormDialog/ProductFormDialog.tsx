import { Dialog, DialogTitle, DialogContent } from '@mui/material';
import { ProductForm } from '../ProductForm/ProductForm';
import type { Product } from '../../types/product.types';
import type { ProductFormData } from '../../types/product.schema';
import type { Category } from '@/features/categories/types/category.types';

interface ProductFormDialogProps {
  open: boolean;
  product: Product | null;
  categories: Category[];
  isSubmitting: boolean;
  onSubmit: (data: ProductFormData) => Promise<void>;
  onClose: () => void;
}

const toDefaultValues = (product: Product): Partial<ProductFormData> => ({
  name: product.name,
  sku: product.sku,
  category: product.category,
  price: product.price,
  stock: product.stock,
  unit: product.unit,
  description: product.description || '',
  isAvailable: product.isAvailable,
});

export const ProductFormDialog = ({ open, product, categories, isSubmitting, onSubmit, onClose }: ProductFormDialogProps) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{product ? 'Edit Product' : 'Add New Product'}</DialogTitle>
      <DialogContent>
        <ProductForm
          defaultValues={product ? toDefaultValues(product) : undefined}
          categories={categories}
          onSubmit={onSubmit}
          isLoading={isSubmitting}
          submitText={product ? 'Update Product' : 'Save Product'}
          onCancel={onClose}
        />
      </DialogContent>
    </Dialog>
  );
};
