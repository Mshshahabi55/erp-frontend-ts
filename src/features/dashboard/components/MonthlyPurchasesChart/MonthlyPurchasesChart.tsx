import { Paper, Typography, Skeleton, Alert, Button } from '@mui/material';
import { Refresh } from '@mui/icons-material';
import { BarChart } from '@mui/x-charts/BarChart';
import { EmptyState } from '@/shared/components';
import type { MonthlyAmount } from '../../types/dashboard.types';

interface MonthlyPurchasesChartProps {
  data: MonthlyAmount[] | undefined;
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
}

const CHART_HEIGHT = 300;

export const MonthlyPurchasesChart = ({ data, isLoading, isError, onRetry }: MonthlyPurchasesChartProps) => {
  return (
    <Paper sx={{ p: 3, borderRadius: 3, height: '100%' }}>
      <Typography variant="h6" component="h2" sx={{ fontWeight: 600, mb: 2 }}>
        Monthly Purchases
      </Typography>

      {isError ? (
        <Alert
          severity="error"
          action={
            <Button color="inherit" size="small" onClick={onRetry} startIcon={<Refresh />}>
              Retry
            </Button>
          }
        >
          Failed to load monthly purchases.
        </Alert>
      ) : isLoading || !data ? (
        <Skeleton variant="rectangular" height={CHART_HEIGHT} sx={{ borderRadius: 2 }} />
      ) : data.length === 0 ? (
        <EmptyState title="No purchases recorded yet" />
      ) : (
        <BarChart
          height={CHART_HEIGHT}
          series={[{ data: data.map((entry) => entry.amount), label: 'Purchases ($)', color: '#ed6c02' }]}
          xAxis={[{ data: data.map((entry) => entry.month), scaleType: 'band' }]}
          aria-label="Monthly purchases bar chart"
        />
      )}
    </Paper>
  );
};
