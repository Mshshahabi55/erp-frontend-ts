export interface OrderTotals {
  subtotal: number;
  discountAmount: number;
  taxAmount: number;
  totalAmount: number;
}

const round2 = (value: number): number => Math.round(value * 100) / 100;

export const calculateLineTotal = (quantity: number, unitPrice: number): number => round2(quantity * unitPrice);

/**
 * Single source of truth for order math: subtotal is the sum of line items,
 * discount applies to the subtotal, tax applies to the discounted (taxable)
 * amount. Used identically by the form's live preview and by the mutation
 * hooks when building the final DTO, so they can never disagree.
 */
export const calculateOrderTotals = (
  items: { quantity: number; unitPrice: number }[],
  discountPercent: number,
  taxPercent: number
): OrderTotals => {
  const subtotal = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  const discountAmount = subtotal * (discountPercent / 100);
  const taxableAmount = subtotal - discountAmount;
  const taxAmount = taxableAmount * (taxPercent / 100);
  const totalAmount = taxableAmount + taxAmount;

  return {
    subtotal: round2(subtotal),
    discountAmount: round2(discountAmount),
    taxAmount: round2(taxAmount),
    totalAmount: round2(totalAmount),
  };
};
