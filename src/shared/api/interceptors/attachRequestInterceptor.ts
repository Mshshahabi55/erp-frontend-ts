import type { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { getToken } from '@/shared/utils/tokenStorage';

/** Attaches the stored access token to every outgoing request. */
export const attachRequestInterceptor = (client: AxiosInstance): void => {
  client.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token = getToken();
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );
};
