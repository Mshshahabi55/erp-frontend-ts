import { CrudForm } from '@/shared/components';
import { productFormSchema, ProductFormData } from '../../types/product.schema';
import type { Category } from '@/features/categories/types/category.types';

interface ProductFormProps {
  defaultValues?: Partial<ProductFormData>;
  categories: Category[];
  onSubmit: (data: ProductFormData) => Promise<void>;
  isLoading?: boolean;
  submitText?: string;
  onCancel?: () => void;
}

export const ProductForm = ({
  defaultValues,
  categories,
  onSubmit,
  isLoading,
  submitText = 'Save Product',
  onCancel,
}: ProductFormProps) => {
  const categoryNames = categories.map((category) => category.name);
  // A product's existing category may be inactive, or (pre-migration) a
  // freeform value that was never a real category - keep it selectable so
  // editing the product doesn't silently blank the field or fail validation.
  const currentCategory = defaultValues?.category;
  const categoryOptions = currentCategory && !categoryNames.includes(currentCategory)
    ? [...categoryNames, currentCategory]
    : categoryNames;

  return (
    <CrudForm<ProductFormData>
      schema={productFormSchema}
      defaultValues={{ description: '', isAvailable: true, ...defaultValues }}
      onSubmit={onSubmit}
      isLoading={isLoading}
      onCancel={onCancel}
      submitText={submitText}
      title="Product Information"
      fields={[
        {
          name: 'name',
          label: 'Product Name',
          type: 'text',
          gridSize: 6,
          required: true,
        },
        {
          name: 'sku',
          label: 'SKU',
          type: 'text',
          gridSize: 6,
          required: true,
        },
        {
          name: 'category',
          label: 'Category',
          type: 'select',
          gridSize: 6,
          required: true,
          options: categoryOptions.map((name) => ({ value: name, label: name })),
        },
        {
          name: 'unit',
          label: 'Unit',
          type: 'text',
          gridSize: 6,
          required: true,
        },
        {
          name: 'price',
          label: 'Price ($)',
          type: 'number',
          gridSize: 6,
          required: true,
        },
        {
          name: 'stock',
          label: 'Stock Quantity',
          type: 'number',
          gridSize: 6,
          required: true,
        },
        {
          name: 'description',
          label: 'Description',
          type: 'textarea',
          gridSize: 12,
        },
        {
          name: 'isAvailable',
          label: 'Available for Sale',
          type: 'switch',
          gridSize: 12,
        },
      ]}
    />
  );
};
