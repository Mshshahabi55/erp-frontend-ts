import { CrudForm, CrudFieldOption } from '@/shared/components';
import { saleFormSchema, SaleFormData } from '../../types/sale.schema';

const STATUS_OPTIONS: CrudFieldOption[] = [
  { value: 'pending', label: 'Pending' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
];

interface SaleFormProps {
  customerOptions: CrudFieldOption[];
  defaultValues?: Partial<SaleFormData>;
  onSubmit: (data: SaleFormData) => Promise<void>;
  isLoading?: boolean;
  submitText?: string;
  onCancel?: () => void;
}

export const SaleForm = ({
  customerOptions,
  defaultValues,
  onSubmit,
  isLoading,
  submitText = 'Save Sale',
  onCancel,
}: SaleFormProps) => {
  return (
    <CrudForm<SaleFormData>
      schema={saleFormSchema}
      defaultValues={defaultValues}
      onSubmit={onSubmit}
      isLoading={isLoading}
      onCancel={onCancel}
      submitText={submitText}
      title="Sale Information"
      fields={[
        {
          name: 'invoiceNumber',
          label: 'Invoice Number',
          type: 'text',
          gridSize: 6,
          required: true,
        },
        {
          name: 'customerId',
          label: 'Customer',
          type: 'select',
          gridSize: 6,
          required: true,
          options: customerOptions,
        },
        {
          name: 'totalAmount',
          label: 'Total Amount ($)',
          type: 'number',
          gridSize: 6,
          required: true,
        },
        {
          name: 'saleDate',
          label: 'Sale Date',
          type: 'date',
          gridSize: 6,
          required: true,
        },
        {
          name: 'status',
          label: 'Status',
          type: 'select',
          gridSize: 6,
          required: true,
          options: STATUS_OPTIONS,
        },
      ]}
    />
  );
};
