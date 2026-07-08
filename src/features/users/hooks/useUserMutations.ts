import { useMutation, useQueryClient } from '@tanstack/react-query';
import { notify } from '@/shared/notifications';
import { userService } from '../services/userService';
import { userKeys } from './useUsers';
import type { CreateUserFormData, UpdateUserFormData } from '../types/user.schema';

const toFullName = (data: Pick<CreateUserFormData, 'firstName' | 'lastName'>): string =>
  `${data.firstName} ${data.lastName}`;

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateUserFormData) => {
      const { confirmPassword: _confirmPassword, ...rest } = data;
      return userService.create({ ...rest, fullName: toFullName(data) });
    },
    onSuccess: (user) => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      notify.success(`User "${user.fullName}" created successfully!`);
    },
    onError: (error) => {
      notify.error(error, 'Failed to create user');
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserFormData }) =>
      userService.update(id, { ...data, fullName: toFullName(data) }),
    onSuccess: (user) => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      notify.success(`User "${user.fullName}" updated successfully!`);
    },
    onError: (error) => {
      notify.error(error, 'Failed to update user');
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => userService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      notify.success('User deleted successfully!');
    },
    onError: (error) => {
      notify.error(error, 'Failed to delete user');
    },
  });
};
