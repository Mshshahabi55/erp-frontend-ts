import { Dialog, DialogTitle, DialogContent } from '@mui/material';
import { SupplierForm } from '../SupplierForm/SupplierForm';
import type { Supplier } from '../../types/supplier.types';
import type { SupplierFormData } from '../../types/supplier.schema';

interface SupplierFormDialogProps {
  open: boolean;
  supplier: Supplier | null;
  isSubmitting: boolean;
  onSubmit: (data: SupplierFormData) => Promise<void>;
  onClose: () => void;
}

const toDefaultValues = (supplier: Supplier): Partial<SupplierFormData> => ({
  name: supplier.name,
  contactName: supplier.contactName,
  email: supplier.email,
  phone: supplier.phone,
  address: supplier.address,
  isActive: supplier.isActive,
});

export const SupplierFormDialog = ({ open, supplier, isSubmitting, onSubmit, onClose }: SupplierFormDialogProps) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{supplier ? 'Edit Supplier' : 'Add New Supplier'}</DialogTitle>
      <DialogContent>
        <SupplierForm
          defaultValues={supplier ? toDefaultValues(supplier) : undefined}
          onSubmit={onSubmit}
          isLoading={isSubmitting}
          submitText={supplier ? 'Update Supplier' : 'Save Supplier'}
          onCancel={onClose}
        />
      </DialogContent>
    </Dialog>
  );
};
