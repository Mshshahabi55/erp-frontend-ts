import { Box, Stack, Typography, Divider } from '@mui/material';
import { currencyFormatter } from '@/shared/utils';
import type { OrderTotals } from '../../utils/orderCalculations';

interface OrderTotalsSummaryProps {
  totals: OrderTotals;
  discountPercent: number;
  taxPercent: number;
}

const TotalRow = ({ label, value, emphasize }: { label: string; value: string; emphasize?: boolean }) => (
  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
    <Typography variant={emphasize ? 'subtitle1' : 'body2'} color={emphasize ? 'text.primary' : 'text.secondary'}>
      {label}
    </Typography>
    <Typography variant={emphasize ? 'h6' : 'body2'} sx={{ fontWeight: emphasize ? 700 : 500 }}>
      {value}
    </Typography>
  </Box>
);

export const OrderTotalsSummary = ({ totals, discountPercent, taxPercent }: OrderTotalsSummaryProps) => {
  return (
    <Stack spacing={1} sx={{ maxWidth: 320, ml: 'auto' }}>
      <TotalRow label="Subtotal" value={currencyFormatter.usd(totals.subtotal)} />
      <TotalRow label={`Discount (${discountPercent}%)`} value={`-${currencyFormatter.usd(totals.discountAmount)}`} />
      <TotalRow label={`Tax (${taxPercent}%)`} value={currencyFormatter.usd(totals.taxAmount)} />
      <Divider />
      <TotalRow label="Total" value={currencyFormatter.usd(totals.totalAmount)} emphasize />
    </Stack>
  );
};
