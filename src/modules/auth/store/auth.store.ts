import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthSession, SafeUser } from '../types';

interface AuthState {
  user: SafeUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  setSession: (session: AuthSession) => void;
  clearSession: () => void;
}

/**
 * Global client-side auth state. Persisted to localStorage so a page
 * refresh doesn't drop the session - src/lib/apiClient.ts reads the tokens
 * out of this store (via getState(), not a hook) for its request/response
 * interceptors. Other modules that need cross-cutting client state should
 * follow this same "store.ts" pattern, but most modules won't need one -
 * server state belongs in TanStack Query (see auth.hooks.ts), not here.
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      setSession: ({ user, accessToken, refreshToken }) =>
        set({ user, accessToken, refreshToken, isAuthenticated: true }),
      clearSession: () =>
        set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false }),
    }),
    { name: 'hms-auth' },
  ),
);
