import axios from 'axios';
import { environment } from '@/config/environment';
import { attachRequestInterceptor } from './interceptors/attachRequestInterceptor';
import { attachRetryInterceptor } from './interceptors/attachRetryInterceptor';
import { attachResponseInterceptor } from './interceptors/attachResponseInterceptor';

const apiClient = axios.create({
  baseURL: environment.apiBaseUrl,
  timeout: environment.apiTimeout,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

attachRequestInterceptor(apiClient);
// Retry must be registered before the error-mapping interceptor so it sees the raw AxiosError.
attachRetryInterceptor(apiClient);
attachResponseInterceptor(apiClient);

export default apiClient;
