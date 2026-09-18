import { Alert, Card, Col, Row, Typography } from 'antd';
import {
  AlertOutlined,
  BankOutlined,
  CalendarOutlined,
  MedicineBoxOutlined,
  RightOutlined,
} from '@ant-design/icons';

import { useNavigate } from 'react-router-dom';
import { RoleGuard } from '../../../components/RoleGuard';
import { useAuthStore } from '../../auth/store/auth.store';
import { ROLES } from '../../../utils/roles';

export function DashboardPage() {
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Welcome Banner */}
      <Card
        style={{
          borderRadius: 14,
          background: 'linear-gradient(135deg, #090e17 0%, #0f172a 100%)',
          color: '#ffffff',
          border: 'none',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <Typography.Title level={3} style={{ color: '#ffffff', margin: 0, fontWeight: 700 }}>
              Welcome back, {user?.firstName ?? 'Staff'} {user?.lastName ?? ''}
            </Typography.Title>
            <Typography.Text style={{ color: '#94a3b8', fontSize: 13 }}>
              Signed in as <strong>{user?.email}</strong> • Role:{' '}
              <span style={{ textTransform: 'capitalize', color: '#38bdf8' }}>{user?.role}</span>
            </Typography.Text>
          </div>
          <div
            style={{
              padding: '6px 14px',
              borderRadius: 20,
              background: 'rgba(56, 189, 248, 0.1)',
              border: '1px solid rgba(56, 189, 248, 0.2)',
              color: '#38bdf8',
              fontSize: 12,
              fontWeight: 600,
            }}
          >
            ● System Active • Realtime Connected
          </div>
        </div>
      </Card>

      {/* Quick Launch Clinical Modules */}
      <div>
        <Typography.Title level={4} style={{ margin: '0 0 12px 0', fontSize: 16, color: '#0f172a' }}>
          Clinical Workstations & Department Access
        </Typography.Title>

        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} lg={6}>
            <Card
              hoverable
              onClick={() => navigate('/emergency')}
              style={{
                borderRadius: 12,
                borderLeft: '4px solid #ef4444',
                borderColor: '#e2e8f0',
                height: '100%',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 10,
                      background: '#fee2e2',
                      color: '#ef4444',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 20,
                    }}
                  >
                    <AlertOutlined />
                  </div>
                  <div>
                    <Typography.Title level={5} style={{ margin: 0, fontSize: 15 }}>
                      Emergency (ED)
                    </Typography.Title>
                    <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                      Triage & Acute Trauma
                    </Typography.Text>
                  </div>
                </div>
                <RightOutlined style={{ color: '#94a3b8', fontSize: 12 }} />
              </div>
              <div style={{ marginTop: 14, fontSize: 12, color: '#64748b' }}>
                Fast arrival registration, P1-P5 acuity scoring, bay allocation, and live emergency tracking.
              </div>
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Card
              hoverable
              onClick={() => navigate('/inpatient')}
              style={{
                borderRadius: 12,
                borderLeft: '4px solid #3b82f6',
                borderColor: '#e2e8f0',
                height: '100%',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 10,
                      background: '#eff6ff',
                      color: '#3b82f6',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 20,
                    }}
                  >
                    <BankOutlined />
                  </div>
                  <div>
                    <Typography.Title level={5} style={{ margin: 0, fontSize: 15 }}>
                      Inpatient (IPD)
                    </Typography.Title>
                    <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                      Wards & Bed Map
                    </Typography.Text>
                  </div>
                </div>
                <RightOutlined style={{ color: '#94a3b8', fontSize: 12 }} />
              </div>
              <div style={{ marginTop: 14, fontSize: 12, color: '#64748b' }}>
                Ward occupancy dashboard, real-time bed management grid, admissions, transfers, and discharges.
              </div>
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Card
              hoverable
              onClick={() => navigate('/outpatient')}
              style={{
                borderRadius: 12,
                borderLeft: '4px solid #0284c7',
                borderColor: '#e2e8f0',
                height: '100%',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 10,
                      background: '#e0f2fe',
                      color: '#0284c7',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 20,
                    }}
                  >
                    <MedicineBoxOutlined />
                  </div>
                  <div>
                    <Typography.Title level={5} style={{ margin: 0, fontSize: 15 }}>
                      Outpatient (OPD)
                    </Typography.Title>
                    <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                      Queue & Consultations
                    </Typography.Text>
                  </div>
                </div>
                <RightOutlined style={{ color: '#94a3b8', fontSize: 12 }} />
              </div>
              <div style={{ marginTop: 14, fontSize: 12, color: '#64748b' }}>
                Patient check-in, vital signs triage, doctor consultation, e-prescriptions, and lab orders.
              </div>
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Card
              hoverable
              onClick={() => navigate('/appointments')}
              style={{
                borderRadius: 12,
                borderLeft: '4px solid #10b981',
                borderColor: '#e2e8f0',
                height: '100%',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 10,
                      background: '#d1fae5',
                      color: '#10b981',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 20,
                    }}
                  >
                    <CalendarOutlined />
                  </div>
                  <div>
                    <Typography.Title level={5} style={{ margin: 0, fontSize: 15 }}>
                      Appointments
                    </Typography.Title>
                    <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                      Doctor Schedules & Booking
                    </Typography.Text>
                  </div>
                </div>
                <RightOutlined style={{ color: '#94a3b8', fontSize: 12 }} />
              </div>
              <div style={{ marginTop: 14, fontSize: 12, color: '#64748b' }}>
                Appointment booking calendar, time slot allocation, doctor availability schedules, and status tracking.
              </div>
            </Card>
          </Col>
        </Row>
      </div>

      <RoleGuard
        allow={[ROLES.ADMIN]}
        fallback={<Alert type="info" showIcon title="Admin management tools are restricted to System Administrators." />}
      >
        <Card title="Admin Administration Suite" style={{ borderRadius: 12 }}>
          <Typography.Text type="secondary">
            Staff account administration (FR-AUTH-03) and hospital configuration settings are accessible to Admin users.
          </Typography.Text>
        </Card>
      </RoleGuard>
    </div>
  );
}

