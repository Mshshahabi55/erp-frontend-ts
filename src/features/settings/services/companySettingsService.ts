import { apiClient } from '@/shared/api';
import type { CompanySettings, UpdateCompanySettingsDto } from '../types/settings.types';

const RESOURCE_PATH = '/companySettings';

// Not built on createJsonServerResource - that factory models a paginated
// list of records. Company settings is a single, always-existing config
// object (json-server serves a top-level object key as its own get/patch
// endpoint), so a plain get/update pair is the honest shape for it.
export const companySettingsService = {
  async get(): Promise<CompanySettings> {
    const response = await apiClient.get<CompanySettings>(RESOURCE_PATH);
    return response.data;
  },

  async update(data: UpdateCompanySettingsDto): Promise<CompanySettings> {
    const response = await apiClient.patch<CompanySettings>(RESOURCE_PATH, data);
    return response.data;
  },
};
