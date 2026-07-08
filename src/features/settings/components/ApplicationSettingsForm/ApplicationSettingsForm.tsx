import { CrudForm } from '@/shared/components';
import { applicationSettingsFormSchema, ApplicationSettingsFormData } from '../../types/settings.schema';

interface ApplicationSettingsFormProps {
  defaultValues: Partial<ApplicationSettingsFormData>;
  onSubmit: (data: ApplicationSettingsFormData) => Promise<void>;
  isLoading?: boolean;
}

export const ApplicationSettingsForm = ({ defaultValues, onSubmit, isLoading }: ApplicationSettingsFormProps) => {
  return (
    <CrudForm<ApplicationSettingsFormData>
      schema={applicationSettingsFormSchema}
      defaultValues={defaultValues}
      onSubmit={onSubmit}
      isLoading={isLoading}
      submitText="Save Application Settings"
      title="Application Configuration"
      fields={[
        { name: 'defaultPageSize', label: 'Default Page Size', type: 'number', gridSize: 6, required: true },
        { name: 'lowStockThreshold', label: 'Low Stock Threshold', type: 'number', gridSize: 6, required: true },
        {
          name: 'defaultCurrency',
          label: 'Default Currency',
          type: 'select',
          gridSize: 6,
          required: true,
          options: [
            { value: 'USD', label: 'US Dollar (USD)' },
            { value: 'EUR', label: 'Euro (EUR)' },
            { value: 'GBP', label: 'British Pound (GBP)' },
          ],
        },
        {
          name: 'dateFormat',
          label: 'Date Format',
          type: 'select',
          gridSize: 6,
          required: true,
          options: [
            { value: 'short', label: 'Short (20 Jan 2025)' },
            { value: 'long', label: 'Long (20 January 2025, 14:30)' },
            { value: 'iso', label: 'ISO (2025-01-20)' },
          ],
        },
      ]}
    />
  );
};
