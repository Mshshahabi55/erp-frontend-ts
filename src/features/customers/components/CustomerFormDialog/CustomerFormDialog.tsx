import { Dialog, DialogTitle, DialogContent } from '@mui/material';
import { CustomerForm } from '../CustomerForm/CustomerForm';
import type { Customer } from '../../types/customer.types';
import type { CustomerFormData } from '../../types/customer.schema';

interface CustomerFormDialogProps {
  open: boolean;
  customer: Customer | null;
  isSubmitting: boolean;
  onSubmit: (data: CustomerFormData) => Promise<void>;
  onClose: () => void;
}

const toDefaultValues = (customer: Customer): Partial<CustomerFormData> => ({
  name: customer.name,
  email: customer.email,
  phone: customer.phone,
  company: customer.company || '',
  address: customer.address || '',
  isActive: customer.isActive,
});

export const CustomerFormDialog = ({ open, customer, isSubmitting, onSubmit, onClose }: CustomerFormDialogProps) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{customer ? 'Edit Customer' : 'Add New Customer'}</DialogTitle>
      <DialogContent>
        <CustomerForm
          defaultValues={customer ? toDefaultValues(customer) : undefined}
          onSubmit={onSubmit}
          isLoading={isSubmitting}
          submitText={customer ? 'Update Customer' : 'Save Customer'}
          onCancel={onClose}
        />
      </DialogContent>
    </Dialog>
  );
};
