import { Paper, Typography, Skeleton } from '@mui/material';
import { LineChart } from '@mui/x-charts/LineChart';
import { EmptyState } from '@/shared/components';
import type { MonthlyAmount } from '@/shared/utils';

interface ReportTrendChartProps {
  title: string;
  seriesLabel: string;
  data: MonthlyAmount[] | undefined;
  isLoading: boolean;
  color: string;
}

const CHART_HEIGHT = 280;

export const ReportTrendChart = ({ title, seriesLabel, data, isLoading, color }: ReportTrendChartProps) => {
  return (
    <Paper sx={{ p: 3, borderRadius: 3 }}>
      <Typography variant="h6" component="h2" sx={{ fontWeight: 600, mb: 2 }}>
        {title}
      </Typography>

      {isLoading || !data ? (
        <Skeleton variant="rectangular" height={CHART_HEIGHT} sx={{ borderRadius: 2 }} />
      ) : data.length === 0 ? (
        <EmptyState title="No data in this range" description="Try widening the date range or clearing filters." />
      ) : (
        <LineChart
          height={CHART_HEIGHT}
          series={[{ data: data.map((entry) => entry.amount), label: seriesLabel, color, area: true }]}
          xAxis={[{ data: data.map((entry) => entry.month), scaleType: 'point' }]}
          aria-label={`${title} trend line chart`}
        />
      )}
    </Paper>
  );
};
