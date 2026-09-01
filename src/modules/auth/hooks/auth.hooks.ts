import { useMutation, useQuery } from '@tanstack/react-query';
import { authApi } from '../api/auth.api';
import { useAuthStore } from '../store/auth.store';
import type { AuthSession } from '../types';

/**
 * React Query hooks are the frontend's equivalent of the backend's
 * *.service.ts layer: components call these, never auth.api.ts directly.
 * Mutations push the result into the zustand store; the query hydrates it
 * from the server on load. Follow this pattern in other modules.
 */
function persistSession(session: AuthSession) {
  useAuthStore.getState().setSession(session);
}

export function useLogin() {
  return useMutation({
    mutationFn: authApi.login,
    onSuccess: persistSession,
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: authApi.register,
    onSuccess: persistSession,
  });
}

export function useLogout() {
  return useAuthStore((state) => state.clearSession);
}

/**
 * Revalidates the session against the API (e.g. on app load) so a stale or
 * revoked token doesn't leave the UI thinking the user is still signed in.
 */
export function useCurrentUser() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: ['auth', 'me'],
    queryFn: authApi.me,
    enabled: isAuthenticated,
    retry: false,
  });
}
