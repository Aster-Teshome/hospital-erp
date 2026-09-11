import { useState } from 'react';
import {
  Button,
  Card,
  Popconfirm,
  Select,
  Space,
  Table,
  Tag,
  Typography,
  message,
} from 'antd';
import {
  CheckCircleOutlined,
  HeartOutlined,
  PlusOutlined,
  SolutionOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { OpdFilters, OpdVisit, OpdVisitStatus } from '../types';
import { useCompleteVisit, useOpdQueue } from '../hooks/outpatient.hooks';
import { OpdStatusBadge } from '../components/OpdStatusBadge';
import { CheckInModal } from '../components/CheckInModal';
import { VitalSignsDrawer } from '../components/VitalSignsDrawer';
import { ConsultationModal } from '../components/ConsultationModal';

export function OutpatientQueuePage() {
  const [filters, setFilters] = useState<OpdFilters>({});
  const [isCheckInOpen, setIsCheckInOpen] = useState(false);
  const [selectedVisitForVitals, setSelectedVisitForVitals] = useState<OpdVisit | null>(null);
  const [selectedVisitForConsultation, setSelectedVisitForConsultation] = useState<OpdVisit | null>(null);

  const { data: visits = [], isLoading } = useOpdQueue(filters);
  const completeVisitMutation = useCompleteVisit();

  function handleComplete(visitId: string) {
    completeVisitMutation.mutate(visitId, {
      onSuccess: () => message.success('Outpatient visit marked as completed!'),
      onError: () => message.error('Failed to complete visit'),
    });
  }

  const columns: ColumnsType<OpdVisit> = [
    {
      title: 'Patient',
      key: 'patient',
      render: (_, record) => (
        <div>
          <Typography.Text strong>{record.patientName}</Typography.Text>
          <div>
            <Typography.Text type="secondary" style={{ fontSize: 12 }}>
              MRN: {record.patientMrn}
            </Typography.Text>
          </div>
        </div>
      ),
    },
    {
      title: 'Attending Doctor',
      key: 'doctor',
      render: (_, record) => record.doctorName ?? record.doctorId ?? 'Unassigned',
    },
    {
      title: 'Check-in Time',
      dataIndex: 'checkInTime',
      key: 'checkInTime',
    },
    {
      title: 'Vitals Summary',
      key: 'vitals',
      render: (_, record) => {
        if (!record.vitals) {
          return <Tag color="warning">Pending Vitals</Tag>;
        }
        return (
          <div style={{ fontSize: 12 }}>
            <div>
              BP: {record.vitals.bloodPressureSystolic ?? '--'}/
              {record.vitals.bloodPressureDiastolic ?? '--'} mmHg
            </div>
            <div style={{ color: '#64748b' }}>
              Temp: {record.vitals.temperature ? `${record.vitals.temperature}°C` : '--'} | Pulse:{' '}
              {record.vitals.heartRate ?? '--'} bpm
            </div>
          </div>
        );
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: OpdVisitStatus) => <OpdStatusBadge status={status} />,
    },
    {
      title: 'Clinical Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="small">
          {/* Record Vitals button */}
          <Button
            size="small"
            icon={<HeartOutlined />}
            onClick={() => setSelectedVisitForVitals(record)}
          >
            {record.vitals ? 'Edit Vitals' : 'Record Vitals'}
          </Button>

          {/* Doctor Consultation button */}
          <Button
            size="small"
            type="primary"
            icon={<SolutionOutlined />}
            onClick={() => setSelectedVisitForConsultation(record)}
          >
            Consultation
          </Button>

          {/* Complete Visit */}
          {record.status !== 'completed' && (
            <Popconfirm
              title="Complete Visit"
              description="Mark this outpatient encounter as finalized?"
              onConfirm={() => handleComplete(record.id)}
              okText="Complete"
              cancelText="Cancel"
            >
              <Button size="small" type="link" icon={<CheckCircleOutlined />}>
                Finalize
              </Button>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Header */}
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
            Outpatient & Clinical Consultations (OPD)
          </Typography.Title>
          <Typography.Text type="secondary">
            Manage patient queue, triage vitals, clinical notes, diagnosis, prescriptions, and lab orders
          </Typography.Text>
        </div>

        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setIsCheckInOpen(true)}
        >
          Check In Patient
        </Button>
      </div>

      {/* Filter Bar */}
      <Card size="small">
        <Space wrap>
          <Select
            placeholder="Filter by Status"
            allowClear
            style={{ width: 180 }}
            value={filters.status}
            onChange={(val) => setFilters((prev) => ({ ...prev, status: val }))}
            options={[
              { value: 'waiting', label: 'Waiting for Vitals' },
              { value: 'vitals_done', label: 'Vitals Recorded' },
              { value: 'in_consultation', label: 'In Consultation' },
              { value: 'completed', label: 'Completed' },
            ]}
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

      {/* OPD Visits Queue Table */}
      <Card>
        <Table<OpdVisit>
          rowKey="id"
          columns={columns}
          dataSource={visits}
          loading={isLoading}
          pagination={{ pageSize: 10 }}
          locale={{
            emptyText: (
              <div style={{ padding: 32, textAlign: 'center' }}>
                <TeamOutlined style={{ fontSize: 36, color: '#bfbfbf', marginBottom: 8 }} />
                <div>No patients currently waiting in the Outpatient queue.</div>
              </div>
            ),
          }}
        />
      </Card>

      {/* Modals & Drawers */}
      <CheckInModal open={isCheckInOpen} onClose={() => setIsCheckInOpen(false)} />

      <VitalSignsDrawer
        open={Boolean(selectedVisitForVitals)}
        visit={selectedVisitForVitals}
        onClose={() => setSelectedVisitForVitals(null)}
      />

      <ConsultationModal
        open={Boolean(selectedVisitForConsultation)}
        visit={selectedVisitForConsultation}
        onClose={() => setSelectedVisitForConsultation(null)}
      />
    </div>
  );
}
