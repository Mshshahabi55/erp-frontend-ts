import { Paper, Typography, Skeleton, Alert, Button } from '@mui/material';
import { Refresh } from '@mui/icons-material';
import { LineChart } from '@mui/x-charts/LineChart';
import { EmptyState } from '@/shared/components';
import type { MonthlyAmount } from '../../types/dashboard.types';

interface MonthlySalesChartProps {
  data: MonthlyAmount[] | undefined;
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
}

const CHART_HEIGHT = 300;

export const MonthlySalesChart = ({ data, isLoading, isError, onRetry }: MonthlySalesChartProps) => {
  return (
    <Paper sx={{ p: 3, borderRadius: 3, height: '100%' }}>
      <Typography variant="h6" component="h2" sx={{ fontWeight: 600, mb: 2 }}>
        Monthly Sales
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
          Failed to load monthly sales.
        </Alert>
      ) : isLoading || !data ? (
        <Skeleton variant="rectangular" height={CHART_HEIGHT} sx={{ borderRadius: 2 }} />
      ) : data.length === 0 ? (
        <EmptyState title="No sales recorded yet" />
      ) : (
        <LineChart
          height={CHART_HEIGHT}
          series={[{ data: data.map((entry) => entry.amount), label: 'Sales ($)', color: '#2e7d32', area: true }]}
          xAxis={[{ data: data.map((entry) => entry.month), scaleType: 'point' }]}
          aria-label="Monthly sales trend line chart"
        />
      )}
    </Paper>
  );
};
