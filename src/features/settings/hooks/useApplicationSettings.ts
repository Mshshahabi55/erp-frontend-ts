import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { notify } from '@/shared/notifications';
import { applicationSettingsService } from '../services/applicationSettingsService';
import type { UpdateApplicationSettingsDto } from '../types/settings.types';

export const applicationSettingsKeys = {
  all: ['applicationSettings'] as const,
};

export const useApplicationSettings = () => {
  return useQuery({
    queryKey: applicationSettingsKeys.all,
    queryFn: applicationSettingsService.get,
  });
};

export const useUpdateApplicationSettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateApplicationSettingsDto) => applicationSettingsService.update(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: applicationSettingsKeys.all });
      notify.success('Application settings updated successfully!');
    },
    onError: (error) => {
      notify.error(error, 'Failed to update application settings');
    },
  });
};
