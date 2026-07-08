import { CrudForm } from '@/shared/components';
import { customerFormSchema, CustomerFormData } from '../../types/customer.schema';

interface CustomerFormProps {
  defaultValues?: Partial<CustomerFormData>;
  onSubmit: (data: CustomerFormData) => Promise<void>;
  isLoading?: boolean;
  submitText?: string;
  onCancel?: () => void;
}

export const CustomerForm = ({
  defaultValues,
  onSubmit,
  isLoading,
  submitText = 'Save Customer',
  onCancel,
}: CustomerFormProps) => {
  return (
    <CrudForm<CustomerFormData>
      schema={customerFormSchema}
      defaultValues={{ company: '', address: '', isActive: true, ...defaultValues }}
      onSubmit={onSubmit}
      isLoading={isLoading}
      onCancel={onCancel}
      submitText={submitText}
      title="Customer Information"
      fields={[
        {
          name: 'name',
          label: 'Full Name',
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
          name: 'company',
          label: 'Company Name',
          type: 'text',
          gridSize: 6,
        },
        {
          name: 'address',
          label: 'Address',
          type: 'textarea',
          gridSize: 12,
        },
        {
          name: 'isActive',
          label: 'Active Customer',
          type: 'switch',
          gridSize: 12,
        },
      ]}
    />
  );
};
