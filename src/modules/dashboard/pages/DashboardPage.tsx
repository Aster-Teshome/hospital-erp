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
      {/* Clinician Executive Overview Banner */}
      <div
        className="clinical-card hover-lift"
        style={{
          padding: '24px 28px',
          background: 'linear-gradient(135deg, #ffffff 0%, #f0f9ff 100%)',
          border: '1px solid #bae6fd',
          borderRadius: 16,
          boxShadow: '0 4px 20px -4px rgba(2, 132, 199, 0.08)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            right: -20,
            top: -20,
            width: 240,
            height: 240,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(56, 189, 248, 0.12) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16, position: 'relative', zIndex: 1 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8, flexWrap: 'wrap' }}>
              <Typography.Title level={3} style={{ color: '#0f172a', margin: 0, fontWeight: 800, letterSpacing: '-0.02em', fontSize: 24 }}>
                Welcome back, {user?.firstName ?? 'Staff'} {user?.lastName ?? ''}
              </Typography.Title>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  padding: '3px 10px',
                  borderRadius: 12,
                  background: '#e0f2fe',
                  color: '#0284c7',
                  border: '1px solid #bae6fd',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                }}
              >
                On Duty
              </span>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  padding: '3px 10px',
                  borderRadius: 12,
                  background: '#f1f5f9',
                  color: '#334155',
                  border: '1px solid #e2e8f0',
                  textTransform: 'capitalize',
                }}
              >
                Role: {user?.role ?? 'Clinician'}
              </span>
            </div>
            <Typography.Text type="secondary" style={{ fontSize: 13, color: '#475569' }}>
              Signed in as <strong style={{ color: '#0f172a' }}>{user?.email}</strong> • Central Clinical Hospital Station • Active Shift
            </Typography.Text>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '7px 16px',
                borderRadius: 24,
                background: '#ecfdf5',
                border: '1px solid #a7f3d0',
                color: '#065f46',
                fontWeight: 700,
                fontSize: 12,
              }}
            >
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981' }} />
              Realtime EMR Synced
            </div>
          </div>
        </div>
      </div>

      {/* Quick Launch Clinical Modules */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, flexWrap: 'wrap', gap: 8 }}>
          <div>
            <Typography.Title level={4} style={{ margin: 0, fontSize: 17, color: '#0f172a', fontWeight: 800, letterSpacing: '-0.01em' }}>
              Clinical Workstations & Department Access
            </Typography.Title>
            <Typography.Text type="secondary" style={{ fontSize: 13 }}>
              Instant access to acute care, ward management, outpatient queues, and appointments
            </Typography.Text>
          </div>
        </div>

        <Row gutter={[16, 16]}>
          {/* 1. Emergency ED */}
          <Col xs={24} sm={12} lg={6}>
            <Card
              hoverable
              className="workstation-card"
              onClick={() => navigate('/emergency')}
              styles={{ body: { padding: '20px 18px', display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' } }}
              style={{
                borderRadius: 16,
                borderTop: '4px solid #ef4444',
                borderColor: '#e2e8f0',
                height: '100%',
                boxShadow: '0 2px 8px -2px rgba(15, 23, 42, 0.05)',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div
                      style={{
                        width: 46,
                        height: 46,
                        borderRadius: 12,
                        background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                        color: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 22,
                        boxShadow: '0 4px 12px rgba(239, 68, 68, 0.35)',
                        flexShrink: 0,
                      }}
                    >
                      <AlertOutlined />
                    </div>
                    <div>
                      <Typography.Title level={5} style={{ margin: 0, fontSize: 15, fontWeight: 800, color: '#0f172a' }}>
                        Emergency (ED)
                      </Typography.Title>
                      <Typography.Text type="secondary" style={{ fontSize: 12, fontWeight: 500 }}>
                        Triage & Acute Trauma
                      </Typography.Text>
                    </div>
                  </div>
                  <RightOutlined style={{ color: '#94a3b8', fontSize: 13 }} />
                </div>
                <div style={{ fontSize: 12, color: '#64748b', lineHeight: 1.55 }}>
                  Fast arrival registration, P1-P5 acuity scoring, bay allocation, and live emergency tracking.
                </div>
              </div>

              <div style={{ marginTop: 20, paddingTop: 14, borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 800,
                    color: '#ef4444',
                    background: '#fef2f2',
                    border: '1px solid #fee2e2',
                    padding: '2px 7px',
                    borderRadius: 5,
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                  }}
                >
                  TRAUMA · P1–P5
                </span>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#ef4444' }}>Open Station →</span>
              </div>
            </Card>
          </Col>

          {/* 2. Inpatient IPD */}
          <Col xs={24} sm={12} lg={6}>
            <Card
              hoverable
              className="workstation-card"
              onClick={() => navigate('/inpatient')}
              styles={{ body: { padding: '20px 18px', display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' } }}
              style={{
                borderRadius: 16,
                borderTop: '4px solid #2563eb',
                borderColor: '#e2e8f0',
                height: '100%',
                boxShadow: '0 2px 8px -2px rgba(15, 23, 42, 0.05)',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div
                      style={{
                        width: 46,
                        height: 46,
                        borderRadius: 12,
                        background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                        color: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 22,
                        boxShadow: '0 4px 12px rgba(37, 99, 235, 0.35)',
                        flexShrink: 0,
                      }}
                    >
                      <BankOutlined />
                    </div>
                    <div>
                      <Typography.Title level={5} style={{ margin: 0, fontSize: 15, fontWeight: 800, color: '#0f172a' }}>
                        Inpatient (IPD)
                      </Typography.Title>
                      <Typography.Text type="secondary" style={{ fontSize: 12, fontWeight: 500 }}>
                        Wards & Bed Map
                      </Typography.Text>
                    </div>
                  </div>
                  <RightOutlined style={{ color: '#94a3b8', fontSize: 13 }} />
                </div>
                <div style={{ fontSize: 12, color: '#64748b', lineHeight: 1.55 }}>
                  Ward occupancy dashboard, real-time bed management grid, admissions, transfers, and discharges.
                </div>
              </div>

              <div style={{ marginTop: 20, paddingTop: 14, borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 800,
                    color: '#2563eb',
                    background: '#eff6ff',
                    border: '1px solid #dbeafe',
                    padding: '2px 7px',
                    borderRadius: 5,
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                  }}
                >
                  LIVE BEDS · ROSTER
                </span>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#2563eb' }}>Open Station →</span>
              </div>
            </Card>
          </Col>

          {/* 3. Outpatient OPD */}
          <Col xs={24} sm={12} lg={6}>
            <Card
              hoverable
              className="workstation-card"
              onClick={() => navigate('/outpatient')}
              styles={{ body: { padding: '20px 18px', display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' } }}
              style={{
                borderRadius: 16,
                borderTop: '4px solid #0284c7',
                borderColor: '#e2e8f0',
                height: '100%',
                boxShadow: '0 2px 8px -2px rgba(15, 23, 42, 0.05)',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div
                      style={{
                        width: 46,
                        height: 46,
                        borderRadius: 12,
                        background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                        color: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 22,
                        boxShadow: '0 4px 12px rgba(2, 132, 199, 0.35)',
                        flexShrink: 0,
                      }}
                    >
                      <MedicineBoxOutlined />
                    </div>
                    <div>
                      <Typography.Title level={5} style={{ margin: 0, fontSize: 15, fontWeight: 800, color: '#0f172a' }}>
                        Outpatient (OPD)
                      </Typography.Title>
                      <Typography.Text type="secondary" style={{ fontSize: 12, fontWeight: 500 }}>
                        Queue & Consultations
                      </Typography.Text>
                    </div>
                  </div>
                  <RightOutlined style={{ color: '#94a3b8', fontSize: 13 }} />
                </div>
                <div style={{ fontSize: 12, color: '#64748b', lineHeight: 1.55 }}>
                  Patient check-in, vital signs triage, doctor consultation, e-prescriptions, and lab orders.
                </div>
              </div>

              <div style={{ marginTop: 20, paddingTop: 14, borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 800,
                    color: '#0284c7',
                    background: '#f0f9ff',
                    border: '1px solid #e0f2fe',
                    padding: '2px 7px',
                    borderRadius: 5,
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                  }}
                >
                  CLINIC QUEUE
                </span>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#0284c7' }}>Open Station →</span>
              </div>
            </Card>
          </Col>

          {/* 4. Appointments */}
          <Col xs={24} sm={12} lg={6}>
            <Card
              hoverable
              className="workstation-card"
              onClick={() => navigate('/appointments')}
              styles={{ body: { padding: '20px 18px', display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' } }}
              style={{
                borderRadius: 16,
                borderTop: '4px solid #10b981',
                borderColor: '#e2e8f0',
                height: '100%',
                boxShadow: '0 2px 8px -2px rgba(15, 23, 42, 0.05)',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div
                      style={{
                        width: 46,
                        height: 46,
                        borderRadius: 12,
                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                        color: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 22,
                        boxShadow: '0 4px 12px rgba(16, 185, 129, 0.35)',
                        flexShrink: 0,
                      }}
                    >
                      <CalendarOutlined />
                    </div>
                    <div>
                      <Typography.Title level={5} style={{ margin: 0, fontSize: 15, fontWeight: 800, color: '#0f172a' }}>
                        Appointments
                      </Typography.Title>
                      <Typography.Text type="secondary" style={{ fontSize: 12, fontWeight: 500 }}>
                        Doctor Schedules & Booking
                      </Typography.Text>
                    </div>
                  </div>
                  <RightOutlined style={{ color: '#94a3b8', fontSize: 13 }} />
                </div>
                <div style={{ fontSize: 12, color: '#64748b', lineHeight: 1.55 }}>
                  Appointment scheduling calendar, time slots, doctor availability, and patient visit confirmations.
                </div>
              </div>

              <div style={{ marginTop: 20, paddingTop: 14, borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 800,
                    color: '#10b981',
                    background: '#ecfdf5',
                    border: '1px solid #d1fae5',
                    padding: '2px 7px',
                    borderRadius: 5,
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                  }}
                >
                  SCHEDULE · SLOTS
                </span>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#10b981' }}>Open Station →</span>
              </div>
            </Card>
          </Col>
        </Row>
      </div>

      {/* Live Hospital Operations Status */}
      <div>
        <Typography.Title level={5} style={{ margin: '0 0 12px 0', fontSize: 15, color: '#0f172a', fontWeight: 800 }}>
          Live Clinical Operations Status
        </Typography.Title>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} lg={6}>
            <div className="clinical-card hover-lift" style={{ padding: '14px 16px', borderLeft: '4px solid #ef4444', borderRadius: 12 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Emergency Trauma
              </div>
              <div style={{ fontSize: 17, fontWeight: 800, color: '#0f172a', marginTop: 4 }}>
                Active & Level 1 Ready
              </div>
              <div style={{ fontSize: 12, color: '#16a34a', marginTop: 3, fontWeight: 600 }}>
                ● Acute Triage Operational
              </div>
            </div>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <div className="clinical-card hover-lift" style={{ padding: '14px 16px', borderLeft: '4px solid #2563eb', borderRadius: 12 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Inpatient Wards
              </div>
              <div style={{ fontSize: 17, fontWeight: 800, color: '#0f172a', marginTop: 4 }}>
                Live Bed Map Active
              </div>
              <div style={{ fontSize: 12, color: '#2563eb', marginTop: 3, fontWeight: 600 }}>
                ● Real-time Bed Allocation
              </div>
            </div>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <div className="clinical-card hover-lift" style={{ padding: '14px 16px', borderLeft: '4px solid #0284c7', borderRadius: 12 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Outpatient Clinics
              </div>
              <div style={{ fontSize: 17, fontWeight: 800, color: '#0f172a', marginTop: 4 }}>
                Consultations In Session
              </div>
              <div style={{ fontSize: 12, color: '#16a34a', marginTop: 3, fontWeight: 600 }}>
                ● Vital Signs & Queue Synced
              </div>
            </div>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <div className="clinical-card hover-lift" style={{ padding: '14px 16px', borderLeft: '4px solid #10b981', borderRadius: 12 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Appointment Desk
              </div>
              <div style={{ fontSize: 17, fontWeight: 800, color: '#0f172a', marginTop: 4 }}>
                Doctor Schedules Synced
              </div>
              <div style={{ fontSize: 12, color: '#16a34a', marginTop: 3, fontWeight: 600 }}>
                ● Realtime Booking Open
              </div>
            </div>
          </Col>
        </Row>
      </div>

      <RoleGuard
        allow={[ROLES.ADMIN]}
        fallback={<Alert type="info" showIcon title="Admin management tools are restricted to System Administrators." />}
      >
        <Card
          title={
            <span style={{ fontWeight: 700, color: '#0f172a' }}>
              Admin Administration Suite
            </span>
          }
          style={{ borderRadius: 14, borderColor: '#e2e8f0', background: '#ffffff' }}
        >
          <Typography.Text type="secondary" style={{ fontSize: 13 }}>
            Staff account administration (FR-AUTH-03), role assignments, and hospital configuration settings are accessible to Admin users.
          </Typography.Text>
        </Card>
      </RoleGuard>
    </div>
  );
}


