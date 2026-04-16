import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import type { AppRole } from '@/core/constants/roles';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: AppRole[];
  fallback?: string;
}

export function RoleGuard({ children, allowedRoles, fallback = '/unauthorized' }: RoleGuardProps) {
  const { roles, isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const hasAccess = allowedRoles.some((role) => roles.includes(role));
  if (!hasAccess) {
    return <Navigate to={fallback} replace />;
  }

  return <>{children}</>;
}
