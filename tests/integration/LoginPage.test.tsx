import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { LoginPage } from '../../src/modules/auth/pages/LoginPage';
import { useAuthStore } from '../../src/modules/auth/store/auth.store';
import { apiClient } from '../../src/lib/apiClient';

/**
 * Integration test: renders the real LoginPage + LoginForm + useLogin hook,
 * only mocking the network boundary (apiClient), so it exercises the same
 * wiring a user's click does. Compare with tests/unit/auth.store.test.ts,
 * which isolates just the store.
 */
function renderLoginPage() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={['/login']}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<div>Dashboard</div>} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe('LoginPage', () => {
  beforeEach(() => {
    useAuthStore.getState().clearSession();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('logs in and navigates to the dashboard on success', async () => {
    const session = {
      user: {
        id: 'user-1',
        hospitalId: 'hospital-1',
        email: 'admin@smartech-demo.test',
        firstName: 'Demo',
        lastName: 'Admin',
        role: 'admin' as const,
      },
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
    };
    vi.spyOn(apiClient, 'post').mockResolvedValue({ data: session });

    const user = userEvent.setup();
    renderLoginPage();

    await user.type(screen.getByLabelText(/email/i), 'admin@smartech-demo.test');
    await user.type(screen.getByLabelText(/password/i), 'ChangeMe123!');
    await user.click(screen.getByRole('button', { name: /log in/i }));

    await waitFor(() => expect(screen.getByText('Dashboard')).toBeInTheDocument());
    expect(useAuthStore.getState().isAuthenticated).toBe(true);
  });

  it('shows an error message on invalid credentials', async () => {
    vi.spyOn(apiClient, 'post').mockRejectedValue({
      isAxiosError: true,
      response: { data: { error: { message: 'Invalid email or password' } } },
    });

    const user = userEvent.setup();
    renderLoginPage();

    await user.type(screen.getByLabelText(/email/i), 'admin@smartech-demo.test');
    await user.type(screen.getByLabelText(/password/i), 'wrong-password');
    await user.click(screen.getByRole('button', { name: /log in/i }));

    expect(await screen.findByText('Invalid email or password')).toBeInTheDocument();
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
  });
});
