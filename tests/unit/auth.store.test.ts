import { beforeEach, describe, expect, it } from 'vitest';
import { useAuthStore } from '../../src/modules/auth/store/auth.store';

const sampleSession = {
  user: {
    id: 'user-1',
    organizationId: 'org-1',
    hotelId: 'hotel-1',
    email: 'admin@example.com',
    firstName: 'Ada',
    lastName: 'Lovelace',
    role: 'super_admin' as const,
  },
  accessToken: 'access-token',
  refreshToken: 'refresh-token',
};

describe('useAuthStore', () => {
  beforeEach(() => {
    useAuthStore.getState().clearSession();
  });

  it('starts unauthenticated', () => {
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
    expect(useAuthStore.getState().user).toBeNull();
  });

  it('setSession stores the user and tokens and flips isAuthenticated', () => {
    useAuthStore.getState().setSession(sampleSession);

    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(true);
    expect(state.user).toEqual(sampleSession.user);
    expect(state.accessToken).toBe('access-token');
    expect(state.refreshToken).toBe('refresh-token');
  });

  it('clearSession resets everything', () => {
    useAuthStore.getState().setSession(sampleSession);
    useAuthStore.getState().clearSession();

    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(false);
    expect(state.user).toBeNull();
    expect(state.accessToken).toBeNull();
    expect(state.refreshToken).toBeNull();
  });
});
