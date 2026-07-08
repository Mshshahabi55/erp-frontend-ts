export const SEARCHABLE_ENTITIES = [
  'customer', 'product', 'supplier', 'order', 'sale',
  'purchase', 'employee', 'category', 'warehouse', 'user',
] as const;
export type SearchableEntity = (typeof SEARCHABLE_ENTITIES)[number];

export interface SearchResultItem {
  id: string;
  entity: SearchableEntity;
  title: string;
  subtitle?: string;
  /** Route to navigate to when the result is selected - the entity's detail page if it has one, otherwise its list page. */
  path: string;
}
