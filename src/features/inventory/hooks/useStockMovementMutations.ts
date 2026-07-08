import { useMutation, useQueryClient } from '@tanstack/react-query';
import { notify } from '@/shared/notifications';
import { productService } from '@/features/products/services/productService';
import { productKeys } from '@/features/products/hooks/useProducts';
import { stockMovementService } from '../services/stockMovementService';
import { stockMovementKeys } from './useStockMovements';
import type { CreateStockMovementDto } from '../types/stockMovement.types';

const computeNewStock = (currentStock: number, movement: CreateStockMovementDto): number => {
  switch (movement.type) {
    case 'in':
      return currentStock + movement.quantity;
    case 'out':
      return Math.max(0, currentStock - movement.quantity);
    case 'adjustment':
      return movement.quantity;
  }
};

/** Records a movement and applies its effect to the product's stock level. */
export const useCreateStockMovement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateStockMovementDto) => {
      const movement = await stockMovementService.create(data);

      const product = await productService.getById(data.productId);
      await productService.update(data.productId, {
        stock: computeNewStock(product.stock, data),
      });

      return movement;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: stockMovementKeys.lists() });
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      notify.success('Stock movement recorded successfully!');
    },
    onError: (error) => {
      notify.error(error, 'Failed to record stock movement');
    },
  });
};
