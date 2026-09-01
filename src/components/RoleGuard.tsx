import type { ReactNode } from 'react';
import { useAuthStore } from '../modules/auth/store/auth.store';
import type { Role } from '../utils/roles';

interface RoleGuardProps {
  allow: Role[];
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * Client-side role gate for hiding/showing UI - mirrors the backend's
 * requireRole middleware, but is a UX nicety only: the API enforces the
 * real access control, this just avoids showing controls a user can't use.
 */
export function RoleGuard({ allow, children, fallback = null }: RoleGuardProps) {
  const role = useAuthStore((state) => state.user?.role);

  if (!role || !allow.includes(role)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
