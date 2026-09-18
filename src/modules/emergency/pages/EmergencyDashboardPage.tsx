import React, { useState } from 'react';
import {
  Button,
  Card,
  Col,
  Input,
  Progress,
  Row,
  Select,
  Space,
  Statistic,
  Table,
  Tag,
  Tooltip,
  Typography,
} from 'antd';
import {
  AlertOutlined,
  HeartOutlined,
  ReloadOutlined,
  SearchOutlined,
  ThunderboltOutlined,
  UserAddOutlined,
} from '@ant-design/icons';

import type { ColumnsType } from 'antd/es/table';
import { useEmergencyCases, useEmergencyStats } from '../hooks/emergency.hooks';
import type { EmergencyCase, EmergencyFilters, TriageCategory, EmergencyStatus } from '../types';
import { TriageBadge } from '../components/TriageBadge';
import { EmergencyStatusTag } from '../components/EmergencyStatusTag';
import { EmergencyRegistrationModal } from '../components/EmergencyRegistrationModal';
import { TriageAssessmentDrawer } from '../components/TriageAssessmentDrawer';
import { EmergencyCaseDetailsDrawer } from '../components/EmergencyCaseDetailsDrawer';

export const EmergencyDashboardPage: React.FC = () => {
  const [filters, setFilters] = useState<EmergencyFilters>({});
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [triageCase, setTriageCase] = useState<EmergencyCase | null>(null);
  const [detailsCase, setDetailsCase] = useState<EmergencyCase | null>(null);

  const { data: cases = [], isLoading, refetch, isFetching } = useEmergencyCases(filters);
  const { data: stats } = useEmergencyStats();

  const handleFilterChange = (key: keyof EmergencyFilters, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value || undefined,
    }));
  };

  const columns: ColumnsType<EmergencyCase> = [
    {
      title: 'Triage / Acuity',
      dataIndex: 'triageCategory',
      key: 'triageCategory',
      width: 160,
      render: (cat: TriageCategory | undefined, record) => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <TriageBadge category={cat} />
          {record.triageTime && (
            <span style={{ fontSize: 11, color: '#64748b' }}>
              Triaged: {record.triageTime}
            </span>
          )}
        </div>
      ),
    },
    {
      title: 'Patient Details',
      dataIndex: 'patientName',
      key: 'patientName',
      width: 200,
      render: (name: string, record) => (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontWeight: 600, color: '#0f172a' }}>{name}</span>
            {record.isUnidentified && (
              <Tag color="red" style={{ fontSize: 10, padding: '0 4px', lineHeight: '16px' }}>
                UNKNOWN
              </Tag>
            )}
          </div>
          <div style={{ fontSize: 12, color: '#64748b', fontFamily: 'monospace' }}>
            {record.patientMrn}
          </div>
          <div style={{ fontSize: 11, color: '#94a3b8' }}>
            {record.age ? `${record.age} yrs` : 'Age unk.'} • {record.gender}
          </div>
        </div>
      ),
    },
    {
      title: 'Arrival',
      dataIndex: 'arrivalTime',
      key: 'arrivalTime',
      width: 130,
      render: (time: string, record) => {
        const modeColors: Record<string, string> = {
          ambulance: '#ef4444',
          walk_in: '#0284c7',
          police: '#3b82f6',
          referral: '#8b5cf6',
        };
        return (
          <div>
            <div style={{ fontWeight: 600, color: '#1e293b' }}>{time}</div>
            <Tag
              style={{
                fontSize: 10,
                color: modeColors[record.arrivalMode] || '#64748b',
                background: '#f8fafc',
                textTransform: 'uppercase',
                marginTop: 2,
              }}
            >
              {record.arrivalMode}
            </Tag>
          </div>
        );
      },
    },
    {
      title: 'Chief Complaint',
      dataIndex: 'chiefComplaint',
      key: 'chiefComplaint',
      ellipsis: true,
      render: (complaint: string) => (
        <Tooltip title={complaint}>
          <span style={{ color: '#0f172a', fontWeight: 500, fontSize: 13 }}>
            {complaint}
          </span>
        </Tooltip>
      ),
    },
    {
      title: 'Emergency Bay',
      dataIndex: 'assignedBay',
      key: 'assignedBay',
      width: 140,
      render: (bay: string | undefined) =>
        bay ? (
          <Tag style={{ background: '#e0f2fe', color: '#0369a1', borderColor: '#bae6fd', fontWeight: 600 }}>
            {bay}
          </Tag>
        ) : (
          <span style={{ color: '#94a3b8', fontStyle: 'italic', fontSize: 12 }}>Unallocated</span>
        ),
    },
    {
      title: 'Vitals Status',
      key: 'vitals',
      width: 150,
      render: (_, record) => {
        if (!record.vitals) {
          return (
            <span style={{ fontSize: 12, color: '#f59e0b', fontWeight: 500 }}>
              ⚠️ Vitals Pending
            </span>
          );
        }
        const bp =
          record.vitals.bloodPressureSystolic && record.vitals.bloodPressureDiastolic
            ? `${record.vitals.bloodPressureSystolic}/${record.vitals.bloodPressureDiastolic}`
            : '--';
        const hr = record.vitals.heartRate ?? '--';
        const spO2 = record.vitals.spO2 ? `${record.vitals.spO2}%` : '--';

        return (
          <div style={{ fontSize: 11, lineHeight: '16px' }}>
            <div>BP: <strong style={{ color: '#1e293b' }}>{bp}</strong></div>
            <div>
              HR:{' '}
              <strong style={{ color: (record.vitals.heartRate ?? 0) > 100 ? '#ef4444' : '#1e293b' }}>
                {hr} bpm
              </strong>
            </div>
            <div>
              SpO2:{' '}
              <strong style={{ color: (record.vitals.spO2 ?? 100) < 94 ? '#ef4444' : '#10b981' }}>
                {spO2}
              </strong>
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
      render: (status: EmergencyStatus) => <EmergencyStatusTag status={status} />,
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 170,
      render: (_, record) => (
        <Space size="small">
          {record.status === 'registered' ? (
            <Button
              type="primary"
              size="small"
              onClick={() => setTriageCase(record)}
              style={{
                background: '#f59e0b',
                borderColor: '#f59e0b',
                fontWeight: 600,
                fontSize: 12,
              }}
            >
              Triage
            </Button>
          ) : (
            <Button
              size="small"
              onClick={() => setTriageCase(record)}
              style={{ fontSize: 12 }}
            >
              Re-Triage
            </Button>
          )}

          <Button
            size="small"
            type="default"
            onClick={() => setDetailsCase(record)}
            style={{ fontSize: 12, fontWeight: 500 }}
          >
            Review
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      {/* Top Header */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
          marginBottom: 20,
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span
              style={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                backgroundColor: '#ef4444',
                boxShadow: '0 0 8px rgba(239, 68, 68, 0.8)',
              }}
            />
            <Typography.Title level={3} style={{ margin: 0, fontWeight: 700, fontSize: 22 }}>
              Emergency Department (ED)
            </Typography.Title>
          </div>
          <Typography.Text type="secondary" style={{ fontSize: 13 }}>
            Real-time emergency triage, resuscitation tracking, and acute patient disposition
          </Typography.Text>
        </div>

        <Space wrap>
          <Button
            icon={<ReloadOutlined spin={isFetching} />}
            onClick={() => refetch()}
            style={{ fontWeight: 500 }}
          >
            Refresh Board
          </Button>
          <Button
            type="primary"
            danger
            icon={<UserAddOutlined />}
            onClick={() => setIsRegisterOpen(true)}
            size="large"
            style={{ fontWeight: 600, boxShadow: '0 2px 6px rgba(239, 68, 68, 0.3)' }}
          >
            Register Emergency Patient
          </Button>
        </Space>
      </div>

      {/* KPI Cards Row */}
      <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
        <Col xs={24} sm={12} md={6} lg={4}>
          <Card size="small" style={{ borderRadius: 10, borderColor: '#e2e8f0' }}>
            <Statistic
              title={<span style={{ fontSize: 12, fontWeight: 600, color: '#64748b' }}>ACTIVE CASES</span>}
              value={stats?.activeCases ?? cases.length}
              styles={{ content: { color: '#0f172a', fontWeight: 800, fontSize: 24 } }}
              prefix={<AlertOutlined style={{ color: '#0284c7' }} />}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} md={6} lg={5}>
          <Card
            size="small"
            style={{
              borderRadius: 10,
              background: '#fef2f2',
              borderColor: '#fecaca',
            }}
          >
            <Statistic
              title={<span style={{ fontSize: 12, fontWeight: 700, color: '#991b1b' }}>P1 RESUSCITATION</span>}
              value={stats?.resuscitationCount ?? cases.filter((c) => c.triageCategory === 'immediate').length}
              styles={{ content: { color: '#dc2626', fontWeight: 800, fontSize: 24 } }}
              prefix={<ThunderboltOutlined style={{ color: '#ef4444' }} />}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} md={6} lg={5}>
          <Card
            size="small"
            style={{
              borderRadius: 10,
              background: '#fff7ed',
              borderColor: '#fed7aa',
            }}
          >
            <Statistic
              title={<span style={{ fontSize: 12, fontWeight: 700, color: '#9a3412' }}>P2 VERY URGENT</span>}
              value={stats?.veryUrgentCount ?? cases.filter((c) => c.triageCategory === 'very_urgent').length}
              styles={{ content: { color: '#ea580c', fontWeight: 800, fontSize: 24 } }}
              prefix={<HeartOutlined style={{ color: '#f97316' }} />}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} md={6} lg={5}>
          <Card size="small" style={{ borderRadius: 10, borderColor: '#e2e8f0' }}>
            <Statistic
              title={<span style={{ fontSize: 12, fontWeight: 600, color: '#64748b' }}>IN TREATMENT</span>}
              value={stats?.inTreatmentCount ?? cases.filter((c) => c.status === 'in_treatment').length}
              styles={{ content: { color: '#8b5cf6', fontWeight: 800, fontSize: 24 } }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} md={6} lg={5}>
          <Card size="small" style={{ borderRadius: 10, borderColor: '#e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#64748b' }}>ED OCCUPANCY</div>
                <div style={{ fontSize: 24, fontWeight: 800, color: '#0f172a' }}>
                  {stats?.occupancyRate ?? 68}%
                </div>
              </div>
              <Progress
                type="circle"
                percent={stats?.occupancyRate ?? 68}
                size={40}
                strokeColor="#0284c7"
              />
            </div>
          </Card>
        </Col>
      </Row>

      {/* Filter and Search Bar */}
      <Card
        size="small"
        style={{
          borderRadius: 12,
          marginBottom: 16,
          borderColor: '#e2e8f0',
          background: '#ffffff',
        }}
      >
        <Row gutter={[12, 12]} align="middle">
          <Col xs={24} sm={8} md={8}>
            <Input
              placeholder="Search patient name, MRN, complaint, bay..."
              prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
              allowClear
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
            />
          </Col>

          <Col xs={12} sm={5} md={5}>
            <Select
              style={{ width: '100%' }}
              placeholder="Acuity / Priority"
              allowClear
              value={filters.triageCategory}
              onChange={(val) => handleFilterChange('triageCategory', val)}
              options={[
                { label: 'All Acuities', value: '' },
                { label: '🔴 P1 Immediate (Resus)', value: 'immediate' },
                { label: '🟠 P2 Very Urgent', value: 'very_urgent' },
                { label: '🟡 P3 Urgent', value: 'urgent' },
                { label: '🟢 P4 Standard', value: 'standard' },
                { label: '🔵 P5 Non-Urgent', value: 'non_urgent' },
              ]}
            />
          </Col>

          <Col xs={12} sm={5} md={5}>
            <Select
              style={{ width: '100%' }}
              placeholder="ED Status"
              allowClear
              value={filters.status}
              onChange={(val) => handleFilterChange('status', val)}
              options={[
                { label: 'All Statuses', value: '' },
                { label: 'Awaiting Triage', value: 'registered' },
                { label: 'Triaged / Waiting Dr', value: 'triaged' },
                { label: 'In Treatment', value: 'in_treatment' },
                { label: 'Discharged Home', value: 'discharged' },
              ]}
            />
          </Col>

          <Col xs={12} sm={6} md={6}>
            <Select
              style={{ width: '100%' }}
              placeholder="Arrival Mode"
              allowClear
              value={filters.arrivalMode}
              onChange={(val) => handleFilterChange('arrivalMode', val)}
              options={[
                { label: 'All Arrival Modes', value: '' },
                { label: '🚑 Ambulance', value: 'ambulance' },
                { label: '🚶 Walk-in', value: 'walk_in' },
                { label: '🚔 Police / Escort', value: 'police' },
                { label: '🏥 Inter-facility Referral', value: 'referral' },
              ]}
            />
          </Col>
        </Row>
      </Card>

      {/* Main Table */}
      <Card
        styles={{ body: { padding: 0 } }}
        style={{ borderRadius: 12, borderColor: '#e2e8f0', overflow: 'hidden' }}
      >
        <Table<EmergencyCase>
          rowKey="id"
          columns={columns}
          dataSource={cases}
          loading={isLoading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} emergency cases`,
          }}
          scroll={{ x: 1100 }}
        />
      </Card>

      {/* Modals and Drawers */}
      <EmergencyRegistrationModal
        open={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
      />

      <TriageAssessmentDrawer
        open={Boolean(triageCase)}
        onClose={() => setTriageCase(null)}
        emergencyCase={triageCase}
      />

      <EmergencyCaseDetailsDrawer
        open={Boolean(detailsCase)}
        onClose={() => setDetailsCase(null)}
        emergencyCase={detailsCase}
        onStartTriage={(c) => setTriageCase(c)}
      />
    </div>
  );
};
