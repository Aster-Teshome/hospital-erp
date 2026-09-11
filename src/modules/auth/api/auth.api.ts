import axios from 'axios';
import { apiClient } from '../../../lib/apiClient';
import { useAuthStore } from '../store/auth.store';
import type { AuthSession, SafeUser } from '../types';
import type { LoginInput, RegisterInput } from '../auth.validation';

export const authApi = {
  async register(input: RegisterInput): Promise<AuthSession> {
    try {
      const { data } = await apiClient.post<AuthSession>('/auth/register', input);
      return data;
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && !err.response) {
        // Fallback for offline UI preview
        return {
          user: {
            id: 'user-demo-1',
            hospitalId: 'hosp-1',
            email: input.email,
            firstName: input.firstName,
            lastName: input.lastName,
            role: 'admin',
          },
          accessToken: 'mock-demo-token',
          refreshToken: 'mock-refresh-token',
        };
      }
      throw err;
    }
  },

  async login(input: LoginInput): Promise<AuthSession> {
    try {
      const { data } = await apiClient.post<AuthSession>('/auth/login', input);
      return data;
    } catch (err: unknown) {
      // If backend is offline (ERR_CONNECTION_REFUSED / network error),
      // allow instant demo login so UI, appointments, and outpatient can be previewed!
      if (axios.isAxiosError(err) && !err.response) {
        return {
          user: {
            id: 'user-demo-1',
            hospitalId: 'hosp-1',
            email: input.email || 'admin@smartech-demo.test',
            firstName: 'Yared',
            lastName: 'Tadesse',
            role: 'admin',
          },
          accessToken: 'mock-demo-token',
          refreshToken: 'mock-refresh-token',
        };
      }
      throw err;
    }
  },

  async me(): Promise<SafeUser> {
    try {
      const { data } = await apiClient.get<{ user: SafeUser }>('/auth/me');
      return data.user;
    } catch (err: unknown) {
      const user = useAuthStore.getState().user;
      if (user) return user;
      throw err;
    }
  },
};
