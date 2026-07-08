import { CrudForm } from '@/shared/components';
import { warehouseFormSchema, WarehouseFormData } from '../../types/warehouse.schema';

interface WarehouseFormProps {
  defaultValues?: Partial<WarehouseFormData>;
  onSubmit: (data: WarehouseFormData) => Promise<void>;
  isLoading?: boolean;
  submitText?: string;
  onCancel?: () => void;
}

export const WarehouseForm = ({
  defaultValues,
  onSubmit,
  isLoading,
  submitText = 'Save Warehouse',
  onCancel,
}: WarehouseFormProps) => {
  return (
    <CrudForm<WarehouseFormData>
      schema={warehouseFormSchema}
      defaultValues={{ isActive: true, ...defaultValues }}
      onSubmit={onSubmit}
      isLoading={isLoading}
      onCancel={onCancel}
      submitText={submitText}
      title="Warehouse Information"
      fields={[
        {
          name: 'name',
          label: 'Warehouse Name',
          type: 'text',
          gridSize: 6,
          required: true,
        },
        {
          name: 'code',
          label: 'Code',
          type: 'text',
          gridSize: 6,
          required: true,
          placeholder: 'e.g. WH-EAST',
        },
        {
          name: 'address',
          label: 'Address',
          type: 'text',
          gridSize: 12,
          required: true,
        },
        {
          name: 'city',
          label: 'City',
          type: 'text',
          gridSize: 6,
          required: true,
        },
        {
          name: 'state',
          label: 'State',
          type: 'text',
          gridSize: 6,
          required: true,
        },
        {
          name: 'managerName',
          label: 'Manager Name',
          type: 'text',
          gridSize: 6,
          required: true,
        },
        {
          name: 'phone',
          label: 'Phone',
          type: 'text',
          gridSize: 6,
          required: true,
        },
        {
          name: 'capacity',
          label: 'Capacity (units)',
          type: 'number',
          gridSize: 6,
          required: true,
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
