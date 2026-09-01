import { Outlet } from 'react-router-dom';

/**
 * Centered shell for public auth pages (login/register). Contrast with
 * AppLayout.tsx, which wraps the authenticated app shell.
 */
export function AuthLayout() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f5f5f5',
      }}
    >
      <Outlet />
    </div>
  );
}
