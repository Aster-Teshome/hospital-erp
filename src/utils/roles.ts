/**
 * Mirrors the backend's src/common/constants/roles.ts - keep in sync with
 * the API's Role enum.
 */
export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  MANAGER: 'manager',
  EMPLOYEE: 'employee',
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];
