export interface RefreshedSession {
  accessToken: string;
  refreshToken: string;
}

type RefreshHandler = (refreshToken: string) => Promise<RefreshedSession>;

let refreshHandler: RefreshHandler | null = null;

/**
 * Supplies the real token-refresh implementation. The API layer can't import
 * the auth feature directly (wrong dependency direction), so the auth feature
 * registers itself here once at startup instead.
 */
export const registerRefreshHandler = (handler: RefreshHandler): void => {
  refreshHandler = handler;
};

/** Used by the response interceptor to refresh an expired access token on a 401. */
export const refreshSession = (refreshToken: string): Promise<RefreshedSession> => {
  if (!refreshHandler) {
    return Promise.reject(new Error('No refresh handler registered'));
  }
  return refreshHandler(refreshToken);
};
