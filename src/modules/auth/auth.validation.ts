import { z } from 'zod';

/**
 * Mirrors the backend's src/modules/auth/auth.validation.ts constraints so
 * form errors surface before a request is even sent. Fed directly into
 * react-hook-form via @hookform/resolvers/zod (see LoginForm.tsx).
 */
export const loginSchema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});
export type LoginInput = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  organizationName: z.string().min(2, 'Organization name is too short'),
  hotelName: z.string().min(2, 'Hotel name is too short'),
  email: z.string().email('Enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
});
export type RegisterInput = z.infer<typeof registerSchema>;
