import { Alert, Card, Typography } from 'antd';
import { RoleGuard } from '../../../components/RoleGuard';
import { useAuthStore } from '../../auth/store/auth.store';
import { ROLES } from '../../../utils/roles';

/**
 * Minimal landing page after login - proves the protected-route + session
 * pattern works end to end. Real modules (reservations, billing, ...) get
 * their own pages under src/modules/<name>/pages and a nav entry in
 * AppLayout.tsx; this page is not a template to copy for them.
 */
export function DashboardPage() {
  const user = useAuthStore((state) => state.user);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Card>
        <Typography.Title level={4} style={{ marginTop: 0 }}>
          Welcome, {user?.firstName}
        </Typography.Title>
        <Typography.Text type="secondary">
          Signed in as {user?.email} ({user?.role})
        </Typography.Text>
      </Card>

      <RoleGuard
        allow={[ROLES.SUPER_ADMIN]}
        fallback={
          <Alert type="info" showIcon title="Admin tools are hidden - your role doesn't include super_admin." />
        }
      >
        <Card title="Admin tools">
          <Typography.Text>
            Only super_admin users see this card (see RoleGuard.tsx) - organization/hotel
            configuration will live here once the organizations module is built.
          </Typography.Text>
        </Card>
      </RoleGuard>
    </div>
  );
}
