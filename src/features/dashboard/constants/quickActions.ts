export interface QuickAction {
  label: string;
  path: string;
}

export const quickActions: QuickAction[] = [
  { label: 'Add Customer', path: '/customers' },
  { label: 'Add Product', path: '/products' },
  { label: 'View Orders', path: '/orders' },
];
