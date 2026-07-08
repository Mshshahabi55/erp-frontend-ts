import type { Product } from '@/features/products/types/product.types';
import { calculateLineTotal, calculateOrderTotals } from './orderCalculations';
import type { OrderFormData } from '../types/order.schema';
import type { OrderItem, CreateOrderDto, OrderStatus } from '../types/order.types';

const generateOrderNumber = (): string => `ORD-${Date.now()}`;

/** Resolves each line item's product snapshot (name/SKU) and computed total from the catalog. */
const buildOrderItems = (formItems: OrderFormData['items'], products: Product[]): OrderItem[] => {
  const productById = new Map(products.map((product) => [product.id, product]));

  return formItems.map((item) => {
    const product = productById.get(item.productId);
    return {
      productId: item.productId,
      productName: product?.name ?? 'Unknown product',
      sku: product?.sku ?? '',
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      lineTotal: calculateLineTotal(item.quantity, item.unitPrice),
    };
  });
};

/** Builds the full order payload (DTO) from form data - the single place that derives items/totals so create and update can't disagree. */
export const buildOrderPayload = (
  formData: OrderFormData,
  products: Product[],
  status: OrderStatus
): Omit<CreateOrderDto, 'orderNumber'> => {
  const items = buildOrderItems(formData.items, products);
  const totals = calculateOrderTotals(items, formData.discountPercent, formData.taxPercent);

  return {
    customerId: formData.customerId,
    items,
    discountPercent: formData.discountPercent,
    taxPercent: formData.taxPercent,
    orderDate: formData.orderDate,
    status,
    ...totals,
  };
};

export const buildNewOrderPayload = (formData: OrderFormData, products: Product[]): CreateOrderDto => ({
  orderNumber: generateOrderNumber(),
  ...buildOrderPayload(formData, products, 'pending'),
});
