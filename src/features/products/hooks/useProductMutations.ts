import { useMutation, useQueryClient } from '@tanstack/react-query';
import { notify } from '@/shared/notifications';
import { productService } from '../services/productService';
import { productKeys } from './useProducts';
import type { CreateProductDto, UpdateProductDto } from '../types/product.types';

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateProductDto) => productService.create(data),
    onSuccess: (product) => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      notify.success(`Product "${product.name}" created successfully!`);
    },
    onError: (error) => {
      notify.error(error, 'Failed to create product');
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateProductDto }) =>
      productService.update(id, data),
    onSuccess: (product) => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      notify.success(`Product "${product.name}" updated successfully!`);
    },
    onError: (error) => {
      notify.error(error, 'Failed to update product');
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => productService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      notify.success('Product deleted successfully!');
    },
    onError: (error) => {
      notify.error(error, 'Failed to delete product');
    },
  });
};
