import { Layout, Menu, Space, Typography } from 'antd';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../modules/auth/store/auth.store';
import { useLogout } from '../../modules/auth/hooks/auth.hooks';

const { Header, Sider, Content } = Layout;

/**
 * Authenticated app shell: sidebar nav + header + routed content. As real
 * modules (reservations, billing, ...) get pages, add their nav entries to
 * `items` below and their routes in src/app/router.tsx.
 */
export function AppLayout() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const logout = useLogout();

  function handleLogout() {
    logout();
    navigate('/login', { replace: true });
  }

  const items = [{ key: 'dashboard', label: 'Dashboard', onClick: () => navigate('/') }];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider breakpoint="lg" collapsedWidth="0">
        <div style={{ color: '#fff', fontWeight: 600, padding: 16 }}>HMS</div>
        <Menu theme="dark" mode="inline" defaultSelectedKeys={['dashboard']} items={items} />
      </Sider>
      <Layout>
        <Header style={{ background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
          <Space>
            {user && (
              <Typography.Text>
                {user.firstName} {user.lastName} · {user.role}
              </Typography.Text>
            )}
            <Typography.Link onClick={handleLogout}>Log out</Typography.Link>
          </Space>
        </Header>
        <Content style={{ margin: 24 }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
