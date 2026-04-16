import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { authService } from '../services/auth-service';
import type { Session, User } from '@supabase/supabase-js';
import type { AppRole } from '@/core/constants/roles';
import { ROLE_HIERARCHY } from '@/core/constants/roles';
import type { UserProfile } from '@/core/types/profile';
import i18n from '@/i18n';

interface AuthState {
  session: Session | null;
  user: User | null;
  roles: AppRole[];
  profile: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface AuthContextType extends AuthState {
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (password: string) => Promise<void>;
  refreshProfile: () => Promise<void>;
  hasRole: (role: AppRole) => boolean;
  highestRole: () => AppRole | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    session: null,
    user: null,
    roles: [],
    profile: null,
    isLoading: true,
    isAuthenticated: false,
  });

  const loadUserData = useCallback(async (user: User) => {
    try {
      const [roles, profile] = await Promise.all([
        authService.getUserRoles(user.id),
        authService.getUserProfile(user.id),
      ]);
      const typedProfile = profile as UserProfile | null;
      setState((prev) => ({
        ...prev,
        roles,
        profile: typedProfile,
        isLoading: false,
      }));
      // Sync i18n language with user profile preference
      if (typedProfile?.language && ['fr', 'en', 'pt'].includes(typedProfile.language)) {
        i18n.changeLanguage(typedProfile.language);
      }
    } catch {
      setState((prev) => ({ ...prev, roles: [], profile: null, isLoading: false }));
    }
  }, []);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setState((prev) => ({
          ...prev,
          session,
          user: session?.user ?? null,
          isAuthenticated: !!session?.user,
          isLoading: !!session?.user,
        }));

        if (session?.user) {
          setTimeout(() => loadUserData(session.user), 0);
        } else {
          setState((prev) => ({ ...prev, roles: [], profile: null, isLoading: false }));
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setState((prev) => ({
        ...prev,
        session,
        user: session?.user ?? null,
        isAuthenticated: !!session?.user,
        isLoading: !!session?.user,
      }));
      if (session?.user) {
        loadUserData(session.user);
      } else {
        setState((prev) => ({ ...prev, isLoading: false }));
      }
    });

    return () => subscription.unsubscribe();
  }, [loadUserData]);

  const signIn = async (email: string, password: string) => {
    await authService.signIn(email, password);
  };

  const signOut = async () => {
    await authService.signOut();
  };

  const resetPassword = async (email: string) => {
    await authService.resetPassword(email);
  };

  const updatePassword = async (password: string) => {
    await authService.updatePassword(password);
  };

  const refreshProfile = async () => {
    if (state.user) {
      await loadUserData(state.user);
    }
  };

  const hasRole = (role: AppRole) => state.roles.includes(role);

  // Reuse ROLE_HIERARCHY from constants (highest index = most privileges)
  const highestRole = (): AppRole | null => {
    const reversed = [...ROLE_HIERARCHY].reverse();
    return reversed.find((r) => state.roles.includes(r)) ?? null;
  };

  return (
    <AuthContext.Provider
      value={{ ...state, signIn, signOut, resetPassword, updatePassword, refreshProfile, hasRole, highestRole }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
