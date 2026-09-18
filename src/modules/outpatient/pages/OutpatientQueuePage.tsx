import { useState } from 'react';
import {
  Badge,
  Button,
  Card,
  Col,
  Dropdown,
  Popconfirm,
  Row,
  Select,
  Space,
  Table,
  Tabs,
  Tag,
  Typography,
  message,
} from 'antd';
import type { MenuProps } from 'antd';
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  DashboardOutlined,
  HeartOutlined,
  MoreOutlined,
  PlusOutlined,
  SolutionOutlined,
  SyncOutlined,
  UserOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { OpdFilters, OpdVisit, OpdVisitStatus } from '../types';
import { useCompleteVisit, useOpdQueue } from '../hooks/outpatient.hooks';
import { OpdStatusBadge } from '../components/OpdStatusBadge';
import { CheckInModal } from '../components/CheckInModal';
import { VitalSignsDrawer } from '../components/VitalSignsDrawer';
import { ConsultationModal } from '../components/ConsultationModal';

export function OutpatientQueuePage() {
  const [activeQueueTab, setActiveQueueTab] = useState<string>('all');
  const [selectedDoctor, setSelectedDoctor] = useState<string | undefined>(undefined);
  const [isCheckInOpen, setIsCheckInOpen] = useState(false);
  const [selectedVisitForVitals, setSelectedVisitForVitals] = useState<OpdVisit | null>(null);
  const [selectedVisitForConsultation, setSelectedVisitForConsultation] = useState<OpdVisit | null>(null);

  const filters: OpdFilters = {
    doctorId: selectedDoctor,
    status:
      activeQueueTab === 'waiting'
        ? 'waiting'
        : activeQueueTab === 'ready'
          ? 'vitals_done'
          : activeQueueTab === 'completed'
            ? 'completed'
            : undefined,
  };

  const { data: visits = [], isLoading } = useOpdQueue(filters);
  const completeVisitMutation = useCompleteVisit();

  // Metric counts
  const totalVisits = visits.length;
  const waitingForVitals = visits.filter((v) => v.status === 'waiting').length;
  const inConsultation = visits.filter((v) => v.status === 'vitals_done' || v.status === 'in_consultation').length;
  const completedVisits = visits.filter((v) => v.status === 'completed').length;

  function handleComplete(visitId: string) {
    completeVisitMutation.mutate(visitId, {
      onSuccess: () => message.success('Outpatient encounter finalized successfully!'),
      onError: () => message.error('Failed to finalize visit'),
    });
  }

  const columns: ColumnsType<OpdVisit> = [
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
              {record.patientName}
            </Typography.Text>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 1 }}>
              <span style={{ fontSize: 11, color: '#64748b', whiteSpace: 'nowrap' }}>
                MRN: {record.patientMrn}
              </span>
              {record.patientAge && (
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 600,
                    padding: '1px 5px',
                    borderRadius: 4,
                    background: '#f1f5f9',
                    color: '#475569',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {record.patientAge}y {record.patientGender ? `· ${record.patientGender[0].toUpperCase()}` : ''}
                </span>
              )}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Attending Physician',
      key: 'doctor',
      width: 220,
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
            {record.doctorName ?? record.doctorId ?? 'Unassigned'}
          </Typography.Text>
          <Typography.Text
            type="secondary"
            style={{ fontSize: 11, whiteSpace: 'nowrap', display: 'block' }}
          >
            Consultation Rm 102
          </Typography.Text>
        </div>
      ),
    },
    {
      title: 'Check-In',
      dataIndex: 'checkInTime',
      key: 'checkInTime',
      width: 140,
      render: (time: string) => (
        <Tag
          style={{
            margin: 0,
            borderRadius: 6,
            fontWeight: 500,
            whiteSpace: 'nowrap',
            border: '1px solid #e2e8f0',
            background: '#ffffff',
            color: '#334155',
            fontSize: 11,
          }}
        >
          <ClockCircleOutlined style={{ marginRight: 4, color: '#64748b' }} />
          {time}
        </Tag>
      ),
    },
    {
      title: 'Vitals & Triage',
      key: 'vitals',
      width: 200,
      render: (_, record) => {
        if (!record.vitals) {
          return (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                fontSize: 11,
                fontWeight: 600,
                color: '#d97706',
                background: '#fffbeb',
                border: '1px solid #fde68a',
                padding: '3px 8px',
                borderRadius: 6,
                whiteSpace: 'nowrap',
              }}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background: '#f59e0b',
                }}
                className="clinical-pulse-amber"
              />
              Awaiting Vitals
            </span>
          );
        }
        return (
          <div
            style={{
              padding: '3px 8px',
              background: '#f8fafc',
              borderRadius: 6,
              border: '1px solid #e2e8f0',
              fontSize: 11,
              lineHeight: 1.35,
              display: 'inline-block',
              whiteSpace: 'nowrap',
            }}
          >
            <div style={{ fontWeight: 700, color: '#0f172a', fontSize: 12 }}>
              BP: {record.vitals.bloodPressureSystolic ?? '--'}/{record.vitals.bloodPressureDiastolic ?? '--'}
            </div>
            <div style={{ color: '#64748b', fontSize: 10 }}>
              {record.vitals.temperature ? `${record.vitals.temperature}°C` : '--'} · HR {record.vitals.heartRate ?? '--'} · SpO2 {record.vitals.spO2 ?? '--'}%
            </div>
          </div>
        );
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 140,
      render: (status: OpdVisitStatus) => <OpdStatusBadge status={status} />,
    },
    {
      title: 'Actions',
      key: 'actions',
      align: 'right',
      width: 120,
      fixed: 'right',
      render: (_, record) => {
        const moreMenuItems: MenuProps['items'] = [
          {
            key: 'vitals',
            icon: <HeartOutlined style={{ color: '#0284c7' }} />,
            label: 'Record / Edit Vitals',
            onClick: () => setSelectedVisitForVitals(record),
          },
        ];

        if (record.status !== 'completed') {
          moreMenuItems.push({
            type: 'divider',
          });
          moreMenuItems.push({
            key: 'finalize',
            icon: <CheckCircleOutlined style={{ color: '#10b981' }} />,
            label: (
              <Popconfirm
                title="Finalize Encounter"
                description="Mark patient consultation as finalized?"
                onConfirm={() => handleComplete(record.id)}
                okText="Finalize"
                cancelText="Back"
              >
                <span>Finalize Encounter</span>
              </Popconfirm>
            ),
          });
        }

        return (
          <Space size={6} style={{ whiteSpace: 'nowrap' }}>
            <Button
              size="small"
              type="primary"
              icon={<SolutionOutlined />}
              onClick={() => setSelectedVisitForConsultation(record)}
              style={{
                borderRadius: 6,
                fontSize: 12,
                fontWeight: 600,
                padding: '0 10px',
                height: 28,
              }}
            >
              Consultation
            </Button>

            <Dropdown menu={{ items: moreMenuItems }} trigger={['click']} placement="bottomRight">
              <Button
                size="small"
                type="text"
                icon={<MoreOutlined style={{ fontSize: 16 }} />}
                style={{ borderRadius: 6, width: 28, height: 28, padding: 0 }}
              />
            </Dropdown>
          </Space>
        );
      },
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Title & Primary Actions */}
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
          <Typography.Title
            level={3}
            style={{ margin: 0, fontWeight: 700, letterSpacing: '-0.02em', color: '#0f172a' }}
          >
            Outpatient
          </Typography.Title>
          <Typography.Text type="secondary" style={{ fontSize: 14 }}>
            Active patient queue, nursing triage, and doctor consultation workspace
          </Typography.Text>
        </div>

        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setIsCheckInOpen(true)}
          style={{ fontWeight: 600 }}
        >
          Check In Patient
        </Button>
      </div>

      {/* OPD KPI Metrics Cards */}
      <Row gutter={[14, 14]}>
        <Col xs={12} sm={6}>
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
                Queue Today
              </div>
              <div style={{ fontSize: 24, fontWeight: 800, color: '#0f172a', marginTop: 4 }}>
                {totalVisits}
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
              <DashboardOutlined />
            </div>
          </div>
        </Col>

        <Col xs={12} sm={6}>
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
                Awaiting Vitals
              </div>
              <div style={{ fontSize: 24, fontWeight: 800, color: '#b45309', marginTop: 4 }}>
                {waitingForVitals}
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
              <HeartOutlined />
            </div>
          </div>
        </Col>

        <Col xs={12} sm={6}>
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
                Ready for Doctor
              </div>
              <div style={{ fontSize: 24, fontWeight: 800, color: '#6b21a8', marginTop: 4 }}>
                {inConsultation}
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
              <SyncOutlined />
            </div>
          </div>
        </Col>

        <Col xs={12} sm={6}>
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
                {completedVisits}
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
        </Col>
      </Row>

      {/* OPD Clinical Queue Tabs & Filter Bar */}
      <Card
        style={{
          border: '1px solid #e2e8f0',
          borderRadius: 14,
        }}
      >
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
            activeKey={activeQueueTab}
            onChange={setActiveQueueTab}
            tabBarStyle={{ margin: 0, border: 'none' }}
            items={[
              {
                key: 'all',
                label: (
                  <Space size={6}>
                    <span>All Queue</span>
                    <Badge count={totalVisits} style={{ backgroundColor: '#64748b' }} />
                  </Space>
                ),
              },
              {
                key: 'waiting',
                label: (
                  <Space size={6}>
                    <span>Waiting for Vitals</span>
                    <Badge count={waitingForVitals} style={{ backgroundColor: '#f59e0b' }} />
                  </Space>
                ),
              },
              {
                key: 'ready',
                label: (
                  <Space size={6}>
                    <span>Ready for Doctor</span>
                    <Badge count={inConsultation} style={{ backgroundColor: '#0284c7' }} />
                  </Space>
                ),
              },
              {
                key: 'completed',
                label: (
                  <Space size={6}>
                    <span>Completed</span>
                    <Badge count={completedVisits} style={{ backgroundColor: '#10b981' }} />
                  </Space>
                ),
              },
            ]}
          />

          <Select
            placeholder="Filter by Attending Doctor"
            allowClear
            style={{ width: 240 }}
            value={selectedDoctor}
            onChange={setSelectedDoctor}
            options={[
              { value: 'doc-1', label: 'Dr. Abebe Kebede' },
              { value: 'doc-2', label: 'Dr. Sara Tesfaye' },
              { value: 'doc-3', label: 'Dr. Daniel Haile' },
              { value: 'doc-4', label: 'Dr. Tigist Mengistu' },
            ]}
          />
        </div>

        {/* OPD Queue Table */}
        <Table<OpdVisit>
          rowKey="id"
          columns={columns}
          dataSource={visits}
          loading={isLoading}
          pagination={{ pageSize: 8 }}
          scroll={{ x: 1070 }}
          locale={{
            emptyText: (
              <div style={{ padding: 40, textAlign: 'center' }}>
                <UserOutlined style={{ fontSize: 40, color: '#cbd5e1', marginBottom: 12 }} />
                <Typography.Text strong style={{ display: 'block', color: '#475569' }}>
                  No patients in this queue category
                </Typography.Text>
                <Typography.Text type="secondary" style={{ fontSize: 13 }}>
                  Switch tabs or click "Check In Patient" above to add a new patient.
                </Typography.Text>
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
