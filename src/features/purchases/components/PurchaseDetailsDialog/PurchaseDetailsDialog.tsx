import type { ReactNode } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Stack, Divider, Typography, Chip } from '@mui/material';
import { currencyFormatter, dateFormatter } from '@/shared/utils';
import { getPurchaseStatusColor, getPurchaseStatusLabel } from '../../utils/purchaseStatusStyles';
import type { Purchase } from '../../types/purchase.types';

interface PurchaseDetailsDialogProps {
  open: boolean;
  purchase: Purchase | null;
  supplierName: string;
  onClose: () => void;
}

const DetailRow = ({ label, value }: { label: string; value: ReactNode }) => (
  <Stack direction="row" sx={{ justifyContent: 'space-between', py: 1 }}>
    <Typography variant="body2" color="text.secondary">
      {label}
    </Typography>
    <Typography variant="body2" sx={{ fontWeight: 500 }}>
      {value}
    </Typography>
  </Stack>
);

export const PurchaseDetailsDialog = ({ open, purchase, supplierName, onClose }: PurchaseDetailsDialogProps) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Purchase Details</DialogTitle>
      <DialogContent>
        {purchase && (
          <Stack divider={<Divider />}>
            <DetailRow label="PO Number" value={purchase.purchaseNumber} />
            <DetailRow label="Supplier" value={supplierName} />
            <DetailRow label="Total Amount" value={currencyFormatter.usd(purchase.totalAmount)} />
            <DetailRow label="Purchase Date" value={dateFormatter.short(purchase.purchaseDate)} />
            <DetailRow
              label="Status"
              value={<Chip label={getPurchaseStatusLabel(purchase.status)} color={getPurchaseStatusColor(purchase.status)} size="small" />}
            />
            <DetailRow label="Created" value={dateFormatter.long(purchase.createdAt)} />
          </Stack>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};
