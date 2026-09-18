import {
  CalendarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  IdcardOutlined,
  UserOutlined,
} from '@ant-design/icons';
import {
  Button,
  Card,
  Descriptions,
  Divider,
  Drawer,
  Popconfirm,
  Skeleton,
  Space,
  Typography,
} from 'antd';
import type { Appointment, AppointmentStatus } from '../types';
import { useAppointment } from '../hooks/appointments.hooks';
import { AppointmentStatusTag } from './AppointmentStatusTag';

interface AppointmentDetailsDrawerProps {
  open: boolean;
  appointment: Appointment | null;
  onClose: () => void;
  onStatusChange: (id: string, status: AppointmentStatus) => void;
  onCancel: (id: string) => void;
}

export function AppointmentDetailsDrawer({
  open,
  appointment: initialAppointment,
  onClose,
  onStatusChange,
  onCancel,
}: AppointmentDetailsDrawerProps) {
  // Queries fresh appointment details if appointmentId exists
  const { data: queriedAppointment, isLoading } = useAppointment(
    initialAppointment?.id ?? '',
  );

  const appointment = queriedAppointment ?? initialAppointment;

  return (
    <Drawer
      title={
        appointment ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
            <span>Appointment Details</span>
            <AppointmentStatusTag status={appointment.status} />
          </div>
        ) : (
          'Appointment Details'
        )
      }
      open={open}
      onClose={onClose}
      size={Math.min(520, typeof window !== 'undefined' ? window.innerWidth : 520)}
      footer={
        appointment && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {appointment.status !== 'cancelled' && appointment.status !== 'completed' ? (
              <Popconfirm
                title="Cancel Appointment"
                description="Are you sure you want to cancel this appointment?"
                onConfirm={() => {
                  onCancel(appointment.id);
                  onClose();
                }}
                okText="Yes, Cancel"
                cancelText="No"
              >
                <Button danger icon={<CloseCircleOutlined />}>
                  Cancel Appointment
                </Button>
              </Popconfirm>
            ) : (
              <div />
            )}

            <Space>
              {appointment.status === 'scheduled' && (
                <Button
                  onClick={() => {
                    onStatusChange(appointment.id, 'confirmed');
                    onClose();
                  }}
                >
                  Confirm
                </Button>
              )}

              {(appointment.status === 'scheduled' || appointment.status === 'confirmed') && (
                <Button
                  type="primary"
                  icon={<CheckCircleOutlined />}
                  onClick={() => {
                    onStatusChange(appointment.id, 'checked_in');
                    onClose();
                  }}
                >
                  Check In Patient
                </Button>
              )}

              {appointment.status === 'checked_in' && (
                <Button
                  type="primary"
                  icon={<CheckCircleOutlined />}
                  onClick={() => {
                    onStatusChange(appointment.id, 'completed');
                    onClose();
                  }}
                >
                  Mark Completed
                </Button>
              )}
            </Space>
          </div>
        )
      }
    >
      {isLoading && !appointment ? (
        <Skeleton active paragraph={{ rows: 8 }} />
      ) : appointment ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Patient Details Card */}
          <Card size="small" title={<Space><UserOutlined style={{ color: '#136c64' }} /><span>Patient Information</span></Space>}>
            <Descriptions size="small" column={1}>
              <Descriptions.Item label="Full Name">
                <Typography.Text strong>{appointment.patientName ?? 'N/A'}</Typography.Text>
              </Descriptions.Item>
              <Descriptions.Item label="Card / MRN">
                <Typography.Text code>{appointment.patientMrn ?? appointment.patientId}</Typography.Text>
              </Descriptions.Item>
              <Descriptions.Item label="Patient ID">
                <Typography.Text copyable type="secondary" style={{ fontSize: 12 }}>
                  {appointment.patientId}
                </Typography.Text>
              </Descriptions.Item>
            </Descriptions>
          </Card>

          {/* Attending Doctor Card */}
          <Card size="small" title={<Space><IdcardOutlined style={{ color: '#136c64' }} /><span>Physician Information</span></Space>}>
            <Descriptions size="small" column={1}>
              <Descriptions.Item label="Attending Doctor">
                <Typography.Text strong>{appointment.doctorName ?? 'Assigned Doctor'}</Typography.Text>
              </Descriptions.Item>
              <Descriptions.Item label="Specialty">
                {appointment.doctorSpecialty ?? 'General Practice / Internal Medicine'}
              </Descriptions.Item>
            </Descriptions>
          </Card>

          {/* Schedule & Timing Card */}
          <Card size="small" title={<Space><CalendarOutlined style={{ color: '#136c64' }} /><span>Date & Schedule</span></Space>}>
            <Descriptions size="small" column={2}>
              <Descriptions.Item label="Date">
                <Typography.Text strong>{appointment.appointmentDate}</Typography.Text>
              </Descriptions.Item>
              <Descriptions.Item label="Time Slot">
                <Space>
                  <ClockCircleOutlined style={{ color: '#64748b' }} />
                  <span>
                    {appointment.startTime} {appointment.endTime ? `- ${appointment.endTime}` : ''}
                  </span>
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="Appointment Type">
                <span style={{ textTransform: 'capitalize', fontWeight: 600 }}>
                  {appointment.type.replace('_', ' ')}
                </span>
              </Descriptions.Item>
            </Descriptions>
          </Card>

          {/* Clinical Reason */}
          <Card size="small" title="Reason for Visit & Symptoms">
            <Typography.Paragraph style={{ margin: 0, color: appointment.reason ? '#334155' : '#94a3b8' }}>
              {appointment.reason || 'No specific visit reason provided.'}
            </Typography.Paragraph>

            {appointment.notes && (
              <>
                <Divider style={{ margin: '12px 0' }} />
                <Typography.Text type="secondary" style={{ fontSize: 13, display: 'block', marginBottom: 4 }}>
                  Staff / Clinical Notes:
                </Typography.Text>
                <Typography.Paragraph style={{ margin: 0, color: '#334155' }}>
                  {appointment.notes}
                </Typography.Paragraph>
              </>
            )}
          </Card>

          {/* Metadata */}
          <div style={{ padding: '0 8px', color: '#94a3b8', fontSize: 12 }}>
            <div>Appointment Reference: {appointment.id}</div>
            {appointment.createdAt && <div>Booked on: {new Date(appointment.createdAt).toLocaleString()}</div>}
          </div>
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: 32, color: '#94a3b8' }}>
          No appointment selected.
        </div>
      )}
    </Drawer>
  );
}
