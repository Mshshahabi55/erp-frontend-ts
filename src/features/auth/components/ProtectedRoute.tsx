import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { LoadingSpinner } from '@/shared/components';
import type { Permission, Role } from '@/shared/rbac';

interface ProtectedRouteProps {
  requiredPermission?: Permission;
  requiredRole?: Role;
}

export const ProtectedRoute = ({ requiredPermission, requiredRole }: ProtectedRouteProps) => {
  const { isAuthenticated, isInitializing, hasPermission, hasRole } = useAuth();

  if (isInitializing) {
    return <LoadingSpinner fullScreen message="Checking authentication..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredPermission && !hasPermission(requiredPermission)) {
    return <Navigate to="/unauthorized" replace />;
  }

  if (requiredRole && !hasRole(requiredRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};