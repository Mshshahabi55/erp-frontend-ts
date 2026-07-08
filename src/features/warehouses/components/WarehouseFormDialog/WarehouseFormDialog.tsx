import { Dialog, DialogTitle, DialogContent } from '@mui/material';
import { WarehouseForm } from '../WarehouseForm/WarehouseForm';
import type { Warehouse } from '../../types/warehouse.types';
import type { WarehouseFormData } from '../../types/warehouse.schema';

interface WarehouseFormDialogProps {
  open: boolean;
  warehouse: Warehouse | null;
  isSubmitting: boolean;
  onSubmit: (data: WarehouseFormData) => Promise<void>;
  onClose: () => void;
}

const toDefaultValues = (warehouse: Warehouse): Partial<WarehouseFormData> => ({
  name: warehouse.name,
  code: warehouse.code,
  address: warehouse.address,
  city: warehouse.city,
  state: warehouse.state,
  managerName: warehouse.managerName,
  phone: warehouse.phone,
  capacity: warehouse.capacity,
  isActive: warehouse.isActive,
});

export const WarehouseFormDialog = ({ open, warehouse, isSubmitting, onSubmit, onClose }: WarehouseFormDialogProps) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{warehouse ? 'Edit Warehouse' : 'Add New Warehouse'}</DialogTitle>
      <DialogContent>
        <WarehouseForm
          defaultValues={warehouse ? toDefaultValues(warehouse) : undefined}
          onSubmit={onSubmit}
          isLoading={isSubmitting}
          submitText={warehouse ? 'Update Warehouse' : 'Save Warehouse'}
          onCancel={onClose}
        />
      </DialogContent>
    </Dialog>
  );
};
