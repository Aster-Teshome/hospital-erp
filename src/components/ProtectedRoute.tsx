import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../modules/auth/store/auth.store';

/**
 * Gate for any route tree that requires a logged-in user - wraps the
 * AppLayout route in src/app/router.tsx. Redirects to /login when there's
 * no session, mirroring the backend's requireAuth middleware.
 */
export function ProtectedRoute() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
