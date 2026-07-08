import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Stack, Divider, Typography, Chip, Box } from '@mui/material';
import { currencyFormatter, dateFormatter } from '@/shared/utils';
import { getSaleStatusColor, getSaleStatusLabel } from '../../utils/saleStatusStyles';
import type { Sale } from '../../types/sale.types';

interface SaleInvoiceDialogProps {
  open: boolean;
  sale: Sale | null;
  customerName: string;
  onClose: () => void;
}

export const SaleInvoiceDialog = ({ open, sale, customerName, onClose }: SaleInvoiceDialogProps) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Invoice</DialogTitle>
      <DialogContent>
        {sale && (
          <Stack spacing={2}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Box>
                <Typography variant="overline" color="text.secondary">
                  Invoice Number
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  {sale.invoiceNumber}
                </Typography>
              </Box>
              <Chip label={getSaleStatusLabel(sale.status)} color={getSaleStatusColor(sale.status)} size="small" />
            </Box>

            <Divider />

            <Stack spacing={1}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">
                  Billed To
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {customerName}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">
                  Sale Date
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {dateFormatter.short(sale.saleDate)}
                </Typography>
              </Box>
            </Stack>

            <Divider />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="subtitle1">Total</Typography>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                {currencyFormatter.usd(sale.totalAmount)}
              </Typography>
            </Box>
          </Stack>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};
