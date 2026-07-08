import { createJsonServerResource } from '@/shared/api';
import type { WithRawId } from '@/shared/types';
import { AuditLog, AuditLogQueryParams } from '../types/auditLog.types';

export type { AuditLog, AuditLogQueryParams };

type RawAuditLog = WithRawId<AuditLog>;

const normalizeAuditLog = (raw: RawAuditLog): AuditLog => ({
  ...raw,
  id: String(raw.id),
});

const auditLogResource = createJsonServerResource<
  AuditLog,
  RawAuditLog,
  never,
  never,
  AuditLogQueryParams
>({
  resourcePath: '/auditLogs',
  normalize: normalizeAuditLog,
  searchFields: ['userName', 'description'],
  buildFilters: (params) => {
    const filters: Record<string, unknown> = {};

    if (params?.action) {
      filters.action = params.action;
    }

    if (params?.resource) {
      filters.resource = params.resource;
    }

    if (params?.dateFrom) {
      filters['createdAt:gte'] = params.dateFrom;
    }

    if (params?.dateTo) {
      // Inclusive of the whole "to" day - createdAt is a full timestamp, a
      // bare date comparison would exclude same-day entries after midnight.
      filters['createdAt:lte'] = `${params.dateTo}T23:59:59.999Z`;
    }

    const sortBy = params?.sortBy ?? 'createdAt';
    const sortDirection = params?.sortDirection ?? 'desc';
    filters._sort = sortDirection === 'desc' ? `-${sortBy}` : sortBy;

    return filters;
  },
});

// Audit logs are an immutable ledger - only reading is exposed, no
// create/update/delete surface, matching the read-only checklist for this
// feature (no audit forms/dialogs).
export const auditLogService = {
  getAll: auditLogResource.getAll,
  getById: auditLogResource.getById,
};
