import { apiClient } from '@/shared/api';
import type { ApplicationSettings, UpdateApplicationSettingsDto } from '../types/settings.types';

const RESOURCE_PATH = '/applicationSettings';

// Same singleton shape as companySettingsService - one config object, not a
// paginated collection.
export const applicationSettingsService = {
  async get(): Promise<ApplicationSettings> {
    const response = await apiClient.get<ApplicationSettings>(RESOURCE_PATH);
    return response.data;
  },

  async update(data: UpdateApplicationSettingsDto): Promise<ApplicationSettings> {
    const response = await apiClient.patch<ApplicationSettings>(RESOURCE_PATH, data);
    return response.data;
  },
};
