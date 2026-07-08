import { CrudForm } from '@/shared/components';
import { categoryFormSchema, CategoryFormData } from '../../types/category.schema';

interface CategoryFormProps {
  defaultValues?: Partial<CategoryFormData>;
  onSubmit: (data: CategoryFormData) => Promise<void>;
  isLoading?: boolean;
  submitText?: string;
  onCancel?: () => void;
}

export const CategoryForm = ({
  defaultValues,
  onSubmit,
  isLoading,
  submitText = 'Save Category',
  onCancel,
}: CategoryFormProps) => {
  return (
    <CrudForm<CategoryFormData>
      schema={categoryFormSchema}
      defaultValues={{ isActive: true, ...defaultValues }}
      onSubmit={onSubmit}
      isLoading={isLoading}
      onCancel={onCancel}
      submitText={submitText}
      title="Category Information"
      fields={[
        {
          name: 'name',
          label: 'Category Name',
          type: 'text',
          gridSize: 12,
          required: true,
        },
        {
          name: 'description',
          label: 'Description',
          type: 'textarea',
          gridSize: 12,
        },
        {
          name: 'isActive',
          label: 'Active',
          type: 'switch',
          gridSize: 12,
        },
      ]}
    />
  );
};
