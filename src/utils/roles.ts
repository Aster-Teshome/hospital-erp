/**
 * Mirrors the backend's src/common/constants/roles.ts - keep in sync with
 * the API's Role enum. See FR-AUTH-02 in the MVP requirements doc.
 */
export const ROLES = {
  ADMIN: 'admin',
  RECEPTIONIST: 'receptionist',
  DOCTOR: 'doctor',
  NURSE: 'nurse',
  LAB_STAFF: 'lab_staff',
  PHARMACIST: 'pharmacist',
  CASHIER: 'cashier',
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];
