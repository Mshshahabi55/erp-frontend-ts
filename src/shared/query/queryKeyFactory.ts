/**
 * The {all, lists, list, details, detail} shape was duplicated nearly
 * verbatim across every feature's query-key object (Customers, Products,
 * Suppliers, Categories, Warehouses, Users, Sales, Purchases, Employees,
 * Audit, StockMovements, Orders) - one factory call replaces that
 * boilerplate per feature while producing the exact same key arrays, so
 * cache invalidation behavior is unchanged.
 *
 * Features with a genuinely different shape (singleton config records like
 * rolePermissions/companySettings, or a composite key like global search)
 * don't use this - forcing them in would be a mismatch, not a simplification.
 */
export function createQueryKeyFactory<TParams = void>(entity: string) {
  const all = [entity] as const;
  const lists = () => [...all, 'list'] as const;
  const list = (params?: TParams) => [...lists(), params] as const;
  const details = () => [...all, 'detail'] as const;
  const detail = (id: string) => [...details(), id] as const;

  return { all, lists, list, details, detail };
}
