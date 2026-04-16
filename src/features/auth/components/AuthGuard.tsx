import { useCallback } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useIdleTimeout } from '@/hooks/useIdleTimeout';
import { toast } from 'sonner';

interface AuthGuardProps {
  children: React.ReactNode;
}

const IDLE_TIMEOUT_MS = 15 * 60 * 1000; // 15 minutes
const IDLE_WARNING_MS = 2 * 60 * 1000;  // warn 2 min before

export function AuthGuard({ children }: AuthGuardProps) {
  const { isLoading, isAuthenticated, signOut } = useAuth();
  const navigate = useNavigate();

  const handleIdleWarning = useCallback(() => {
    toast.warning('Votre session expirera dans 2 minutes en raison d\'inactivité.', {
      duration: 10000,
    });
  }, []);

  const handleIdleTimeout = useCallback(async () => {
    await signOut();
    navigate('/login', { replace: true });
    toast.error('Session expirée pour inactivité. Veuillez vous reconnecter.');
  }, [signOut, navigate]);

  useIdleTimeout({
    timeoutMs: IDLE_TIMEOUT_MS,
    warningMs: IDLE_WARNING_MS,
    onWarning: handleIdleWarning,
    onTimeout: handleIdleTimeout,
    enabled: isAuthenticated,
  });

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

  return <>{children}</>;
}
