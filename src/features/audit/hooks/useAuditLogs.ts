import { useQuery } from '@tanstack/react-query';
import { createQueryKeyFactory } from '@/shared/query';
import { auditLogService } from '../services/auditLogService';
import type { AuditLogQueryParams } from '../types/auditLog.types';

export const auditLogKeys = createQueryKeyFactory<AuditLogQueryParams>('auditLogs');

export const useAuditLogs = (params?: AuditLogQueryParams) => {
  return useQuery({
    queryKey: auditLogKeys.list(params),
    queryFn: () => auditLogService.getAll(params),
  });
};
