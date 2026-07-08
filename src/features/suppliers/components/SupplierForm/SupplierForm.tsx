import { CrudForm } from '@/shared/components';
import { supplierFormSchema, SupplierFormData } from '../../types/supplier.schema';

interface SupplierFormProps {
  defaultValues?: Partial<SupplierFormData>;
  onSubmit: (data: SupplierFormData) => Promise<void>;
  isLoading?: boolean;
  submitText?: string;
  onCancel?: () => void;
}

export const SupplierForm = ({
  defaultValues,
  onSubmit,
  isLoading,
  submitText = 'Save Supplier',
  onCancel,
}: SupplierFormProps) => {
  return (
    <CrudForm<SupplierFormData>
      schema={supplierFormSchema}
      defaultValues={{ isActive: true, ...defaultValues }}
      onSubmit={onSubmit}
      isLoading={isLoading}
      onCancel={onCancel}
      submitText={submitText}
      title="Supplier Information"
      fields={[
        {
          name: 'name',
          label: 'Company Name',
          type: 'text',
          gridSize: 6,
          required: true,
        },
        {
          name: 'contactName',
          label: 'Contact Name',
          type: 'text',
          gridSize: 6,
          required: true,
        },
        {
          name: 'email',
          label: 'Email Address',
          type: 'email',
          gridSize: 6,
          required: true,
        },
        {
          name: 'phone',
          label: 'Phone Number',
          type: 'text',
          gridSize: 6,
          required: true,
        },
        {
          name: 'address',
          label: 'Address',
          type: 'textarea',
          gridSize: 12,
          required: true,
        },
        {
          name: 'isActive',
          label: 'Active Supplier',
          type: 'switch',
          gridSize: 12,
        },
      ]}
    />
  );
};
