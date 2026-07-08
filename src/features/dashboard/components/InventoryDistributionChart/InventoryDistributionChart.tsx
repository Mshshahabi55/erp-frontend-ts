import { Paper, Typography, Skeleton, Alert, Button } from '@mui/material';
import { Refresh } from '@mui/icons-material';
import { PieChart } from '@mui/x-charts/PieChart';
import { EmptyState } from '@/shared/components';
import { currencyFormatter } from '@/shared/utils';
import type { CategoryDistribution } from '../../types/dashboard.types';

interface InventoryDistributionChartProps {
  data: CategoryDistribution[] | undefined;
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
}

const CHART_HEIGHT = 300;

const SLICE_COLORS = [
  '#1976d2', '#2e7d32', '#ed6c02', '#9c27b0', '#0288d1',
  '#d32f2f', '#6d4c41', '#455a64', '#c2185b', '#00796b',
];

export const InventoryDistributionChart = ({ data, isLoading, isError, onRetry }: InventoryDistributionChartProps) => {
  return (
    <Paper sx={{ p: 3, borderRadius: 3, height: '100%' }}>
      <Typography variant="h6" component="h2" sx={{ fontWeight: 600, mb: 2 }}>
        Inventory Distribution by Category
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
          Failed to load inventory distribution.
        </Alert>
      ) : isLoading || !data ? (
        <Skeleton variant="rectangular" height={CHART_HEIGHT} sx={{ borderRadius: 2 }} />
      ) : data.length === 0 ? (
        <EmptyState title="No inventory data yet" />
      ) : (
        <PieChart
          height={CHART_HEIGHT}
          series={[
            {
              data: data.map((entry, index) => ({
                id: entry.category,
                label: entry.category,
                value: entry.value,
                color: SLICE_COLORS[index % SLICE_COLORS.length],
              })),
              valueFormatter: (item) => currencyFormatter.usd(item.value),
              innerRadius: 40,
              paddingAngle: 1,
            },
          ]}
          aria-label="Inventory value distribution by product category pie chart"
        />
      )}
    </Paper>
  );
};
