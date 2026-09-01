import { apiClient } from '../../../lib/apiClient';
import type { AuthSession, SafeUser } from '../types';
import type { LoginInput, RegisterInput } from '../auth.validation';

/**
 * Thin data-access layer: one function per backend endpoint, no state
 * management or business logic. Mirrors the backend's *.repository.ts -
 * every other module's api.ts file should follow this same shape.
 */
export const authApi = {
  async register(input: RegisterInput): Promise<AuthSession> {
    const { data } = await apiClient.post<AuthSession>('/auth/register', input);
    return data;
  },

  async login(input: LoginInput): Promise<AuthSession> {
    const { data } = await apiClient.post<AuthSession>('/auth/login', input);
    return data;
  },

  async me(): Promise<SafeUser> {
    const { data } = await apiClient.get<{ user: SafeUser }>('/auth/me');
    return data.user;
  },
};
