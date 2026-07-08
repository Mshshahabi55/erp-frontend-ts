import { createContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { authService } from '../services/authService';
import { persistedUserSchema } from '../types/auth.schema';
import { User, LoginRequest, ChangePasswordRequest, AuthContextType } from '../types/auth.types';
import { setRolePermissions, type Permission, type Role } from '@/shared/rbac';
import { rolePermissionKeys, toRolePermissionMap } from '@/features/roles/hooks/useRolePermissions';
import { rolePermissionService } from '@/features/roles/services/rolePermissionService';
import {
  getToken,
  getRefreshToken,
  setTokens,
  removeTokens,
  getUser,
  setUser,
  removeUser,
  isTokenExpired,
} from '@/shared/utils/tokenStorage';
import { LoadingSpinner } from '@/shared/components';
import { notify } from '@/shared/notifications';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

/** Returns the persisted user only if it still matches the expected shape. */
const readStoredUser = (): User | null => {
  const result = persistedUserSchema.safeParse(getUser());
  return result.success ? result.data : null;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUserState] = useState<User | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    const loadRolePermissions = async () => {
      try {
        const records = await queryClient.fetchQuery({
          queryKey: rolePermissionKeys.all,
          queryFn: rolePermissionService.getAll,
        });
        setRolePermissions(toRolePermissionMap(records));
      } catch (error) {
        // Falls back to shared/rbac's static DEFAULT_ROLE_PERMISSIONS (already
        // the module's initial state) - saved admin edits just won't be
        // reflected until the next successful load, not a fatal error.
        console.error('Failed to load role permissions, using defaults:', error);
      }
    };

    const restoreSession = async () => {
      await loadRolePermissions();

      const token = getToken();
      const storedUser = readStoredUser();

      if (!token || !storedUser) {
        removeTokens();
        removeUser();
        setIsInitializing(false);
        return;
      }

      if (!isTokenExpired(token)) {
        setUserState(storedUser);
        setIsInitializing(false);
        return;
      }

      try {
        const refreshToken = getRefreshToken();
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }
        const response = await authService.refreshToken({ refreshToken });
        setTokens(response.accessToken, response.refreshToken);
        setUser(response.user);
        setUserState(response.user);
      } catch (error) {
        console.error('Session restoration failed:', error);
        removeTokens();
        removeUser();
      } finally {
        setIsInitializing(false);
      }
    };

    restoreSession();
  }, [queryClient]);

  const login = useCallback(async (credentials: LoginRequest): Promise<void> => {
    try {
      const response = await authService.login(credentials);
      setTokens(response.accessToken, response.refreshToken);
      setUser(response.user);
      setUserState(response.user);
      notify.success(`Welcome back, ${response.user.fullName}!`);
      navigate('/dashboard');
    } catch (error) {
      notify.error(error, 'Login failed. Please try again.');
      throw error;
    }
  }, [navigate]);

  const logout = useCallback(async (): Promise<void> => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      removeTokens();
      removeUser();
      setUserState(null);
      navigate('/login');
      notify.success('Logged out successfully');
    }
  }, [navigate]);

  const changePassword = useCallback(async (data: ChangePasswordRequest): Promise<void> => {
    try {
      await authService.changePassword(data);
      notify.success('Password changed successfully');
    } catch (error) {
      notify.error(error, 'Failed to change password');
      throw error;
    }
  }, []);

  const hasPermission = useCallback((permission: Permission): boolean => {
    return authService.hasPermission(user, permission);
  }, [user]);

  const hasRole = useCallback((role: Role): boolean => {
    return authService.hasRole(user, role);
  }, [user]);

  if (isInitializing) {
    return <LoadingSpinner fullScreen message="Loading..." />;
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isInitializing,
        isAuthenticated: !!user,
        login,
        logout,
        changePassword,
        hasPermission,
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
