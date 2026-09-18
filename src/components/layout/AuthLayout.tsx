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
        background: 'linear-gradient(135deg, #090d16 0%, #0f172a 50%, #1e293b 100%)',
        position: 'relative',
        overflow: 'hidden',
        padding: '24px 16px',
      }}
    >
      {/* Ambient background glow accents */}
      <div
        style={{
          position: 'absolute',
          width: 500,
          height: 500,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(2, 132, 199, 0.15) 0%, transparent 70%)',
          top: -100,
          left: -100,
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.1) 0%, transparent 70%)',
          bottom: -50,
          right: -50,
          pointerEvents: 'none',
        }}
      />

      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 440 }}>
        <Outlet />
      </div>
    </div>
  );
}
