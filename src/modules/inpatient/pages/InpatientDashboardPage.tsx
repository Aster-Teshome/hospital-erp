import { useState } from 'react';
import {
  AppstoreOutlined,
  CheckCircleOutlined,
  ExportOutlined,
  EyeOutlined,
  ReloadOutlined,
  SwapOutlined,
  TableOutlined,
  UserAddOutlined,
} from '@ant-design/icons';
import {
  Button,
  Card,
  Space,
  Table,
  Tabs,
  Tag,
  Typography,
} from 'antd';
import {
  useBeds,
  useInpatientAdmissions,
  useInpatientStats,
  useWards,
} from '../hooks/inpatient.hooks';
import type { Bed, InpatientAdmission } from '../types';
import { AdmissionModal } from '../components/AdmissionModal';
import { BedManagementGrid } from '../components/BedManagementGrid';
import { BedTransferModal } from '../components/BedTransferModal';
import { DischargeModal } from '../components/DischargeModal';
import { InpatientDetailsDrawer } from '../components/InpatientDetailsDrawer';
import { SeverityBadge } from '../components/InpatientStatusTag';
import { WardOverviewCards } from '../components/WardOverviewCards';

export function InpatientDashboardPage() {
  const [selectedWardId, setSelectedWardId] = useState<string | undefined>();
  const [activeTab, setActiveTab] = useState('beds');

  // Modals state
  const [isAdmissionOpen, setIsAdmissionOpen] = useState(false);
  const [preSelectedBed, setPreSelectedBed] = useState<Bed | null>(null);

  const [isDischargeOpen, setIsDischargeOpen] = useState(false);
  const [dischargeTargetAdmission, setDischargeTargetAdmission] =
    useState<InpatientAdmission | null>(null);
  const [dischargeTargetBed, setDischargeTargetBed] = useState<Bed | null>(null);

  const [isTransferOpen, setIsTransferOpen] = useState(false);
  const [transferTargetAdmission, setTransferTargetAdmission] =
    useState<InpatientAdmission | null>(null);
  const [transferTargetBed, setTransferTargetBed] = useState<Bed | null>(null);

  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedAdmission, setSelectedAdmission] = useState<InpatientAdmission | null>(null);
  const [selectedBedForDetails, setSelectedBedForDetails] = useState<Bed | null>(null);

  // Queries
  const { data: wards = [], isLoading: isLoadingWards, refetch: refetchWards } = useWards();
  const {
    data: beds = [],
    isLoading: isLoadingBeds,
    refetch: refetchBeds,
  } = useBeds(selectedWardId);
  const {
    data: admissions = [],
    isLoading: isLoadingAdmissions,
    refetch: refetchAdmissions,
  } = useInpatientAdmissions(selectedWardId ? { wardId: selectedWardId } : undefined);
  const {
    data: stats,
    isLoading: isLoadingStats,
    refetch: refetchStats,
  } = useInpatientStats();

  function handleRefreshAll() {
    refetchWards();
    refetchBeds();
    refetchAdmissions();
    refetchStats();
  }

  function handleAdmitToBed(bed: Bed) {
    setPreSelectedBed(bed);
    setIsAdmissionOpen(true);
  }

  function handleOpenDischargeFromBed(admissionId: string, bed: Bed) {
    const admission = admissions.find((a) => a.id === admissionId) || null;
    setDischargeTargetAdmission(admission);
    setDischargeTargetBed(bed);
    setIsDischargeOpen(true);
  }

  function handleOpenDischargeFromRoster(admission: InpatientAdmission) {
    setDischargeTargetAdmission(admission);
    const bed = beds.find((b) => b.id === admission.bedId) || null;
    setDischargeTargetBed(bed);
    setIsDischargeOpen(true);
  }

  function handleOpenTransferFromBed(admissionId: string, bed: Bed) {
    const admission = admissions.find((a) => a.id === admissionId) || null;
    setTransferTargetAdmission(admission);
    setTransferTargetBed(bed);
    setIsTransferOpen(true);
  }

  function handleOpenTransferFromRoster(admission: InpatientAdmission) {
    setTransferTargetAdmission(admission);
    const bed = beds.find((b) => b.id === admission.bedId) || null;
    setTransferTargetBed(bed);
    setIsTransferOpen(true);
  }

  function handleViewDetails(admissionId: string) {
    const admission = admissions.find((a) => a.id === admissionId) || null;
    const bed = beds.find((b) => b.currentPatient?.admissionId === admissionId) || null;
    setSelectedAdmission(admission);
    setSelectedBedForDetails(bed);
    setIsDetailsOpen(true);
  }

  const activeAdmissions = admissions.filter((a) => a.status === 'admitted');
  const dischargedAdmissions = admissions.filter((a) => a.status === 'discharged');

  const rosterColumns = [
    {
      title: 'Patient',
      key: 'patient',
      width: 240,
      render: (_: unknown, record: InpatientAdmission) => (
        <div style={{ minWidth: 0, overflow: 'hidden' }}>
          <Typography.Text
            strong
            style={{
              color: '#0f172a',
              fontSize: 14,
              display: 'block',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {record.patientName}
          </Typography.Text>
          <div style={{ fontSize: 12, color: '#64748b', whiteSpace: 'nowrap' }}>
            MRN: <span style={{ fontFamily: 'monospace', color: '#1e293b' }}>{record.patientMrn}</span>
            {` • ${record.gender.toUpperCase()} • ${record.age} yrs`}
          </div>
        </div>
      ),
    },
    {
      title: 'Ward & Bed',
      key: 'wardBed',
      width: 150,
      render: (_: unknown, record: InpatientAdmission) => (
        <div style={{ whiteSpace: 'nowrap' }}>
          <Typography.Text strong style={{ color: '#2563eb' }}>
            {record.bedNumber}
          </Typography.Text>
          <div style={{ fontSize: 11, color: '#64748b' }}>{record.wardName}</div>
        </div>
      ),
    },
    {
      title: 'Severity',
      dataIndex: 'severity',
      key: 'severity',
      width: 130,
      render: (severity: InpatientAdmission['severity']) => (
        <SeverityBadge severity={severity} />
      ),
    },
    {
      title: 'Admitting Diagnosis',
      dataIndex: 'admittingDiagnosis',
      key: 'admittingDiagnosis',
      width: 260,
      ellipsis: true,
      render: (diag: string) => (
        <span
          style={{
            fontSize: 13,
            color: '#334155',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: 'block',
          }}
          title={diag}
        >
          {diag}
        </span>
      ),
    },
    {
      title: 'Attending Physician',
      dataIndex: 'attendingDoctor',
      key: 'attendingDoctor',
      width: 180,
      ellipsis: true,
      render: (doc: string) => (
        <span
          style={{
            fontWeight: 500,
            fontSize: 13,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: 'block',
          }}
          title={doc}
        >
          {doc}
        </span>
      ),
    },
    {
      title: 'Admitted At',
      dataIndex: 'admissionDate',
      key: 'admissionDate',
      width: 140,
      render: (date: string) => (
        <span style={{ fontSize: 12, color: '#64748b', whiteSpace: 'nowrap' }}>{date}</span>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 220,
      fixed: 'right' as const,
      render: (_: unknown, record: InpatientAdmission) => (
        <Space size="small" style={{ whiteSpace: 'nowrap' }}>
          <Button
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handleViewDetails(record.id)}
          >
            Stay
          </Button>
          <Button
            size="small"
            icon={<SwapOutlined />}
            onClick={() => handleOpenTransferFromRoster(record)}
          >
            Transfer
          </Button>
          <Button
            size="small"
            danger
            icon={<ExportOutlined />}
            onClick={() => handleOpenDischargeFromRoster(record)}
          >
            Discharge
          </Button>
        </Space>
      ),
    },
  ];

  const dischargeColumns = [
    {
      title: 'Patient',
      key: 'patient',
      width: 240,
      render: (_: unknown, record: InpatientAdmission) => (
        <div style={{ minWidth: 0, overflow: 'hidden' }}>
          <Typography.Text
            strong
            style={{
              display: 'block',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {record.patientName}
          </Typography.Text>
          <div style={{ fontSize: 12, color: '#64748b', whiteSpace: 'nowrap' }}>
            MRN: {record.patientMrn}
          </div>
        </div>
      ),
    },
    {
      title: 'Discharged From',
      key: 'wardBed',
      width: 180,
      render: (_: unknown, record: InpatientAdmission) => (
        <span style={{ whiteSpace: 'nowrap' }}>
          {record.bedNumber} ({record.wardName})
        </span>
      ),
    },
    {
      title: 'Discharge Date',
      dataIndex: 'dischargeDate',
      key: 'dischargeDate',
      width: 150,
      render: (date: string) => (
        <span style={{ fontSize: 12, whiteSpace: 'nowrap' }}>{date || 'N/A'}</span>
      ),
    },
    {
      title: 'Condition',
      dataIndex: 'dischargeCondition',
      key: 'dischargeCondition',
      width: 140,
      render: (cond?: string) => (
        <Tag color="green" style={{ textTransform: 'uppercase', fontWeight: 600, whiteSpace: 'nowrap' }}>
          {cond || 'Recovered'}
        </Tag>
      ),
    },
    {
      title: 'Discharge Summary',
      dataIndex: 'dischargeSummary',
      key: 'dischargeSummary',
      width: 280,
      ellipsis: true,
      render: (summary?: string) => (
        <span
          style={{
            fontSize: 12,
            color: '#475569',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: 'block',
          }}
          title={summary || 'N/A'}
        >
          {summary || 'N/A'}
        </span>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 130,
      fixed: 'right' as const,
      render: (_: unknown, record: InpatientAdmission) => (
        <Button
          size="small"
          icon={<EyeOutlined />}
          onClick={() => handleViewDetails(record.id)}
          style={{ whiteSpace: 'nowrap' }}
        >
          View Record
        </Button>
      ),
    },
  ];

  return (
    <div style={{ padding: '0 4px', maxWidth: 1600, margin: '0 auto' }}>
      {/* Top Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 12,
          marginBottom: 20,
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Typography.Title level={3} style={{ margin: 0, color: '#0f172a' }}>
              Inpatient (IPD) & Ward Management
            </Typography.Title>
            <Tag color="blue" style={{ borderRadius: 6, fontWeight: 700 }}>
              LIVE BEDS
            </Tag>
          </div>
          <Typography.Text type="secondary" style={{ fontSize: 13 }}>
            Hospital ward occupancy, real-time bed management, admissions & discharge workflows
          </Typography.Text>
        </div>

        <Space wrap>
          <Button
            icon={<ReloadOutlined />}
            onClick={handleRefreshAll}
            loading={isLoadingWards || isLoadingBeds || isLoadingStats}
          >
            Refresh Data
          </Button>

          <Button
            type="primary"
            icon={<UserAddOutlined />}
            size="large"
            data-testid="admit-patient-btn"
            onClick={() => {
              setPreSelectedBed(null);
              setIsAdmissionOpen(true);
            }}
            style={{ background: '#2563eb', borderColor: '#2563eb', borderRadius: 8 }}
          >
            Admit Patient
          </Button>
        </Space>
      </div>

      {/* Ward Overview & KPI Cards (Ward Dashboard task) */}
      <WardOverviewCards
        wards={wards}
        stats={stats}
        selectedWardId={selectedWardId}
        onSelectWard={(wId) => setSelectedWardId(wId)}
      />

      {/* Main Content Tabs */}
      <Card
        styles={{ body: { padding: '16px 20px' } }}
        style={{ borderRadius: 12, border: '1px solid #e2e8f0', background: '#ffffff' }}
      >
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          tabBarExtraContent={
            selectedWardId && (
              <Tag
                closable
                onClose={() => setSelectedWardId(undefined)}
                color="blue"
                style={{ padding: '4px 10px', borderRadius: 6, fontSize: 12 }}
              >
                Filtered by Ward: {wards.find((w) => w.id === selectedWardId)?.name}
              </Tag>
            )
          }
          items={[
            {
              key: 'beds',
              label: (
                <span style={{ fontSize: 14, fontWeight: 600 }}>
                  <AppstoreOutlined style={{ marginRight: 6 }} />
                  Bed Management Grid ({beds.length})
                </span>
              ),
              children: (
                <BedManagementGrid
                  beds={beds}
                  isLoading={isLoadingBeds}
                  onAdmitToBed={handleAdmitToBed}
                  onDischargePatient={handleOpenDischargeFromBed}
                  onTransferPatient={handleOpenTransferFromBed}
                  onViewDetails={handleViewDetails}
                />
              ),
            },
            {
              key: 'roster',
              label: (
                <span style={{ fontSize: 14, fontWeight: 600 }}>
                  <TableOutlined style={{ marginRight: 6 }} />
                  Active Inpatient Roster ({activeAdmissions.length})
                </span>
              ),
              children: (
                <Table
                  dataSource={activeAdmissions}
                  columns={rosterColumns}
                  rowKey="id"
                  loading={isLoadingAdmissions}
                  pagination={{ pageSize: 8 }}
                  scroll={{ x: 1200 }}
                  style={{ marginTop: 8 }}
                />
              ),
            },
            {
              key: 'discharges',
              label: (
                <span style={{ fontSize: 14, fontWeight: 600 }}>
                  <CheckCircleOutlined style={{ marginRight: 6 }} />
                  Discharged Patients ({dischargedAdmissions.length})
                </span>
              ),
              children: (
                <Table
                  dataSource={dischargedAdmissions}
                  columns={dischargeColumns}
                  rowKey="id"
                  loading={isLoadingAdmissions}
                  pagination={{ pageSize: 8 }}
                  scroll={{ x: 1050 }}
                  style={{ marginTop: 8 }}
                />
              ),
            },
          ]}
        />
      </Card>

      {/* Modals & Drawers */}
      <AdmissionModal
        open={isAdmissionOpen}
        preSelectedBed={preSelectedBed}
        onClose={() => {
          setIsAdmissionOpen(false);
          setPreSelectedBed(null);
        }}
      />

      <DischargeModal
        open={isDischargeOpen}
        admission={dischargeTargetAdmission}
        bed={dischargeTargetBed}
        onClose={() => {
          setIsDischargeOpen(false);
          setDischargeTargetAdmission(null);
          setDischargeTargetBed(null);
        }}
      />

      <BedTransferModal
        open={isTransferOpen}
        admission={transferTargetAdmission}
        bed={transferTargetBed}
        onClose={() => {
          setIsTransferOpen(false);
          setTransferTargetAdmission(null);
          setTransferTargetBed(null);
        }}
      />

      <InpatientDetailsDrawer
        open={isDetailsOpen}
        admission={selectedAdmission}
        bed={selectedBedForDetails}
        onClose={() => {
          setIsDetailsOpen(false);
          setSelectedAdmission(null);
          setSelectedBedForDetails(null);
        }}
        onOpenDischarge={() => {
          if (selectedAdmission) {
            handleOpenDischargeFromRoster(selectedAdmission);
          } else if (selectedBedForDetails) {
            handleOpenDischargeFromBed(
              selectedBedForDetails.currentPatient!.admissionId,
              selectedBedForDetails,
            );
          }
        }}
        onOpenTransfer={() => {
          if (selectedAdmission) {
            handleOpenTransferFromRoster(selectedAdmission);
          } else if (selectedBedForDetails) {
            handleOpenTransferFromBed(
              selectedBedForDetails.currentPatient!.admissionId,
              selectedBedForDetails,
            );
          }
        }}
      />
    </div>
  );
}
