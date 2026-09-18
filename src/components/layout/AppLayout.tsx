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
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        background: 'linear-gradient(180deg, #0a0f1d 0%, #0f172a 100%)',
        borderRight: '1px solid rgba(255, 255, 255, 0.08)',
      }}
    >
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
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, overflow: 'hidden' }}>
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              fontWeight: 800,
              fontSize: 20,
              flexShrink: 0,
              boxShadow: '0 0 16px rgba(2, 132, 199, 0.45)',
              border: '1px solid rgba(56, 189, 248, 0.3)',
            }}
          >
            +
          </div>
          {(isDrawer || !collapsed) && (
            <div style={{ overflow: 'hidden', whiteSpace: 'nowrap' }}>
              <div
                style={{
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: 15,
                  letterSpacing: '0.02em',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <span>HOSPITAL ERP</span>
                <span
                  style={{
                    fontSize: 9,
                    fontWeight: 700,
                    padding: '2px 5px',
                    borderRadius: 4,
                    background: 'rgba(56, 189, 248, 0.15)',
                    color: '#38bdf8',
                    border: '1px solid rgba(56, 189, 248, 0.3)',
                  }}
                >
                  PRO
                </span>
              </div>
              <div
                style={{
                  color: '#94a3b8',
                  fontSize: 11,
                  fontWeight: 500,
                  letterSpacing: '0.04em',
                }}
              >
                Clinical Enterprise Suite
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
          className="glass-surface"
          style={{
            padding: isMobile ? '0 12px' : '0 20px',
            height: 64,
            maxHeight: 64,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid #e2e8f0',
            flexShrink: 0,
            overflow: 'hidden',
            zIndex: 90,
            boxShadow: '0 1px 4px 0 rgba(15, 23, 42, 0.04)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0, minWidth: 0, whiteSpace: 'nowrap' }}>
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
                flexShrink: 0,
              }}
              title={
                isMobile
                  ? 'Open menu'
                  : collapsed
                    ? 'Expand sidebar'
                    : 'Collapse sidebar'
              }
            />
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0, whiteSpace: 'nowrap' }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 5,
                  padding: '3px 7px',
                  borderRadius: 6,
                  background: '#ecfdf5',
                  border: '1px solid #a7f3d0',
                  flexShrink: 0,
                  whiteSpace: 'nowrap',
                }}
              >
                <span
                  style={{
                    display: 'inline-block',
                    width: 7,
                    height: 7,
                    borderRadius: '50%',
                    background: '#10b981',
                    flexShrink: 0,
                  }}
                />
                <span style={{ fontSize: 11, fontWeight: 700, color: '#065f46', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  ONLINE
                </span>
              </div>
              <span style={{ fontWeight: 800, fontSize: 15, color: '#0f172a', letterSpacing: '-0.01em', whiteSpace: 'nowrap', flexShrink: 0 }}>
                Central Hospital ERP
              </span>
            </div>

            {!isMobile && (
              <div
                className="header-shift-badge"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '3px 10px',
                  borderRadius: 20,
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  fontSize: 12,
                  color: '#64748b',
                  fontWeight: 500,
                  marginLeft: 4,
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                }}
              >
                <span>🏥 General & Trauma Center</span>
                <span style={{ color: '#cbd5e1' }}>•</span>
                <span style={{ color: '#0284c7', fontWeight: 600 }}>Active Shift</span>
              </div>
            )}
          </div>

          <Space size="middle" align="center" style={{ flexShrink: 0, whiteSpace: 'nowrap' }}>
            {!isMobile && (
              <Button
                size="small"
                type="primary"
                danger
                icon={<AlertOutlined />}
                onClick={() => navigate('/emergency')}
                style={{
                  fontWeight: 600,
                  borderRadius: 6,
                  boxShadow: '0 2px 6px rgba(239, 68, 68, 0.25)',
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                }}
              >
                Emergency ED
              </Button>
            )}

            {!isMobile && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '4px 10px',
                  borderRadius: 8,
                  background: '#f1f5f9',
                  border: '1px solid #e2e8f0',
                  maxWidth: 180,
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                }}
              >
                <Avatar
                  size="small"
                  style={{ backgroundColor: '#0284c7', fontSize: 12, fontWeight: 700, flexShrink: 0 }}
                >
                  {user?.firstName?.[0] ?? 'S'}
                </Avatar>
                <div style={{ lineHeight: 1.2, minWidth: 0, overflow: 'hidden' }}>
                  <Typography.Text
                    strong
                    ellipsis
                    style={{ fontSize: 12, color: '#0f172a', display: 'block', maxWidth: 120 }}
                  >
                    {user?.firstName ? `${user.firstName} ${user.lastName ?? ''}` : 'Medical Staff'}
                  </Typography.Text>
                  <Typography.Text
                    type="secondary"
                    ellipsis
                    style={{ fontSize: 10, display: 'block', maxWidth: 120 }}
                  >
                    {user?.email}
                  </Typography.Text>
                </div>
              </div>
            )}

            <Button
              size="small"
              type="text"
              danger
              icon={<LogoutOutlined />}
              onClick={handleLogout}
              style={{ fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap', flexShrink: 0 }}
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
