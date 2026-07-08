import { useQuery } from '@tanstack/react-query';
import { createQueryKeyFactory } from '@/shared/query';
import { productService } from '../services/productService';
import type { ProductQueryParams } from '../types/product.types';

export const productKeys = createQueryKeyFactory<ProductQueryParams>('products');

export const useProducts = (params?: ProductQueryParams) => {
  return useQuery({
    queryKey: productKeys.list(params),
    queryFn: () => productService.getAll(params),
  });
};
