import { useQuery } from '@tanstack/react-query';
import { createQueryKeyFactory } from '@/shared/query';
import { userService } from '../services/userService';
import type { UserQueryParams } from '../types/user.types';

export const userKeys = createQueryKeyFactory<UserQueryParams>('users');

export const useUsers = (params?: UserQueryParams) => {
  return useQuery({
    queryKey: userKeys.list(params),
    queryFn: () => userService.getAll(params),
  });
};
