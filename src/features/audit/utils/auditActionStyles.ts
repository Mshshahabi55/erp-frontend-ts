import type { AuditAction } from '../types/auditLog.types';

const actionColors: Record<AuditAction, 'success' | 'info' | 'error' | 'primary' | 'default' | 'warning' | 'secondary'> = {
  create: 'success',
  update: 'info',
  delete: 'error',
  login: 'primary',
  logout: 'default',
  status_change: 'warning',
  export: 'secondary',
};

const actionLabels: Record<AuditAction, string> = {
  create: 'Create',
  update: 'Update',
  delete: 'Delete',
  login: 'Login',
  logout: 'Logout',
  status_change: 'Status Change',
  export: 'Export',
};

export const getAuditActionColor = (action: AuditAction) => actionColors[action];

export const getAuditActionLabel = (action: AuditAction): string => actionLabels[action];
