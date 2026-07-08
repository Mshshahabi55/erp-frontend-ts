import { Chip, Typography } from '@mui/material';
import { DataTable, Column } from '@/shared/components';
import { dateFormatter } from '@/shared/utils';
import { getAuditActionColor, getAuditActionLabel } from '../../utils/auditActionStyles';
import type { AuditLog, AuditAction, AuditLogSortField } from '../../types/auditLog.types';

interface AuditLogTableProps {
  logs: AuditLog[];
  isLoading: boolean;
  error: Error | null;
  totalCount: number;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  onRetry: () => void;
  sortBy?: AuditLogSortField;
  sortDirection?: 'asc' | 'desc';
  onSortChange: (field: AuditLogSortField) => void;
}

export const AuditLogTable = ({
  logs,
  isLoading,
  error,
  totalCount,
  page,
  pageSize,
  onPageChange,
  onPageSizeChange,
  onRetry,
  sortBy,
  sortDirection,
  onSortChange,
}: AuditLogTableProps) => {
  const columns: Column<AuditLog>[] = [
    {
      key: 'createdAt',
      label: 'Timestamp',
      sortable: true,
      render: (value: string) => dateFormatter.long(value),
    },
    {
      key: 'userName',
      label: 'User',
      sortable: true,
      render: (value: string) => <Typography sx={{ fontWeight: 500 }}>{value}</Typography>,
    },
    {
      key: 'action',
      label: 'Action',
      sortable: true,
      render: (value: AuditAction) => <Chip label={getAuditActionLabel(value)} color={getAuditActionColor(value)} size="small" />,
    },
    { key: 'resource', label: 'Resource', sortable: true },
    { key: 'description', label: 'Description' },
    { key: 'ipAddress', label: 'IP Address' },
  ];

  return (
    <DataTable
      columns={columns}
      data={logs}
      loading={isLoading}
      error={error}
      totalCount={totalCount}
      page={page}
      pageSize={pageSize}
      onPageChange={onPageChange}
      onPageSizeChange={onPageSizeChange}
      onRetry={onRetry}
      emptyMessage="No audit log entries match these filters."
      sortBy={sortBy}
      sortDirection={sortDirection}
      onSortChange={(field) => onSortChange(field as AuditLogSortField)}
    />
  );
};
