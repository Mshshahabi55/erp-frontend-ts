import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '../services/dashboardService';

export const dashboardKeys = {
  all: ['dashboard'] as const,
  stats: () => [...dashboardKeys.all, 'stats'] as const,
};

export const useDashboardStats = () => {
  return useQuery({
    queryKey: dashboardKeys.stats(),
    queryFn: () => dashboardService.getDashboardStats(),
    // Dashboard aggregates 6 other features' data via their services directly
    // (not through their cached queries), so no feature's mutations can
    // invalidate this key - a positive staleTime meant navigating back to
    // Dashboard shortly after e.g. creating a customer could show a stale
    // count. Always-fresh-on-view is the correct default for an aggregation
    // view; the underlying reads are cheap enough that this costs nothing
    // meaningful.
    staleTime: 0,
  });
};
