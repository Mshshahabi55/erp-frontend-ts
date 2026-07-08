import { Grid, Typography, Box } from '@mui/material';
import { StatsGrid } from '../components/StatsGrid/StatsGrid';
import { MonthlySalesChart } from '../components/MonthlySalesChart/MonthlySalesChart';
import { MonthlyPurchasesChart } from '../components/MonthlyPurchasesChart/MonthlyPurchasesChart';
import { InventoryDistributionChart } from '../components/InventoryDistributionChart/InventoryDistributionChart';
import { RecentSalesCard } from '../components/RecentSalesCard/RecentSalesCard';
import { QuickActionsCard } from '../components/QuickActionsCard/QuickActionsCard';
import { useDashboardStats } from '../hooks/useDashboardStats';

export const DashboardPage = () => {
  const { data: stats, isLoading, isError, refetch } = useDashboardStats();

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 1 }}>
          Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Welcome back! Here's what's happening with your business today.
        </Typography>
      </Box>

      <StatsGrid stats={stats} isLoading={isLoading} isError={isError} onRetry={refetch} />

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <MonthlySalesChart data={stats?.monthlySales} isLoading={isLoading} isError={isError} onRetry={refetch} />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <MonthlyPurchasesChart
            data={stats?.monthlyPurchases}
            isLoading={isLoading}
            isError={isError}
            onRetry={refetch}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 4 }}>
          <InventoryDistributionChart
            data={stats?.categoryDistribution}
            isLoading={isLoading}
            isError={isError}
            onRetry={refetch}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 5 }}>
          <RecentSalesCard sales={stats?.recentSales} isLoading={isLoading} isError={isError} onRetry={refetch} />
        </Grid>
        <Grid size={{ xs: 12, md: 3 }}>
          <QuickActionsCard />
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardPage;
