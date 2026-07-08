import { Dialog, DialogTitle, DialogContent } from '@mui/material';
import { useSuppliers } from '@/features/suppliers/hooks/useSuppliers';
import { PurchaseForm } from '../PurchaseForm/PurchaseForm';
import type { Purchase } from '../../types/purchase.types';
import type { PurchaseFormData } from '../../types/purchase.schema';

interface PurchaseFormDialogProps {
  open: boolean;
  purchase: Purchase | null;
  isSubmitting: boolean;
  onSubmit: (data: PurchaseFormData) => Promise<void>;
  onClose: () => void;
}

const toDefaultValues = (purchase: Purchase): Partial<PurchaseFormData> => ({
  purchaseNumber: purchase.purchaseNumber,
  supplierId: purchase.supplierId,
  totalAmount: purchase.totalAmount,
  status: purchase.status,
  purchaseDate: purchase.purchaseDate.slice(0, 10),
});

export const PurchaseFormDialog = ({ open, purchase, isSubmitting, onSubmit, onClose }: PurchaseFormDialogProps) => {
  const { data: suppliersResponse } = useSuppliers({ limit: 100 });
  const supplierOptions = (suppliersResponse?.data ?? []).map((supplier) => ({
    value: supplier.id,
    label: supplier.name,
  }));

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{purchase ? 'Edit Purchase' : 'Add New Purchase'}</DialogTitle>
      <DialogContent>
        <PurchaseForm
          supplierOptions={supplierOptions}
          defaultValues={purchase ? toDefaultValues(purchase) : undefined}
          onSubmit={onSubmit}
          isLoading={isSubmitting}
          submitText={purchase ? 'Update Purchase' : 'Save Purchase'}
          onCancel={onClose}
        />
      </DialogContent>
    </Dialog>
  );
};
