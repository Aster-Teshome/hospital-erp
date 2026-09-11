import {
  CalendarOutlined,
  DashboardOutlined,
  LogoutOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Avatar, Layout, Menu, Space, Typography } from 'antd';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../modules/auth/store/auth.store';
import { useLogout } from '../../modules/auth/hooks/auth.hooks';

const { Header, Sider, Content } = Layout;

export function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAuthStore((state) => state.user);
  const logout = useLogout();

  function handleLogout() {
    logout();
    navigate('/login', { replace: true });
  }

  const selectedKey = location.pathname.startsWith('/appointments') ? 'appointments' : 'dashboard';

  const items = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined style={{ fontSize: 16 }} />,
      label: 'Dashboard',
      onClick: () => navigate('/'),
    },
    {
      key: 'appointments',
      icon: <CalendarOutlined style={{ fontSize: 16 }} />,
      label: 'Appointments',
      onClick: () => navigate('/appointments'),
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh', background: '#f8faf9' }}>
      <Sider
        breakpoint="lg"
        collapsedWidth="0"
        width={250}
        style={{
          background: '#092d29', // Deep medical slate teal
          borderRight: '1px solid #0e3d37',
        }}
      >
        {/* Brand Header */}
        <div style={{ padding: '24px 20px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: '#136c64',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                fontWeight: 800,
                fontSize: 18,
              }}
            >
              +
            </div>
            <div>
              <div
                style={{
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: 16,
                  letterSpacing: '-0.02em',
                  fontFamily: `'Plus Jakarta Sans', sans-serif`,
                }}
              >
                HOSPITAL ERP
              </div>
              <div
                style={{
                  color: '#6ee7b7',
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                }}
              >
                Management System
              </div>
            </div>
          </div>
        </div>

        {/* Menu */}
        <div style={{ padding: '16px 12px' }}>
          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={[selectedKey]}
            items={items}
            style={{
              background: 'transparent',
              fontSize: 15,
              fontWeight: 500,
            }}
          />
        </div>
      </Sider>

      <Layout style={{ background: '#f8faf9' }}>
        <Header
          style={{
            background: '#ffffff',
            padding: '0 28px',
            height: 68,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            borderBottom: '1px solid #e2e8f0',
          }}
        >
          <Space size="middle">
            {user && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Avatar
                  style={{ backgroundColor: '#136c64', verticalAlign: 'middle' }}
                  icon={<UserOutlined />}
                />
                <div>
                  <Typography.Text strong style={{ fontSize: 14, color: '#0f172a', display: 'block', lineHeight: 1.2 }}>
                    {user.firstName} {user.lastName}
                  </Typography.Text>
                  <Typography.Text type="secondary" style={{ fontSize: 12, textTransform: 'capitalize' }}>
                    {user.role}
                  </Typography.Text>
                </div>
              </div>
            )}

            <Typography.Link
              onClick={handleLogout}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                marginLeft: 16,
                color: '#64748b',
                fontWeight: 500,
                fontSize: 14,
              }}
            >
              <LogoutOutlined />
              <span>Log out</span>
            </Typography.Link>
          </Space>
        </Header>

        <Content style={{ margin: '24px 28px' }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
