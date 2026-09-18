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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Clinician Hero Welcome Banner */}
      <Card
        className="hover-lift"
        style={{
          borderRadius: 16,
          background: 'linear-gradient(135deg, #0a0f1d 0%, #0f172a 50%, #1e293b 100%)',
          color: '#ffffff',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.25)',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {/* Subtle decorative background glow */}
        <div
          style={{
            position: 'absolute',
            right: -40,
            top: -40,
            width: 260,
            height: 260,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(2, 132, 199, 0.15) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16, position: 'relative', zIndex: 1 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
              <Typography.Title level={3} style={{ color: '#ffffff', margin: 0, fontWeight: 800, letterSpacing: '-0.02em' }}>
                Welcome back, {user?.firstName ?? 'Staff'} {user?.lastName ?? ''}
              </Typography.Title>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  padding: '3px 8px',
                  borderRadius: 12,
                  background: 'rgba(56, 189, 248, 0.2)',
                  color: '#38bdf8',
                  border: '1px solid rgba(56, 189, 248, 0.35)',
                  textTransform: 'uppercase',
                }}
              >
                On Duty
              </span>
            </div>
            <Typography.Text style={{ color: '#94a3b8', fontSize: 13 }}>
              Signed in as <strong style={{ color: '#e2e8f0' }}>{user?.email}</strong> • Assigned Role:{' '}
              <span style={{ textTransform: 'capitalize', color: '#38bdf8', fontWeight: 600 }}>{user?.role}</span> • Central Clinical Hospital Station
            </Typography.Text>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                padding: '6px 14px',
                borderRadius: 20,
                background: 'rgba(16, 185, 129, 0.12)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                color: '#34d399',
                fontSize: 12,
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981' }} />
              Realtime EMR Synced
            </div>
          </div>
        </div>
      </Card>

      {/* Quick Launch Clinical Modules */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <Typography.Title level={4} style={{ margin: 0, fontSize: 16, color: '#0f172a', fontWeight: 700 }}>
            Clinical Workstations & Department Access
          </Typography.Title>
          <Typography.Text type="secondary" style={{ fontSize: 12 }}>
            Instant access to acute care, ward management, outpatient queues, and appointments
          </Typography.Text>
        </div>

        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} lg={6}>
            <Card
              hoverable
              className="hover-lift"
              onClick={() => navigate('/emergency')}
              style={{
                borderRadius: 14,
                borderTop: '4px solid #ef4444',
                borderColor: '#e2e8f0',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 12,
                        background: '#fee2e2',
                        color: '#ef4444',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 22,
                        boxShadow: '0 2px 8px rgba(239, 68, 68, 0.15)',
                      }}
                    >
                      <AlertOutlined />
                    </div>
                    <div>
                      <Typography.Title level={5} style={{ margin: 0, fontSize: 15, fontWeight: 700 }}>
                        Emergency (ED)
                      </Typography.Title>
                      <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                        Triage & Acute Trauma
                      </Typography.Text>
                    </div>
                  </div>
                  <RightOutlined style={{ color: '#94a3b8', fontSize: 12 }} />
                </div>
                <div style={{ fontSize: 12, color: '#64748b', lineHeight: 1.5 }}>
                  Fast arrival registration, P1-P5 acuity scoring, bay allocation, and live emergency tracking.
                </div>
              </div>

              <div style={{ marginTop: 18, paddingTop: 12, borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#ef4444', textTransform: 'uppercase' }}>
                  TRAUMA · P1–P5
                </span>
                <span style={{ fontSize: 12, fontWeight: 600, color: '#0284c7' }}>Open Station →</span>
              </div>
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Card
              hoverable
              className="hover-lift"
              onClick={() => navigate('/inpatient')}
              style={{
                borderRadius: 14,
                borderTop: '4px solid #2563eb',
                borderColor: '#e2e8f0',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 12,
                        background: '#eff6ff',
                        color: '#2563eb',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 22,
                        boxShadow: '0 2px 8px rgba(37, 99, 235, 0.15)',
                      }}
                    >
                      <BankOutlined />
                    </div>
                    <div>
                      <Typography.Title level={5} style={{ margin: 0, fontSize: 15, fontWeight: 700 }}>
                        Inpatient (IPD)
                      </Typography.Title>
                      <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                        Wards & Bed Map
                      </Typography.Text>
                    </div>
                  </div>
                  <RightOutlined style={{ color: '#94a3b8', fontSize: 12 }} />
                </div>
                <div style={{ fontSize: 12, color: '#64748b', lineHeight: 1.5 }}>
                  Ward occupancy dashboard, real-time bed management grid, admissions, transfers, and discharges.
                </div>
              </div>

              <div style={{ marginTop: 18, paddingTop: 12, borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#2563eb', textTransform: 'uppercase' }}>
                  LIVE BEDS · ROSTER
                </span>
                <span style={{ fontSize: 12, fontWeight: 600, color: '#0284c7' }}>Open Station →</span>
              </div>
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Card
              hoverable
              className="hover-lift"
              onClick={() => navigate('/outpatient')}
              style={{
                borderRadius: 14,
                borderTop: '4px solid #0284c7',
                borderColor: '#e2e8f0',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 12,
                        background: '#e0f2fe',
                        color: '#0284c7',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 22,
                        boxShadow: '0 2px 8px rgba(2, 132, 199, 0.15)',
                      }}
                    >
                      <MedicineBoxOutlined />
                    </div>
                    <div>
                      <Typography.Title level={5} style={{ margin: 0, fontSize: 15, fontWeight: 700 }}>
                        Outpatient (OPD)
                      </Typography.Title>
                      <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                        Queue & Consultations
                      </Typography.Text>
                    </div>
                  </div>
                  <RightOutlined style={{ color: '#94a3b8', fontSize: 12 }} />
                </div>
                <div style={{ fontSize: 12, color: '#64748b', lineHeight: 1.5 }}>
                  Patient check-in, vital signs triage, doctor consultation, e-prescriptions, and lab orders.
                </div>
              </div>

              <div style={{ marginTop: 18, paddingTop: 12, borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#0284c7', textTransform: 'uppercase' }}>
                  CLINIC QUEUE
                </span>
                <span style={{ fontSize: 12, fontWeight: 600, color: '#0284c7' }}>Open Station →</span>
              </div>
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Card
              hoverable
              className="hover-lift"
              onClick={() => navigate('/appointments')}
              style={{
                borderRadius: 14,
                borderTop: '4px solid #10b981',
                borderColor: '#e2e8f0',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 12,
                        background: '#d1fae5',
                        color: '#10b981',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 22,
                        boxShadow: '0 2px 8px rgba(16, 185, 129, 0.15)',
                      }}
                    >
                      <CalendarOutlined />
                    </div>
                    <div>
                      <Typography.Title level={5} style={{ margin: 0, fontSize: 15, fontWeight: 700 }}>
                        Appointments
                      </Typography.Title>
                      <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                        Doctor Schedules & Booking
                      </Typography.Text>
                    </div>
                  </div>
                  <RightOutlined style={{ color: '#94a3b8', fontSize: 12 }} />
                </div>
                <div style={{ fontSize: 12, color: '#64748b', lineHeight: 1.5 }}>
                  Appointment booking calendar, time slot allocation, doctor availability schedules, and status tracking.
                </div>
              </div>

              <div style={{ marginTop: 18, paddingTop: 12, borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#10b981', textTransform: 'uppercase' }}>
                  SCHEDULES
                </span>
                <span style={{ fontSize: 12, fontWeight: 600, color: '#0284c7' }}>Open Station →</span>
              </div>
            </Card>
          </Col>
        </Row>
      </div>

      <RoleGuard
        allow={[ROLES.ADMIN]}
        fallback={<Alert type="info" showIcon message="Admin management tools are restricted to System Administrators." />}
      >
        <Card title="Admin Administration Suite" style={{ borderRadius: 14, borderColor: '#e2e8f0' }}>
          <Typography.Text type="secondary">
            Staff account administration (FR-AUTH-03) and hospital configuration settings are accessible to Admin users.
          </Typography.Text>
        </Card>
      </RoleGuard>
    </div>
  );
}

