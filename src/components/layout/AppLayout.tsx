import { useEffect, useState } from 'react';
import {
  AlertOutlined,
  BankOutlined,
  CalendarOutlined,
  DashboardOutlined,
  LogoutOutlined,
  MedicineBoxOutlined,
  MenuFoldOutlined,
  MenuOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Avatar, Button, Drawer, Layout, Menu, Space, Typography } from 'antd';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../modules/auth/store/auth.store';
import { useLogout } from '../../modules/auth/hooks/auth.hooks';

const { Header, Sider, Content } = Layout;

export function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAuthStore((state) => state.user);
  const logout = useLogout();
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth < 768 : false,
  );
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  useEffect(() => {
    function handleResize() {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) {
        setMobileDrawerOpen(false);
      }
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  function handleLogout() {
    logout();
    navigate('/login', { replace: true });
  }

  const selectedKey = location.pathname.startsWith('/emergency')
    ? 'emergency'
    : location.pathname.startsWith('/inpatient')
      ? 'inpatient'
      : location.pathname.startsWith('/outpatient')
        ? 'outpatient'
        : location.pathname.startsWith('/appointments')
          ? 'appointments'
          : 'dashboard';

  const items = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined style={{ fontSize: 17 }} />,
      label: 'Dashboard',
      onClick: () => {
        navigate('/');
        if (isMobile) setMobileDrawerOpen(false);
      },
    },
    {
      key: 'emergency',
      icon: <AlertOutlined style={{ fontSize: 17, color: '#ef4444' }} />,
      label: 'Emergency (ED)',
      onClick: () => {
        navigate('/emergency');
        if (isMobile) setMobileDrawerOpen(false);
      },
    },
    {
      key: 'inpatient',
      icon: <BankOutlined style={{ fontSize: 17, color: '#3b82f6' }} />,
      label: 'Inpatient (IPD)',
      onClick: () => {
        navigate('/inpatient');
        if (isMobile) setMobileDrawerOpen(false);
      },
    },
    {
      key: 'appointments',
      icon: <CalendarOutlined style={{ fontSize: 17 }} />,
      label: 'Appointments',
      onClick: () => {
        navigate('/appointments');
        if (isMobile) setMobileDrawerOpen(false);
      },
    },
    {
      key: 'outpatient',
      icon: <MedicineBoxOutlined style={{ fontSize: 17 }} />,
      label: 'Outpatient (OPD)',
      onClick: () => {
        navigate('/outpatient');
        if (isMobile) setMobileDrawerOpen(false);
      },
    },
  ];

  const siderWidth = isMobile ? 0 : (collapsed ? 72 : 240);

  const sidebarContent = (isDrawer = false) => (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#090e17' }}>
      {/* Brand Header */}
      <div
        style={{
          padding: !isDrawer && collapsed ? '18px 12px' : '20px 18px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: !isDrawer && collapsed ? 'center' : 'flex-start',
          transition: 'all 0.2s ease',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, overflow: 'hidden' }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              fontWeight: 800,
              fontSize: 18,
              flexShrink: 0,
              boxShadow: '0 2px 8px rgba(2, 132, 199, 0.4)',
            }}
          >
            +
          </div>
          {(isDrawer || !collapsed) && (
            <div style={{ overflow: 'hidden', whiteSpace: 'nowrap' }}>
              <div
                style={{
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: 15,
                  letterSpacing: '-0.01em',
                }}
              >
                HOSPITAL ERP
              </div>
              <div
                style={{
                  color: '#94a3b8',
                  fontSize: 11,
                  fontWeight: 500,
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                }}
              >
                Clinical Suite
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Menu */}
      <div style={{ flex: 1, padding: '16px 8px', overflowY: 'auto' }}>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedKey]}
          items={items}
          style={{
            background: 'transparent',
            fontSize: 13,
            fontWeight: 500,
            border: 'none',
          }}
        />
      </div>

      {/* User profile bottom bar */}
      <div
        style={{
          padding: !isDrawer && collapsed ? '14px 10px' : '14px 16px',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          background: 'rgba(15, 23, 42, 0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: !isDrawer && collapsed ? 'center' : 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, overflow: 'hidden' }}>
          <Avatar
            style={{
              backgroundColor: '#0284c7',
              color: '#fff',
              flexShrink: 0,
            }}
            icon={<UserOutlined />}
          />
          {(isDrawer || !collapsed) && (
            <div style={{ overflow: 'hidden' }}>
              <div
                style={{
                  color: '#f1f5f9',
                  fontWeight: 600,
                  fontSize: 13,
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                }}
              >
                {user?.firstName ?? 'Staff'} {user?.lastName ?? ''}
              </div>
              <div style={{ color: '#94a3b8', fontSize: 11, textTransform: 'capitalize' }}>
                {user?.role ?? 'Clinical Staff'}
              </div>
            </div>
          )}
        </div>

        {(isDrawer || !collapsed) && (
          <Typography.Link
            onClick={handleLogout}
            title="Log out"
            style={{
              color: '#94a3b8',
              fontSize: 15,
              padding: 4,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <LogoutOutlined />
          </Typography.Link>
        )}
      </div>
    </div>
  );

  return (
    <Layout style={{ height: '100vh', overflow: 'hidden', background: '#f8fafc' }}>
      {/* Desktop Fixed Sidebar */}
      {!isMobile && (
        <Sider
          collapsible
          collapsed={collapsed}
          trigger={null}
          width={240}
          collapsedWidth={72}
          style={{
            height: '100vh',
            position: 'fixed',
            left: 0,
            top: 0,
            bottom: 0,
            zIndex: 100,
            background: '#090e17',
            borderRight: '1px solid #1e293b',
            display: 'flex',
            flexDirection: 'column',
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          {sidebarContent(false)}
        </Sider>
      )}

      {/* Mobile Navigation Drawer */}
      <Drawer
        placement="left"
        closable={false}
        onClose={() => setMobileDrawerOpen(false)}
        open={mobileDrawerOpen}
        styles={{ body: { padding: 0 } }}
        size={260}
      >
        {sidebarContent(true)}
      </Drawer>

      {/* Main Layout Area */}
      <Layout
        style={{
          marginLeft: siderWidth,
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          background: '#f8fafc',
          overflow: 'hidden',
          transition: 'margin-left 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        {/* Fixed Header */}
        <Header
          style={{
            background: '#ffffff',
            padding: isMobile ? '0 12px' : '0 24px',
            height: 60,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid #e2e8f0',
            flexShrink: 0,
            zIndex: 90,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Button
              type="text"
              aria-label={isMobile ? 'Open navigation menu' : (collapsed ? 'Expand sidebar' : 'Collapse sidebar')}
              icon={
                isMobile ? (
                  <MenuOutlined />
                ) : collapsed ? (
                  <MenuUnfoldOutlined />
                ) : (
                  <MenuFoldOutlined />
                )
              }
              onClick={() => {
                if (isMobile) {
                  setMobileDrawerOpen(true);
                } else {
                  setCollapsed(!collapsed);
                }
              }}
              style={{
                fontSize: 16,
                width: 36,
                height: 36,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#475569',
              }}
              title={
                isMobile
                  ? 'Open menu'
                  : collapsed
                    ? 'Expand sidebar'
                    : 'Collapse sidebar'
              }
            />
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span
                style={{
                  display: 'inline-block',
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: '#10b981',
                }}
              />
              <span style={{ fontWeight: 600, fontSize: 14, color: '#0f172a' }}>
                Central Hospital ERP
              </span>
            </div>
          </div>

          <Space size="middle">
            {!isMobile && (
              <Typography.Text type="secondary" style={{ fontSize: 13 }}>
                Signed in as <strong style={{ color: '#0f172a' }}>{user?.email}</strong>
              </Typography.Text>
            )}
            <Button
              size="small"
              type="text"
              danger
              icon={<LogoutOutlined />}
              onClick={handleLogout}
              style={{ fontSize: 12, fontWeight: 500 }}
            >
              Sign out
            </Button>
          </Space>
        </Header>

        {/* Vertical Scrollable Main Content */}
        <Content
          style={{
            flex: 1,
            overflowY: 'auto',
            overflowX: 'hidden',
            padding: isMobile ? '12px 12px' : '20px 24px',
            background: '#f8fafc',
          }}
        >
          <div style={{ width: '100%', maxWidth: '100%', margin: '0 auto' }}>
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}
