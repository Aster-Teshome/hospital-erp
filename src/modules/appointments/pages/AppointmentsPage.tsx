import { useState } from 'react';
import {
  Badge,
  Button,
  Card,
  DatePicker,
  Dropdown,
  Popconfirm,
  Select,
  Space,
  Table,
  Tabs,
  Typography,
  message,
} from 'antd';
import type { MenuProps } from 'antd';
import {
  CalendarOutlined,
  CheckCircleOutlined,
  CheckSquareOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  EyeOutlined,
  MoreOutlined,
  PlusOutlined,
  ScheduleOutlined,
  UserOutlined,
} from '@ant-design/icons';
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
import { AppointmentDetailsDrawer } from '../components/AppointmentDetailsDrawer';

export function AppointmentsPage() {
  const [filters, setFilters] = useState<AppointmentFilters>({});
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

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

  // Metric counts
  const totalCount = appointments.length;
  const scheduledCount = appointments.filter((a) => a.status === 'scheduled' || a.status === 'confirmed').length;
  const checkedInCount = appointments.filter((a) => a.status === 'checked_in').length;
  const completedCount = appointments.filter((a) => a.status === 'completed').length;

  const columns: ColumnsType<Appointment> = [
    {
      title: 'Patient',
      key: 'patient',
      width: 250,
      render: (_, record) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: '#e0f2fe',
              color: '#0284c7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: 14,
              flexShrink: 0,
              border: '1px solid #bae6fd',
            }}
          >
            <UserOutlined />
          </div>
          <div style={{ minWidth: 0, overflow: 'hidden' }}>
            <Typography.Text
              strong
              style={{
                color: '#0f172a',
                display: 'block',
                fontSize: 13,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {record.patientName ?? record.patientId}
            </Typography.Text>
            <Typography.Text
              type="secondary"
              style={{ fontSize: 11, whiteSpace: 'nowrap', display: 'block' }}
            >
              MRN: {record.patientMrn ?? record.patientId}
            </Typography.Text>
          </div>
        </div>
      ),
    },
    {
      title: 'Doctor & Department',
      key: 'doctor',
      width: 230,
      render: (_, record) => (
        <div style={{ minWidth: 0, overflow: 'hidden' }}>
          <Typography.Text
            strong
            style={{
              color: '#1e293b',
              display: 'block',
              fontSize: 13,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {record.doctorName ?? record.doctorId}
          </Typography.Text>
          <Typography.Text
            type="secondary"
            style={{ fontSize: 11, whiteSpace: 'nowrap', display: 'block' }}
          >
            {record.doctorSpecialty ?? 'General Practice'}
          </Typography.Text>
        </div>
      ),
    },
    {
      title: 'Date & Time',
      key: 'dateTime',
      width: 170,
      render: (_, record) => (
        <div style={{ whiteSpace: 'nowrap' }}>
          <div style={{ color: '#0f172a', fontWeight: 600, fontSize: 12 }}>
            {record.appointmentDate}
          </div>
          <div style={{ color: '#64748b', fontSize: 11 }}>
            <ClockCircleOutlined style={{ marginRight: 4 }} />
            {record.startTime} {record.endTime ? `- ${record.endTime}` : ''}
          </div>
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 140,
      render: (status: AppointmentStatus) => <AppointmentStatusTag status={status} />,
    },
    {
      title: 'Actions',
      key: 'actions',
      align: 'right',
      width: 160,
      fixed: 'right',
      render: (_, record) => {
        const moreMenuItems: MenuProps['items'] = [];

        if (record.status === 'scheduled') {
          moreMenuItems.push({
            key: 'confirm',
            icon: <CheckSquareOutlined style={{ color: '#0284c7' }} />,
            label: 'Confirm Appointment',
            onClick: () => handleStatusChange(record.id, 'confirmed'),
          });
        }

        if (record.status !== 'cancelled' && record.status !== 'completed') {
          moreMenuItems.push({
            type: 'divider',
          });
          moreMenuItems.push({
            key: 'cancel',
            danger: true,
            icon: <CloseCircleOutlined />,
            label: (
              <Popconfirm
                title="Cancel Appointment"
                description="Are you sure you want to cancel this booking?"
                onConfirm={() => handleCancel(record.id)}
                okText="Cancel"
                cancelText="Back"
              >
                <span>Cancel Booking</span>
              </Popconfirm>
            ),
          });
        }

        return (
          <Space size={6} style={{ whiteSpace: 'nowrap' }}>
            <Button
              size="small"
              icon={<EyeOutlined />}
              onClick={() => setSelectedAppointment(record)}
              style={{ borderRadius: 6, fontSize: 12, height: 28 }}
            >
              Details
            </Button>

            {(record.status === 'scheduled' || record.status === 'confirmed') && (
              <Button
                size="small"
                type="primary"
                onClick={() => handleStatusChange(record.id, 'checked_in')}
                style={{ borderRadius: 6, fontSize: 12, fontWeight: 600, height: 28 }}
              >
                Check In
              </Button>
            )}

            {record.status === 'checked_in' && (
              <Button
                size="small"
                type="primary"
                style={{
                  background: '#10b981',
                  borderColor: '#10b981',
                  borderRadius: 6,
                  fontSize: 12,
                  fontWeight: 600,
                  height: 28,
                }}
                onClick={() => handleStatusChange(record.id, 'completed')}
              >
                Complete
              </Button>
            )}

            {moreMenuItems.length > 0 && (
              <Dropdown menu={{ items: moreMenuItems }} trigger={['click']} placement="bottomRight">
                <Button
                  size="small"
                  type="text"
                  icon={<MoreOutlined style={{ fontSize: 16 }} />}
                  style={{ borderRadius: 6, width: 28, height: 28, padding: 0 }}
                />
              </Dropdown>
            )}
          </Space>
        );
      },
    },
  ];

  const activeTabKey = filters.status ?? 'all';

  function handleTabChange(key: string) {
    setFilters((prev) => ({
      ...prev,
      status: key === 'all' ? undefined : (key as AppointmentStatus),
    }));
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Title & Action Buttons */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 12,
        }}
      >
        <div>
          <Typography.Title level={3} style={{ margin: 0, fontWeight: 700, color: '#0f172a' }}>
            Appointments
          </Typography.Title>
          <Typography.Text type="secondary" style={{ fontSize: 14 }}>
            Manage patient bookings, clinic consultations, and doctor schedules
          </Typography.Text>
        </div>

        <Space size="middle">
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

      {/* Appointments KPI Metrics Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 14,
        }}
      >
        <div
          className="clinical-card hover-lift"
          style={{
            padding: '16px 18px',
            borderRadius: 14,
            borderLeft: '4px solid #0284c7',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#64748b', letterSpacing: '0.04em' }}>
              All Bookings
            </div>
            <div style={{ fontSize: 24, fontWeight: 800, color: '#0f172a', marginTop: 4 }}>
              {totalCount}
            </div>
          </div>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              background: '#e0f2fe',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#0284c7',
              fontSize: 18,
            }}
          >
            <CalendarOutlined />
          </div>
        </div>

        <div
          className="clinical-card hover-lift"
          style={{
            padding: '16px 18px',
            borderRadius: 14,
            borderLeft: '4px solid #f59e0b',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#64748b', letterSpacing: '0.04em' }}>
              Scheduled / Confirmed
            </div>
            <div style={{ fontSize: 24, fontWeight: 800, color: '#b45309', marginTop: 4 }}>
              {scheduledCount}
            </div>
          </div>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              background: '#fef3c7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#d97706',
              fontSize: 18,
            }}
          >
            <ClockCircleOutlined />
          </div>
        </div>

        <div
          className="clinical-card hover-lift"
          style={{
            padding: '16px 18px',
            borderRadius: 14,
            borderLeft: '4px solid #8b5cf6',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#64748b', letterSpacing: '0.04em' }}>
              Checked In
            </div>
            <div style={{ fontSize: 24, fontWeight: 800, color: '#6b21a8', marginTop: 4 }}>
              {checkedInCount}
            </div>
          </div>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              background: '#f3e8ff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#8b5cf6',
              fontSize: 18,
            }}
          >
            <UserOutlined />
          </div>
        </div>

        <div
          className="clinical-card hover-lift"
          style={{
            padding: '16px 18px',
            borderRadius: 14,
            borderLeft: '4px solid #10b981',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#64748b', letterSpacing: '0.04em' }}>
              Completed
            </div>
            <div style={{ fontSize: 24, fontWeight: 800, color: '#15803d', marginTop: 4 }}>
              {completedCount}
            </div>
          </div>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              background: '#dcfce7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#10b981',
              fontSize: 18,
            }}
          >
            <CheckCircleOutlined />
          </div>
        </div>
      </div>

      {/* Appointments List Table with Filter Tabs */}
      <Card style={{ border: '1px solid #e2e8f0', borderRadius: 14 }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 12,
            marginBottom: 16,
            borderBottom: '1px solid #f1f5f9',
            paddingBottom: 8,
          }}
        >
          <Tabs
            activeKey={activeTabKey}
            onChange={handleTabChange}
            tabBarStyle={{ margin: 0, border: 'none' }}
            items={[
              {
                key: 'all',
                label: (
                  <Space size={6}>
                    <span>All</span>
                    <Badge count={totalCount} style={{ backgroundColor: '#64748b' }} />
                  </Space>
                ),
              },
              {
                key: 'scheduled',
                label: (
                  <Space size={6}>
                    <span>Scheduled</span>
                    <Badge count={appointments.filter((a) => a.status === 'scheduled').length} style={{ backgroundColor: '#0284c7' }} />
                  </Space>
                ),
              },
              {
                key: 'confirmed',
                label: (
                  <Space size={6}>
                    <span>Confirmed</span>
                    <Badge count={appointments.filter((a) => a.status === 'confirmed').length} style={{ backgroundColor: '#38bdf8' }} />
                  </Space>
                ),
              },
              {
                key: 'checked_in',
                label: (
                  <Space size={6}>
                    <span>Checked In</span>
                    <Badge count={checkedInCount} style={{ backgroundColor: '#8b5cf6' }} />
                  </Space>
                ),
              },
              {
                key: 'completed',
                label: (
                  <Space size={6}>
                    <span>Completed</span>
                    <Badge count={completedCount} style={{ backgroundColor: '#10b981' }} />
                  </Space>
                ),
              },
              {
                key: 'cancelled',
                label: (
                  <Space size={6}>
                    <span>Cancelled</span>
                    <Badge count={appointments.filter((a) => a.status === 'cancelled').length} style={{ backgroundColor: '#ef4444' }} />
                  </Space>
                ),
              },
            ]}
          />

          <Space wrap size="middle">
            <DatePicker
              placeholder="Filter by Date"
              style={{ width: 160 }}
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
        </div>

        <Table<Appointment>
          rowKey="id"
          columns={columns}
          dataSource={appointments}
          loading={isLoading}
          tableLayout="fixed"
          pagination={{ pageSize: 8 }}
          scroll={{ x: 950 }}
          onRow={(record) => ({
            onClick: (e) => {
              if (
                (e.target as HTMLElement).closest('button') ||
                (e.target as HTMLElement).closest('.ant-popover')
              ) {
                return;
              }
              setSelectedAppointment(record);
            },
            style: { cursor: 'pointer' },
          })}
          locale={{
            emptyText: (
              <div style={{ padding: 36, textAlign: 'center' }}>
                <CalendarOutlined style={{ fontSize: 36, color: '#cbd5e1', marginBottom: 10 }} />
                <Typography.Text strong style={{ display: 'block', color: '#475569' }}>
                  No appointments found
                </Typography.Text>
              </div>
            ),
          }}
        />
      </Card>

      {/* Modals & Drawers */}
      <BookingAppointmentModal
        open={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
      />

      <DoctorScheduleModal
        open={isScheduleOpen}
        onClose={() => setIsScheduleOpen(false)}
      />

      <AppointmentDetailsDrawer
        open={Boolean(selectedAppointment)}
        appointment={selectedAppointment}
        onClose={() => setSelectedAppointment(null)}
        onStatusChange={handleStatusChange}
        onCancel={handleCancel}
      />
    </div>
  );
}
