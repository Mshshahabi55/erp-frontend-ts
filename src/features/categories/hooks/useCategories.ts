import { useQuery } from '@tanstack/react-query';
import { createQueryKeyFactory } from '@/shared/query';
import { categoryService } from '../services/categoryService';
import type { CategoryQueryParams } from '../types/category.types';

export const categoryKeys = createQueryKeyFactory<CategoryQueryParams>('categories');

export const useCategories = (params?: CategoryQueryParams) => {
  return useQuery({
    queryKey: categoryKeys.list(params),
    queryFn: () => categoryService.getAll(params),
  });
};
