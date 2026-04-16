import { useState, useCallback } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { MfaVerification } from './MfaVerification';
import { useIdleTimeout } from '@/hooks/useIdleTimeout';
import { toast } from 'sonner';

interface AuthGuardProps {
  children: React.ReactNode;
}

const ADMIN_ROLES = ['global_admin', 'country_admin'] as const;
const IDLE_TIMEOUT_MS = 15 * 60 * 1000; // 15 minutes
const IDLE_WARNING_MS = 2 * 60 * 1000;  // warn 2 min before

export function AuthGuard({ children }: AuthGuardProps) {
  const { isLoading, isAuthenticated, roles, signOut } = useAuth();
  const [mfaVerified, setMfaVerified] = useState(false);
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

  // Check if user is admin and needs MFA
  const isAdmin = ADMIN_ROLES.some((r) => roles.includes(r));
  if (isAdmin && !mfaVerified) {
    return (
      <MfaVerification
        onVerified={() => setMfaVerified(true)}
        onCancel={() => signOut()}
      />
    );
  }

  return <>{children}</>;
}
