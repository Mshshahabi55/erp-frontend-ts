import { useState } from 'react';
import { Box, Typography } from '@mui/material';
import { useDebounce } from '@/shared/hooks';
import type { DateRange } from '@/shared/types';
import {
  AuditLogFilters,
  ALL_AUDIT_ACTIONS,
  ALL_AUDIT_RESOURCES,
  type AuditActionFilter,
  type AuditResourceFilter,
} from '../components/AuditLogFilters/AuditLogFilters';
import { AuditLogTable } from '../components/AuditLogTable/AuditLogTable';
import { useAuditLogs } from '../hooks/useAuditLogs';
import type { AuditLogSortField } from '../types/auditLog.types';

const EMPTY_DATE_RANGE: DateRange = { from: '', to: '' };

export const AuditLogsPage = () => {
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [searchInput, setSearchInput] = useState('');
  const [actionFilter, setActionFilter] = useState<AuditActionFilter>(ALL_AUDIT_ACTIONS);
  const [resourceFilter, setResourceFilter] = useState<AuditResourceFilter>(ALL_AUDIT_RESOURCES);
  const [dateRange, setDateRange] = useState<DateRange>(EMPTY_DATE_RANGE);
  const [sortBy, setSortBy] = useState<AuditLogSortField>('createdAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const debouncedSearch = useDebounce(searchInput, 500);

  const { data: response, isLoading, error, refetch } = useAuditLogs({
    page: page + 1,
    limit: pageSize,
    search: debouncedSearch || undefined,
    action: actionFilter === ALL_AUDIT_ACTIONS ? undefined : actionFilter,
    resource: resourceFilter === ALL_AUDIT_RESOURCES ? undefined : resourceFilter,
    dateFrom: dateRange.from || undefined,
    dateTo: dateRange.to || undefined,
    sortBy,
    sortDirection,
  });

  const logs = response?.data ?? [];
  const totalCount = response?.total ?? 0;

  const handleSortChange = (field: AuditLogSortField) => {
    if (sortBy === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(field);
      setSortDirection('asc');
    }
  };

  const handleActionFilterChange = (value: AuditActionFilter) => {
    setActionFilter(value);
    setPage(0);
  };

  const handleResourceFilterChange = (value: AuditResourceFilter) => {
    setResourceFilter(value);
    setPage(0);
  };

  const handleDateRangeChange = (range: DateRange) => {
    setDateRange(range);
    setPage(0);
  };

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
          Audit Logs
        </Typography>
        <Typography variant="body2" color="text.secondary">
          A read-only record of who did what, and when.
        </Typography>
      </Box>

      <AuditLogFilters
        searchValue={searchInput}
        onSearchChange={setSearchInput}
        onSearchClear={() => setSearchInput('')}
        actionFilter={actionFilter}
        onActionFilterChange={handleActionFilterChange}
        resourceFilter={resourceFilter}
        onResourceFilterChange={handleResourceFilterChange}
        dateRange={dateRange}
        onDateRangeChange={handleDateRangeChange}
      />

      <AuditLogTable
        logs={logs}
        isLoading={isLoading}
        error={error}
        totalCount={totalCount}
        page={page}
        pageSize={pageSize}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
        onRetry={refetch}
        sortBy={sortBy}
        sortDirection={sortDirection}
        onSortChange={handleSortChange}
      />
    </Box>
  );
};

export default AuditLogsPage;
