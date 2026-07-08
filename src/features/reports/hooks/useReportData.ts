import { useQuery } from '@tanstack/react-query';
import { reportService } from '../services/reportService';

// Report raw data changes infrequently relative to how often filters are
// tweaked, so it's cached generously - date range / status filtering happens
// client-side against this cached snapshot instead of refetching per change.
const REPORT_STALE_TIME = 5 * 60 * 1000;

export const reportKeys = {
  all: ['reports'] as const,
  sales: () => [...reportKeys.all, 'sales'] as const,
  purchases: () => [...reportKeys.all, 'purchases'] as const,
  orders: () => [...reportKeys.all, 'orders'] as const,
};

export const useSalesReportData = () => {
  return useQuery({
    queryKey: reportKeys.sales(),
    queryFn: () => reportService.getSalesReportRows(),
    staleTime: REPORT_STALE_TIME,
  });
};

export const usePurchasesReportData = () => {
  return useQuery({
    queryKey: reportKeys.purchases(),
    queryFn: () => reportService.getPurchasesReportRows(),
    staleTime: REPORT_STALE_TIME,
  });
};

export const useOrdersReportData = () => {
  return useQuery({
    queryKey: reportKeys.orders(),
    queryFn: () => reportService.getOrdersReportRows(),
    staleTime: REPORT_STALE_TIME,
  });
};
