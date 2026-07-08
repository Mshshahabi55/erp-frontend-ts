import { customerService } from '@/features/customers/services/customerService';
import { productService } from '@/features/products/services/productService';
import { supplierService } from '@/features/suppliers/services/supplierService';
import { orderService } from '@/features/orders/services/orderService';
import { saleService } from '@/features/sales/services/saleService';
import { purchaseService } from '@/features/purchases/services/purchaseService';
import { employeeService } from '@/features/employees/services/employeeService';
import { categoryService } from '@/features/categories/services/categoryService';
import { warehouseService } from '@/features/warehouses/services/warehouseService';
import { userService } from '@/features/users/services/userService';
import type { SearchableEntity, SearchResultItem } from '../types/search.types';

const RESULTS_PER_ENTITY = 5;

interface SearchProvider {
  entity: SearchableEntity;
  label: string;
  run: (term: string) => Promise<SearchResultItem[]>;
}

// Each provider is a thin adapter over a feature's *existing* service - none
// of them re-implement text matching (every service already searches via its
// own searchFields on createJsonServerResource). Only Orders has a real
// detail route today, so every other entity links to its list page.
const providers: SearchProvider[] = [
  {
    entity: 'customer',
    label: 'Customers',
    run: async (term) => {
      const { data } = await customerService.getAll({ search: term, limit: RESULTS_PER_ENTITY });
      return data.map((customer) => ({
        id: customer.id,
        entity: 'customer',
        title: customer.name,
        subtitle: customer.email,
        path: '/customers',
      }));
    },
  },
  {
    entity: 'product',
    label: 'Products',
    run: async (term) => {
      const { data } = await productService.getAll({ search: term, limit: RESULTS_PER_ENTITY });
      return data.map((product) => ({
        id: product.id,
        entity: 'product',
        title: product.name,
        subtitle: product.sku,
        path: '/products',
      }));
    },
  },
  {
    entity: 'supplier',
    label: 'Suppliers',
    run: async (term) => {
      const { data } = await supplierService.getAll({ search: term, limit: RESULTS_PER_ENTITY });
      return data.map((supplier) => ({
        id: supplier.id,
        entity: 'supplier',
        title: supplier.name,
        subtitle: supplier.contactName,
        path: '/suppliers',
      }));
    },
  },
  {
    entity: 'order',
    label: 'Orders',
    run: async (term) => {
      const { data } = await orderService.getAll({ search: term, limit: RESULTS_PER_ENTITY });
      return data.map((order) => ({
        id: order.id,
        entity: 'order',
        title: order.orderNumber,
        subtitle: order.status,
        path: `/orders/${order.id}`,
      }));
    },
  },
  {
    entity: 'sale',
    label: 'Sales',
    run: async (term) => {
      const { data } = await saleService.getAll({ search: term, limit: RESULTS_PER_ENTITY });
      return data.map((sale) => ({
        id: sale.id,
        entity: 'sale',
        title: sale.invoiceNumber,
        subtitle: sale.status,
        path: '/sales',
      }));
    },
  },
  {
    entity: 'purchase',
    label: 'Purchases',
    run: async (term) => {
      const { data } = await purchaseService.getAll({ search: term, limit: RESULTS_PER_ENTITY });
      return data.map((purchase) => ({
        id: purchase.id,
        entity: 'purchase',
        title: purchase.purchaseNumber,
        subtitle: purchase.status,
        path: '/purchases',
      }));
    },
  },
  {
    entity: 'employee',
    label: 'Employees',
    run: async (term) => {
      const { data } = await employeeService.getAll({ search: term, limit: RESULTS_PER_ENTITY });
      return data.map((employee) => ({
        id: employee.id,
        entity: 'employee',
        title: employee.fullName,
        subtitle: employee.position,
        path: '/employees',
      }));
    },
  },
  {
    entity: 'category',
    label: 'Categories',
    run: async (term) => {
      const { data } = await categoryService.getAll({ search: term, limit: RESULTS_PER_ENTITY });
      return data.map((category) => ({
        id: category.id,
        entity: 'category',
        title: category.name,
        subtitle: category.description,
        path: '/categories',
      }));
    },
  },
  {
    entity: 'warehouse',
    label: 'Warehouses',
    run: async (term) => {
      const { data } = await warehouseService.getAll({ search: term, limit: RESULTS_PER_ENTITY });
      return data.map((warehouse) => ({
        id: warehouse.id,
        entity: 'warehouse',
        title: warehouse.name,
        subtitle: warehouse.code,
        path: '/warehouses',
      }));
    },
  },
  {
    entity: 'user',
    label: 'Users',
    run: async (term) => {
      const { data } = await userService.getAll({ search: term, limit: RESULTS_PER_ENTITY });
      return data.map((user) => ({
        id: user.id,
        entity: 'user',
        title: user.fullName,
        subtitle: user.email,
        path: '/users',
      }));
    },
  },
];

export const globalSearchService = {
  /** Every provider's label, for populating an entity-type filter UI without duplicating this list elsewhere. */
  getEntityLabels: (): { entity: SearchableEntity; label: string }[] =>
    providers.map((provider) => ({ entity: provider.entity, label: provider.label })),

  async search(term: string, entities?: SearchableEntity[]): Promise<SearchResultItem[]> {
    const trimmed = term.trim();
    if (!trimmed) return [];

    const activeProviders = entities?.length
      ? providers.filter((provider) => entities.includes(provider.entity))
      : providers;

    const resultsByProvider = await Promise.all(
      activeProviders.map((provider) =>
        provider.run(trimmed).catch((error) => {
          // One entity's search failing (e.g. a transient network error)
          // shouldn't blank out results from every other entity.
          console.error(`Global search failed for "${provider.entity}":`, error);
          return [] as SearchResultItem[];
        })
      )
    );

    return resultsByProvider.flat();
  },
};
