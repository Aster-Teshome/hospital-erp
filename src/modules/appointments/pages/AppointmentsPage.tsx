import { useState } from 'react';
import {
  Button,
  Card,
  DatePicker,
  Popconfirm,
  Select,
  Space,
  Table,
  Typography,
  message,
} from 'antd';
import { CalendarOutlined, PlusOutlined, ScheduleOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { Appointment, AppointmentFilters, AppointmentStatus } from '../types';
import {
  useAppointments,
  useCancelAppointment,
  useUpdateAppointmentStatus,
} from '../hooks/appointments.hooks';
import { AppointmentStatusTag } from '../components/AppointmentStatusTag';
import { BookingAppointmentModal } from '../components/BookingAppointmentModal';
import { DoctorScheduleModal } from '../components/DoctorScheduleModal';

export function AppointmentsPage() {
  const [filters, setFilters] = useState<AppointmentFilters>({});
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);

  const { data: appointments = [], isLoading } = useAppointments(filters);
  const updateStatusMutation = useUpdateAppointmentStatus();
  const cancelMutation = useCancelAppointment();

  function handleStatusChange(id: string, newStatus: AppointmentStatus) {
    updateStatusMutation.mutate(
      { id, status: newStatus },
      {
        onSuccess: () => message.success(`Status updated to ${newStatus}`),
        onError: () => message.error('Failed to update status'),
      },
    );
  }

  function handleCancel(id: string) {
    cancelMutation.mutate(
      { id, reason: 'Cancelled by staff' },
      {
        onSuccess: () => message.success('Appointment cancelled'),
        onError: () => message.error('Failed to cancel appointment'),
      },
    );
  }

  const columns: ColumnsType<Appointment> = [
    {
      title: 'Patient',
      key: 'patient',
      render: (_, record) => (
        <div>
          <Typography.Text strong>{record.patientName ?? record.patientId}</Typography.Text>
          {record.patientMrn && (
            <div>
              <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                MRN: {record.patientMrn}
              </Typography.Text>
            </div>
          )}
        </div>
      ),
    },
    {
      title: 'Doctor',
      key: 'doctor',
      render: (_, record) => (
        <div>
          <Typography.Text>{record.doctorName ?? record.doctorId}</Typography.Text>
          {record.doctorSpecialty && (
            <div>
              <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                {record.doctorSpecialty}
              </Typography.Text>
            </div>
          )}
        </div>
      ),
    },
    {
      title: 'Date & Time',
      key: 'dateTime',
      render: (_, record) => (
        <div>
          <div>{record.appointmentDate}</div>
          <Typography.Text type="secondary" style={{ fontSize: 12 }}>
            {record.startTime} {record.endTime ? `- ${record.endTime}` : ''}
          </Typography.Text>
        </div>
      ),
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => (
        <span style={{ textTransform: 'capitalize' }}>{type.replace('_', ' ')}</span>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: AppointmentStatus) => <AppointmentStatusTag status={status} />,
    },
    {
      title: 'Reason',
      dataIndex: 'reason',
      key: 'reason',
      ellipsis: true,
      render: (reason?: string) => reason || '-',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="small">
          {record.status === 'scheduled' && (
            <Button
              size="small"
              type="link"
              onClick={() => handleStatusChange(record.id, 'confirmed')}
            >
              Confirm
            </Button>
          )}

          {(record.status === 'scheduled' || record.status === 'confirmed') && (
            <Button
              size="small"
              type="link"
              onClick={() => handleStatusChange(record.id, 'checked_in')}
            >
              Check In
            </Button>
          )}

          {record.status === 'checked_in' && (
            <Button
              size="small"
              type="link"
              onClick={() => handleStatusChange(record.id, 'completed')}
            >
              Complete
            </Button>
          )}

          {record.status !== 'cancelled' && record.status !== 'completed' && (
            <Popconfirm
              title="Cancel Appointment"
              description="Are you sure you want to cancel this appointment?"
              onConfirm={() => handleCancel(record.id)}
              okText="Yes, Cancel"
              cancelText="No"
            >
              <Button size="small" type="link" danger>
                Cancel
              </Button>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 8,
        }}
      >
        <div>
          <Typography.Title level={3} style={{ margin: 0 }}>
            Appointments
          </Typography.Title>
          <Typography.Text type="secondary">
            Manage patient bookings, clinic consultations, and doctor schedules
          </Typography.Text>
        </div>

        <Space>
          <Button icon={<ScheduleOutlined />} onClick={() => setIsScheduleOpen(true)}>
            Doctor Schedules
          </Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setIsBookingOpen(true)}
          >
            Book Appointment
          </Button>
        </Space>
      </div>

      {/* Filters Bar */}
      <Card size="small">
        <Space wrap>
          <Select
            placeholder="Status"
            allowClear
            style={{ width: 150 }}
            value={filters.status}
            onChange={(val) => setFilters((prev) => ({ ...prev, status: val }))}
            options={[
              { value: 'scheduled', label: 'Scheduled' },
              { value: 'confirmed', label: 'Confirmed' },
              { value: 'checked_in', label: 'Checked In' },
              { value: 'completed', label: 'Completed' },
              { value: 'cancelled', label: 'Cancelled' },
            ]}
          />

          <DatePicker
            placeholder="Filter by Date"
            onChange={(_, dateStr) =>
              setFilters((prev) => ({
                ...prev,
                date: Array.isArray(dateStr) ? dateStr[0] : (dateStr || undefined),
              }))
            }
          />

          <Select
            placeholder="Filter by Doctor"
            allowClear
            style={{ width: 220 }}
            value={filters.doctorId}
            onChange={(val) => setFilters((prev) => ({ ...prev, doctorId: val }))}
            options={[
              { value: 'doc-1', label: 'Dr. Abebe Kebede' },
              { value: 'doc-2', label: 'Dr. Sara Tesfaye' },
              { value: 'doc-3', label: 'Dr. Daniel Haile' },
              { value: 'doc-4', label: 'Dr. Tigist Mengistu' },
            ]}
          />
        </Space>
      </Card>

      {/* Appointments List Table */}
      <Card>
        <Table<Appointment>
          rowKey="id"
          columns={columns}
          dataSource={appointments}
          loading={isLoading}
          pagination={{ pageSize: 10 }}
          locale={{
            emptyText: (
              <div style={{ padding: 24, textAlign: 'center' }}>
                <CalendarOutlined style={{ fontSize: 36, color: '#bfbfbf', marginBottom: 8 }} />
                <div>No appointments found. Book an appointment to get started.</div>
              </div>
            ),
          }}
        />
      </Card>

      {/* Modals */}
      <BookingAppointmentModal
        open={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
      />

      <DoctorScheduleModal
        open={isScheduleOpen}
        onClose={() => setIsScheduleOpen(false)}
      />
    </div>
  );
}
