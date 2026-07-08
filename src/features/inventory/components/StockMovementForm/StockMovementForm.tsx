import { CrudForm, CrudFieldOption } from '@/shared/components';
import { stockMovementFormSchema, StockMovementFormData } from '../../types/stockMovement.schema';

const TYPE_OPTIONS: CrudFieldOption[] = [
  { value: 'in', label: 'Stock In (receive)' },
  { value: 'out', label: 'Stock Out (issue)' },
  { value: 'adjustment', label: 'Adjustment (set exact count)' },
];

interface StockMovementFormProps {
  productOptions: CrudFieldOption[];
  onSubmit: (data: StockMovementFormData) => Promise<void>;
  isLoading?: boolean;
  onCancel?: () => void;
}

export const StockMovementForm = ({ productOptions, onSubmit, isLoading, onCancel }: StockMovementFormProps) => {
  return (
    <CrudForm<StockMovementFormData>
      schema={stockMovementFormSchema}
      onSubmit={onSubmit}
      isLoading={isLoading}
      onCancel={onCancel}
      submitText="Record Movement"
      title="Stock Movement"
      fields={[
        {
          name: 'productId',
          label: 'Product',
          type: 'select',
          gridSize: 12,
          required: true,
          options: productOptions,
        },
        {
          name: 'type',
          label: 'Movement Type',
          type: 'select',
          gridSize: 6,
          required: true,
          options: TYPE_OPTIONS,
        },
        {
          name: 'quantity',
          label: 'Quantity (delta for In/Out, exact count for Adjustment)',
          type: 'number',
          gridSize: 6,
          required: true,
        },
        {
          name: 'reason',
          label: 'Reason',
          type: 'textarea',
          gridSize: 12,
          required: true,
        },
      ]}
    />
  );
};
