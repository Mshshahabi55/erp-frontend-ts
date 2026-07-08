import { CrudForm } from '@/shared/components';
import { companySettingsFormSchema, CompanySettingsFormData } from '../../types/settings.schema';

interface CompanySettingsFormProps {
  defaultValues: Partial<CompanySettingsFormData>;
  onSubmit: (data: CompanySettingsFormData) => Promise<void>;
  isLoading?: boolean;
}

export const CompanySettingsForm = ({ defaultValues, onSubmit, isLoading }: CompanySettingsFormProps) => {
  return (
    <CrudForm<CompanySettingsFormData>
      schema={companySettingsFormSchema}
      defaultValues={defaultValues}
      onSubmit={onSubmit}
      isLoading={isLoading}
      submitText="Save Company Settings"
      title="Company Information"
      fields={[
        { name: 'name', label: 'Company Name', type: 'text', gridSize: 6, required: true },
        { name: 'taxId', label: 'Tax ID', type: 'text', gridSize: 6, required: true },
        { name: 'email', label: 'Email Address', type: 'email', gridSize: 6, required: true },
        { name: 'phone', label: 'Phone', type: 'text', gridSize: 6, required: true },
        { name: 'address', label: 'Address', type: 'textarea', gridSize: 12, required: true },
      ]}
    />
  );
};
