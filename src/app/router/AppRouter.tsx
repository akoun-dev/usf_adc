import { Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { AuthGuard, RoleGuard } from '@/features/auth';
import { ErrorBoundary } from '@/core/errors/ErrorBoundary';
import AppLayout from '@/features/shell/layouts/AppLayout';
import Index from '@/pages/Index';
import NotFound from '@/pages/NotFound';
import LoginPage from '@/features/auth/pages/LoginPage';
import ForgotPasswordPage from '@/features/auth/pages/ForgotPasswordPage';
import ResetPasswordPage from '@/features/auth/pages/ResetPasswordPage';
import UnauthorizedPage from '@/features/auth/pages/UnauthorizedPage';
import { AcceptInvitationPage } from '@/features/invitations';
import { AUTHENTICATED_ROUTES, PUBLIC_ROUTES } from './routes';

const LazyFallback = () => (
  <div className="flex items-center justify-center py-20">
    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
  </div>
);

export default function AppRouter() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />
      <Route path="/accept-invitation" element={<AcceptInvitationPage />} />

      {/* New public pages */}
      {PUBLIC_ROUTES.map(({ path, component: Component }) => (
        <Route
          key={path}
          path={path}
          element={
            <Suspense fallback={<LazyFallback />}>
              <ErrorBoundary>
                <Component />
              </ErrorBoundary>
            </Suspense>
          }
        />
      ))}

      {/* Authenticated shell */}
      <Route
        element={
          <AuthGuard>
            <Suspense fallback={<LazyFallback />}>
              <AppLayout />
            </Suspense>
          </AuthGuard>
        }
      >
        {AUTHENTICATED_ROUTES.map(({ path, component: Component, roles }) => (
          <Route
            key={path}
            path={path}
            element={
              <ErrorBoundary>
                {roles ? (
                  <RoleGuard allowedRoles={roles}>
                    <Component />
                  </RoleGuard>
                ) : (
                  <Component />
                )}
              </ErrorBoundary>
            }
          />
        ))}
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
