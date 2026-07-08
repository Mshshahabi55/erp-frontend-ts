export const ROLES = ['admin', 'manager', 'staff'] as const;

export type Role = (typeof ROLES)[number];
