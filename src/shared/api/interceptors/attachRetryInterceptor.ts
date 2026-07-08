import type { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';

type RetryableRequestConfig = InternalAxiosRequestConfig & { _retryCount?: number };

const MAX_RETRIES = 1;
const RETRY_DELAY_MS = 300;

/** Only idempotent reads are safe to replay automatically. */
const isRetryableRequest = (error: AxiosError): boolean => {
  if (error.config?.method?.toLowerCase() !== 'get') {
    return false;
  }
  // No response at all means a network/timeout failure; 5xx means a transient server fault.
  return !error.response || error.response.status >= 500;
};

const delay = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

/** Retries a failed GET request once after a short delay on network errors or 5xx responses. */
export const attachRetryInterceptor = (client: AxiosInstance): void => {
  client.interceptors.response.use(undefined, async (error: AxiosError) => {
    const config = error.config as RetryableRequestConfig | undefined;

    if (!config || !isRetryableRequest(error)) {
      return Promise.reject(error);
    }

    const retryCount = config._retryCount ?? 0;
    if (retryCount >= MAX_RETRIES) {
      return Promise.reject(error);
    }

    config._retryCount = retryCount + 1;
    await delay(RETRY_DELAY_MS);
    return client(config);
  });
};
