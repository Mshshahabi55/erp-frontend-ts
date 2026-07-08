import { createJsonServerResource } from '@/shared/api';
import type { WithRawId } from '@/shared/types';
import { Category, CreateCategoryDto, UpdateCategoryDto, CategoryQueryParams } from '../types/category.types';

export type { Category, CreateCategoryDto, UpdateCategoryDto, CategoryQueryParams };

type RawCategory = WithRawId<Category>;

const normalizeCategory = (raw: RawCategory): Category => ({
  ...raw,
  id: String(raw.id),
});

export const categoryService = createJsonServerResource<
  Category,
  RawCategory,
  CreateCategoryDto,
  UpdateCategoryDto,
  CategoryQueryParams
>({
  resourcePath: '/categories',
  normalize: normalizeCategory,
  searchFields: ['name', 'description'],
  buildFilters: (params) => {
    const filters: Record<string, unknown> = {};

    if (params?.isActive !== undefined) {
      filters.isActive = params.isActive;
    }

    if (params?.sortBy) {
      filters._sort = params.sortDirection === 'desc' ? `-${params.sortBy}` : params.sortBy;
    }

    return filters;
  },
});
