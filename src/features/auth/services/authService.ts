import { registerRefreshHandler } from '@/shared/api';
import { roleHasPermission, type Permission, type Role } from '@/shared/rbac';
import { User, LoginRequest, LoginResponse, RefreshTokenRequest, ChangePasswordRequest } from '../types/auth.types';

const MOCK_USER: User = {
  id: 1,
  username: 'admin',
  email: 'admin@erp.com',
  firstName: 'Admin',
  lastName: 'User',
  fullName: 'Admin User',
  roles: ['admin'],
  avatar: '',
};

const ACCESS_TOKEN_TTL_MS = 60 * 60 * 1000;

const base64UrlEncode = (value: unknown): string =>
  btoa(JSON.stringify(value))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

/**
 * Mints a real (if unsigned) JWT shape so client-side expiry checks work the
 * same way they will against a real backend — this mock has no server to sign
 * against, so the "signature" segment is just a fixed placeholder.
 */
const createMockAccessToken = (userId: number): string => {
  const header = base64UrlEncode({ alg: 'none', typ: 'JWT' });
  const payload = base64UrlEncode({
    sub: userId,
    exp: Math.floor((Date.now() + ACCESS_TOKEN_TTL_MS) / 1000),
  });
  return `${header}.${payload}.mock-signature`;
};

const createMockSession = (): LoginResponse => ({
  accessToken: createMockAccessToken(MOCK_USER.id),
  refreshToken: 'mock-refresh-token-' + Date.now(),
  expiresAt: new Date(Date.now() + ACCESS_TOKEN_TTL_MS).toISOString(),
  user: MOCK_USER,
});

export const authService = {
  /**
   * Mock login - accepts any non-empty username/password.
   */
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (credentials.username && credentials.password) {
      return createMockSession();
    }

    throw new Error('Invalid credentials');
  },

  refreshToken: async (request: RefreshTokenRequest): Promise<LoginResponse> => {
    if (!request.refreshToken) {
      throw new Error('No refresh token available');
    }

    await new Promise((resolve) => setTimeout(resolve, 500));
    return createMockSession();
  },

  logout: async (): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
  },

  getCurrentUser: async (): Promise<User> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return MOCK_USER;
  },

  changePassword: async (_request: ChangePasswordRequest): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 800));
  },

  // Permissions are derived from roles (see @/shared/rbac), not stored on the
  // user - so this is just a thin, typed pass-through to that RBAC structure.
  hasPermission: (user: User | null, permission: Permission): boolean => {
    if (!user) return false;
    return roleHasPermission(user.roles, permission);
  },

  hasRole: (user: User | null, role: Role): boolean => {
    if (!user) return false;
    return user.roles.includes(role);
  },
};

// Registers this feature's refresh implementation with the API layer so the
// axios response interceptor can trigger a refresh on 401 without the shared
// layer depending on this feature.
registerRefreshHandler(async (refreshToken) => {
  const session = await authService.refreshToken({ refreshToken });
  return { accessToken: session.accessToken, refreshToken: session.refreshToken };
});
