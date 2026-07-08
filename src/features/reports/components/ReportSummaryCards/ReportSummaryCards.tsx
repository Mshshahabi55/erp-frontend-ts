import { Grid, Paper, Typography, Skeleton } from '@mui/material';
import { currencyFormatter, numberFormatter } from '@/shared/utils';
import type { ReportSummary } from '../../types/report.types';

interface ReportSummaryCardsProps {
  summary: ReportSummary | undefined;
  isLoading: boolean;
  totalLabel: string;
}

const SummaryCard = ({ title, value }: { title: string; value: string }) => (
  <Grid size={{ xs: 12, sm: 4 }}>
    <Paper sx={{ p: 3, borderRadius: 3 }}>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
        {title}
      </Typography>
      <Typography variant="h4" sx={{ fontWeight: 700 }}>
        {value}
      </Typography>
    </Paper>
  </Grid>
);

export const ReportSummaryCards = ({ summary, isLoading, totalLabel }: ReportSummaryCardsProps) => {
  if (isLoading || !summary) {
    return (
      <Grid container spacing={3} sx={{ mb: 3 }} aria-label="Loading report summary">
        {Array.from({ length: 3 }).map((_, index) => (
          <Grid size={{ xs: 12, sm: 4 }} key={index}>
            <Paper sx={{ p: 3, borderRadius: 3 }}>
              <Skeleton variant="text" width="60%" />
              <Skeleton variant="text" width="40%" height={40} />
            </Paper>
          </Grid>
        ))}
      </Grid>
    );
  }

  return (
    <Grid container spacing={3} sx={{ mb: 3 }} role="list" aria-label="Report summary">
      <SummaryCard title={totalLabel} value={currencyFormatter.usd(summary.totalAmount)} />
      <SummaryCard title="Transactions" value={numberFormatter.integer(summary.transactionCount)} />
      <SummaryCard title="Average Transaction" value={currencyFormatter.usd(summary.averageAmount)} />
    </Grid>
  );
};
