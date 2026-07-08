import type { ReactNode } from 'react';
import {
  Dashboard,
  Storefront,
  ShoppingCart,
  PointOfSale,
  ShoppingBasket,
  ReceiptLong,
  LocalShipping,
  Inventory2,
  Inventory,
  Category,
  Storage,
  Warehouse,
  Groups,
  People,
  BusinessCenter,
  Badge,
  AdminPanelSettings,
  ManageAccounts,
  Security,
  Assessment,
  Notifications,
  History,
  Settings,
} from '@mui/icons-material';
import type { Permission } from '@/shared/rbac';

export interface NavLeafItem {
  type: 'link';
  label: string;
  path: string;
  icon: ReactNode;
  requiredPermission?: Permission;
}

export interface NavGroupItem {
  type: 'group';
  label: string;
  icon: ReactNode;
  children: NavLeafItem[];
}

export interface NavDivider {
  type: 'divider';
}

export type NavItem = NavLeafItem | NavGroupItem | NavDivider;

/**
 * Single source of truth for the sidebar's structure. The Sidebar renders
 * this directly rather than hardcoding menu markup, so reorganizing the menu
 * (or adding a new page's nav entry) means editing data here, not JSX.
 */
export const navigationConfig: NavItem[] = [
  { type: 'link', label: 'Dashboard', path: '/dashboard', icon: <Dashboard /> },

  { type: 'divider' },

  {
    type: 'group',
    label: 'Sales',
    icon: <Storefront />,
    children: [
      { type: 'link', label: 'Orders', path: '/orders', icon: <ShoppingCart /> },
      { type: 'link', label: 'Sales', path: '/sales', icon: <PointOfSale /> },
    ],
  },
  {
    type: 'group',
    label: 'Purchasing',
    icon: <ShoppingBasket />,
    children: [
      { type: 'link', label: 'Purchases', path: '/purchases', icon: <ReceiptLong /> },
      { type: 'link', label: 'Suppliers', path: '/suppliers', icon: <LocalShipping /> },
    ],
  },
  {
    type: 'group',
    label: 'Inventory',
    icon: <Inventory2 />,
    children: [
      { type: 'link', label: 'Products', path: '/products', icon: <Inventory /> },
      { type: 'link', label: 'Categories', path: '/categories', icon: <Category /> },
      { type: 'link', label: 'Warehouses', path: '/warehouses', icon: <Storage /> },
      { type: 'link', label: 'Inventory', path: '/inventory', icon: <Warehouse /> },
    ],
  },
  {
    type: 'group',
    label: 'CRM',
    icon: <Groups />,
    children: [
      { type: 'link', label: 'Customers', path: '/customers', icon: <People /> },
    ],
  },
  {
    type: 'group',
    label: 'Human Resources',
    icon: <BusinessCenter />,
    children: [
      { type: 'link', label: 'Employees', path: '/employees', icon: <Badge /> },
    ],
  },
  {
    type: 'group',
    label: 'Administration',
    icon: <AdminPanelSettings />,
    children: [
      { type: 'link', label: 'Users', path: '/users', icon: <ManageAccounts /> },
      {
        type: 'link',
        label: 'Roles & Permissions',
        path: '/roles-permissions',
        icon: <Security />,
        requiredPermission: 'manage_users',
      },
    ],
  },

  { type: 'link', label: 'Reports', path: '/reports', icon: <Assessment /> },

  { type: 'divider' },

  { type: 'link', label: 'Notifications', path: '/notifications', icon: <Notifications /> },
  {
    type: 'link',
    label: 'Audit Logs',
    path: '/audit-logs',
    icon: <History />,
    requiredPermission: 'manage_users',
  },
  { type: 'link', label: 'Settings', path: '/settings', icon: <Settings /> },
];
