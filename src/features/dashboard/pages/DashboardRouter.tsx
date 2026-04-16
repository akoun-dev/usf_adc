import { useAuth } from '@/features/auth/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { ROLE_DASHBOARD_PATHS } from '@/core/constants/roles';
import type { AppRole } from '@/core/constants/roles';

/**
 * Redirects to the appropriate dashboard based on user's highest role
 */
export default function DashboardRouter() {
  const { highestRole, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  const role = highestRole();
  const path = role ? ROLE_DASHBOARD_PATHS[role as AppRole] : '/';
  return <Navigate to={path} replace />;
}
