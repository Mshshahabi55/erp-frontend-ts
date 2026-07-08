import { Dialog, DialogTitle, DialogContent } from '@mui/material';
import { useCustomers } from '@/features/customers/hooks/useCustomers';
import { SaleForm } from '../SaleForm/SaleForm';
import type { Sale } from '../../types/sale.types';
import type { SaleFormData } from '../../types/sale.schema';

interface SaleFormDialogProps {
  open: boolean;
  sale: Sale | null;
  isSubmitting: boolean;
  onSubmit: (data: SaleFormData) => Promise<void>;
  onClose: () => void;
}

const toDefaultValues = (sale: Sale): Partial<SaleFormData> => ({
  invoiceNumber: sale.invoiceNumber,
  customerId: sale.customerId,
  totalAmount: sale.totalAmount,
  status: sale.status,
  saleDate: sale.saleDate.slice(0, 10),
});

export const SaleFormDialog = ({ open, sale, isSubmitting, onSubmit, onClose }: SaleFormDialogProps) => {
  const { data: customersResponse } = useCustomers({ limit: 100 });
  const customerOptions = (customersResponse?.data ?? []).map((customer) => ({
    value: customer.id,
    label: customer.name,
  }));

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{sale ? 'Edit Sale' : 'Add New Sale'}</DialogTitle>
      <DialogContent>
        <SaleForm
          customerOptions={customerOptions}
          defaultValues={sale ? toDefaultValues(sale) : undefined}
          onSubmit={onSubmit}
          isLoading={isSubmitting}
          submitText={sale ? 'Update Sale' : 'Save Sale'}
          onCancel={onClose}
        />
      </DialogContent>
    </Dialog>
  );
};
