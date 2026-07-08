import type { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { getRefreshToken, setTokens, removeTokens } from '@/shared/utils/tokenStorage';
import type { ApiResponse } from '@/shared/types/api.types';
import { parseValidationErrorMessage, type ValidationErrorResponseBody } from '../parseValidationErrorMessage';
import { refreshSession } from '../authSession';

type RetryableRequestConfig = InternalAxiosRequestConfig & { _retry?: boolean };

const refreshAccessToken = async (): Promise<string> => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    throw new Error('No refresh token available');
  }

  const { accessToken, refreshToken: newRefreshToken } = await refreshSession(refreshToken);
  setTokens(accessToken, newRefreshToken);
  return accessToken;
};

const statusErrorMessages: Record<number, string> = {
  403: 'You do not have permission to perform this action',
  404: 'Resource not found',
};

/**
 * Unwraps the `ApiResponse` envelope on success, and on failure maps HTTP
 * errors to plain `Error`s with user-facing messages (retrying once via
 * refresh token on a 401).
 */
export const attachResponseInterceptor = (client: AxiosInstance): void => {
  client.interceptors.response.use(
    (response) => {
      if (response.data && 'isSuccess' in response.data) {
        const apiResponse = response.data as ApiResponse;
        if (!apiResponse.isSuccess) {
          return Promise.reject(new Error(apiResponse.message || 'Request failed'));
        }
        response.data = apiResponse.data;
      }
      return response;
    },
    async (error: AxiosError) => {
      const originalRequest = error.config as RetryableRequestConfig;
      const status = error.response?.status;

      if (status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const accessToken = await refreshAccessToken();
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          }
          return client(originalRequest);
        } catch {
          removeTokens();
          window.location.href = '/login';
          return Promise.reject(error);
        }
      }

      if (!error.response) {
        const isTimeout = error.code === 'ECONNABORTED' || error.message.toLowerCase().includes('timeout');
        return Promise.reject(
          new Error(isTimeout ? 'Request timed out. Please try again.' : 'Network error. Please check your connection.')
        );
      }

      if (status === 400) {
        const message = parseValidationErrorMessage(error.response?.data as ValidationErrorResponseBody);
        if (message) {
          return Promise.reject(new Error(message));
        }
      }

      if (status && status in statusErrorMessages) {
        return Promise.reject(new Error(statusErrorMessages[status]));
      }

      if (status && status >= 500) {
        return Promise.reject(new Error('Internal server error. Please try again later.'));
      }

      return Promise.reject(error);
    }
  );
};
