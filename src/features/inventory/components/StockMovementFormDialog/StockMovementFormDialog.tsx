import { Dialog, DialogTitle, DialogContent } from '@mui/material';
import { useProducts } from '@/features/products/hooks/useProducts';
import { StockMovementForm } from '../StockMovementForm/StockMovementForm';
import type { StockMovementFormData } from '../../types/stockMovement.schema';

interface StockMovementFormDialogProps {
  open: boolean;
  isSubmitting: boolean;
  onSubmit: (data: StockMovementFormData) => Promise<void>;
  onClose: () => void;
}

export const StockMovementFormDialog = ({ open, isSubmitting, onSubmit, onClose }: StockMovementFormDialogProps) => {
  const { data: productsResponse } = useProducts({ limit: 100 });
  const productOptions = (productsResponse?.data ?? []).map((product) => ({
    value: product.id,
    label: `${product.name} (${product.sku})`,
  }));

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Record Stock Movement</DialogTitle>
      <DialogContent>
        <StockMovementForm
          productOptions={productOptions}
          onSubmit={onSubmit}
          isLoading={isSubmitting}
          onCancel={onClose}
        />
      </DialogContent>
    </Dialog>
  );
};
