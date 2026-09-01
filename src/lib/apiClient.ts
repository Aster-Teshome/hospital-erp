import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { env } from '../config/env';
import { useAuthStore } from '../modules/auth/store/auth.store';
import type { AuthTokens } from '../modules/auth/types';

/**
 * Central axios instance every module's `*.api.ts` file should import
 * instead of calling axios directly (see modules/auth/api/auth.api.ts).
 * Handles two cross-cutting concerns so individual modules don't have to:
 *  - attaching the current access token to every request
 *  - transparently refreshing an expired access token once, then retrying
 */
export const apiClient = axios.create({ baseURL: env.apiBaseUrl });

apiClient.interceptors.request.use((config) => {
  const { accessToken } = useAuthStore.getState();
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

let refreshPromise: Promise<string> | null = null;

async function refreshAccessToken(): Promise<string> {
  const { refreshToken } = useAuthStore.getState();
  if (!refreshToken) {
    throw new Error('No refresh token available');
  }

  const { data } = await axios.post<AuthTokens>(`${env.apiBaseUrl}/auth/refresh`, {
    refreshToken,
  });

  useAuthStore.setState({ accessToken: data.accessToken, refreshToken: data.refreshToken });
  return data.accessToken;
}

interface RetriableConfig extends InternalAxiosRequestConfig {
  _retried?: boolean;
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetriableConfig | undefined;
    const isAuthEndpoint = originalRequest?.url?.includes('/auth/login') || originalRequest?.url?.includes('/auth/register');

    if (error.response?.status === 401 && originalRequest && !originalRequest._retried && !isAuthEndpoint) {
      originalRequest._retried = true;
      try {
        refreshPromise ??= refreshAccessToken().finally(() => {
          refreshPromise = null;
        });
        const newAccessToken = await refreshPromise;
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return apiClient(originalRequest);
      } catch {
        useAuthStore.getState().clearSession();
      }
    }

    return Promise.reject(error);
  },
);
