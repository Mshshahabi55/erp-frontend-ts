import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { notify } from '@/shared/notifications';
import { companySettingsService } from '../services/companySettingsService';
import type { UpdateCompanySettingsDto } from '../types/settings.types';

export const companySettingsKeys = {
  all: ['companySettings'] as const,
};

export const useCompanySettings = () => {
  return useQuery({
    queryKey: companySettingsKeys.all,
    queryFn: companySettingsService.get,
  });
};

export const useUpdateCompanySettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateCompanySettingsDto) => companySettingsService.update(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: companySettingsKeys.all });
      notify.success('Company settings updated successfully!');
    },
    onError: (error) => {
      notify.error(error, 'Failed to update company settings');
    },
  });
};
