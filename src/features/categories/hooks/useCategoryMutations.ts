import { useMutation, useQueryClient } from '@tanstack/react-query';
import { notify } from '@/shared/notifications';
import { categoryService } from '../services/categoryService';
import { categoryKeys } from './useCategories';
import type { CategoryFormData } from '../types/category.schema';

const CATEGORY_UNIQUENESS_CHECK_LIMIT = 100;

// json-server enforces no uniqueness constraints, so a duplicate category
// name (case-insensitive - "Electronics" vs "electronics" is the same
// category to a user) would otherwise only surface as confusing duplicate
// entries in every dropdown that lists categories.
const assertUniqueName = async (name: string, excludeId?: string): Promise<void> => {
  const { data: existing } = await categoryService.getAll({ limit: CATEGORY_UNIQUENESS_CHECK_LIMIT });
  const collision = existing.find(
    (category) => category.id !== excludeId && category.name.toLowerCase() === name.toLowerCase()
  );
  if (collision) {
    throw new Error(`A category named "${name}" already exists`);
  }
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CategoryFormData) => {
      await assertUniqueName(data.name);
      return categoryService.create(data);
    },
    onSuccess: (category) => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
      notify.success(`Category "${category.name}" created successfully!`);
    },
    onError: (error) => {
      notify.error(error, 'Failed to create category');
    },
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: CategoryFormData }) => {
      await assertUniqueName(data.name, id);
      return categoryService.update(id, data);
    },
    onSuccess: (category) => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
      notify.success(`Category "${category.name}" updated successfully!`);
    },
    onError: (error) => {
      notify.error(error, 'Failed to update category');
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => categoryService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
      notify.success('Category deleted successfully!');
    },
    onError: (error) => {
      notify.error(error, 'Failed to delete category');
    },
  });
};
