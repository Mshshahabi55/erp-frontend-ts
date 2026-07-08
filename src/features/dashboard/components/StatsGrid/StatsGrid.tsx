import { Grid, Paper, Typography, Box, Skeleton, Alert, Button } from '@mui/material';
import { Refresh } from '@mui/icons-material';
import { buildStatCards } from './buildStatCards';
import type { DashboardStatsDto } from '../../types/dashboard.types';

interface StatsGridProps {
  stats: DashboardStatsDto | undefined;
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
}

const STAT_CARD_COUNT = 8;

export const StatsGrid = ({ stats, isLoading, isError, onRetry }: StatsGridProps) => {
  if (isError) {
    return (
      <Alert
        severity="error"
        sx={{ mb: 4 }}
        action={
          <Button color="inherit" size="small" onClick={onRetry} startIcon={<Refresh />}>
            Retry
          </Button>
        }
      >
        Failed to load dashboard statistics.
      </Alert>
    );
  }

  if (isLoading || !stats) {
    return (
      <Grid container spacing={3} sx={{ mb: 4 }} aria-label="Loading key metrics">
        {Array.from({ length: STAT_CARD_COUNT }).map((_, index) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
            <Paper sx={{ p: 3, borderRadius: 3 }}>
              <Skeleton variant="text" width="60%" />
              <Skeleton variant="text" width="40%" height={40} />
            </Paper>
          </Grid>
        ))}
      </Grid>
    );
  }

  const statCards = buildStatCards(stats);

  return (
    <Grid container spacing={3} sx={{ mb: 4 }} role="list" aria-label="Key metrics">
      {statCards.map((stat) => (
        <Grid size={{ xs: 12, sm: 6, md: 3 }} key={stat.key} role="listitem">
          <Paper
            sx={{
              p: 3,
              borderRadius: 3,
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: 4,
              },
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  {stat.title}
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  {stat.value}
                </Typography>
              </Box>
              <Box
                sx={{
                  p: 1.5,
                  borderRadius: 2,
                  bgcolor: `${stat.color}15`,
                  color: stat.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {stat.icon}
              </Box>
            </Box>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
};
