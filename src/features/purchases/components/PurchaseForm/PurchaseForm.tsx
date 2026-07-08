import { CrudForm, CrudFieldOption } from '@/shared/components';
import { purchaseFormSchema, PurchaseFormData } from '../../types/purchase.schema';

const STATUS_OPTIONS: CrudFieldOption[] = [
  { value: 'pending', label: 'Pending' },
  { value: 'received', label: 'Received' },
  { value: 'cancelled', label: 'Cancelled' },
];

interface PurchaseFormProps {
  supplierOptions: CrudFieldOption[];
  defaultValues?: Partial<PurchaseFormData>;
  onSubmit: (data: PurchaseFormData) => Promise<void>;
  isLoading?: boolean;
  submitText?: string;
  onCancel?: () => void;
}

export const PurchaseForm = ({
  supplierOptions,
  defaultValues,
  onSubmit,
  isLoading,
  submitText = 'Save Purchase',
  onCancel,
}: PurchaseFormProps) => {
  return (
    <CrudForm<PurchaseFormData>
      schema={purchaseFormSchema}
      defaultValues={defaultValues}
      onSubmit={onSubmit}
      isLoading={isLoading}
      onCancel={onCancel}
      submitText={submitText}
      title="Purchase Information"
      fields={[
        {
          name: 'purchaseNumber',
          label: 'Purchase Number',
          type: 'text',
          gridSize: 6,
          required: true,
        },
        {
          name: 'supplierId',
          label: 'Supplier',
          type: 'select',
          gridSize: 6,
          required: true,
          options: supplierOptions,
        },
        {
          name: 'totalAmount',
          label: 'Total Amount ($)',
          type: 'number',
          gridSize: 6,
          required: true,
        },
        {
          name: 'purchaseDate',
          label: 'Purchase Date',
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
