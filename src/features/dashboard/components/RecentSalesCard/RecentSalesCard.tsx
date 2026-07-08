import { Paper, Box, Typography, Chip, Divider, Skeleton, Alert, Button } from '@mui/material';
import { Refresh } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import { EmptyState } from '@/shared/components';
import { currencyFormatter, dateFormatter } from '@/shared/utils';
import { getStatusColor, getStatusText } from '../../utils/statusStyles';
import type { RecentSale } from '../../types/dashboard.types';

interface RecentSalesCardProps {
  sales: RecentSale[] | undefined;
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
}

export const RecentSalesCard = ({ sales, isLoading, isError, onRetry }: RecentSalesCardProps) => {
  return (
    <Paper sx={{ p: 3, borderRadius: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" component="h2" sx={{ fontWeight: 600 }}>
          Recent Sales
        </Typography>
        <Typography
          component={RouterLink}
          to="/orders"
          variant="body2"
          color="primary"
          sx={{ textDecoration: 'none' }}
        >
          View all
        </Typography>
      </Box>
      <Divider sx={{ mb: 2 }} />

      {isError ? (
        <Alert
          severity="error"
          action={
            <Button color="inherit" size="small" onClick={onRetry} startIcon={<Refresh />}>
              Retry
            </Button>
          }
        >
          Failed to load recent sales.
        </Alert>
      ) : isLoading || !sales ? (
        Array.from({ length: 3 }).map((_, index) => (
          <Skeleton key={index} variant="text" height={48} sx={{ mb: 1 }} />
        ))
      ) : sales.length === 0 ? (
        <EmptyState title="No sales yet" description="Recent sales will show up here once orders start coming in." />
      ) : (
        sales.map((sale, index) => (
          <Box key={sale.id} sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {sale.invoiceNumber}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                  {sale.customerName} &middot; {dateFormatter.short(sale.saleDate)}
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'right' }}>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {currencyFormatter.usd(sale.totalAmount)}
                </Typography>
                <Chip
                  label={getStatusText(sale.status)}
                  size="small"
                  color={getStatusColor(sale.status)}
                  sx={{ height: 20, fontSize: '0.625rem' }}
                />
              </Box>
            </Box>
            {index < sales.length - 1 && <Divider sx={{ mt: 1.5 }} />}
          </Box>
        ))
      )}
    </Paper>
  );
};
