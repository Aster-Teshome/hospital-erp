import { useState } from 'react';
import {
  CheckCircleOutlined,
  ExportOutlined,
  EyeOutlined,
  SearchOutlined,
  SwapOutlined,
  UserAddOutlined,
} from '@ant-design/icons';
import {
  Button,
  Card,
  Col,
  Empty,
  Input,
  Row,
  Select,
  Space,
  Typography,
  message,
} from 'antd';
import { useUpdateBedStatus } from '../hooks/inpatient.hooks';
import type { Bed, BedStatus, BedType } from '../types';
import { BedStatusBadge, BedTypeTag } from './BedStatusBadge';
import { SeverityBadge } from './InpatientStatusTag';

interface BedManagementGridProps {
  beds: Bed[];
  isLoading: boolean;
  onAdmitToBed: (bed: Bed) => void;
  onDischargePatient: (admissionId: string, bed: Bed) => void;
  onTransferPatient: (admissionId: string, bed: Bed) => void;
  onViewDetails: (admissionId: string) => void;
}

export function BedManagementGrid({
  beds,
  isLoading,
  onAdmitToBed,
  onDischargePatient,
  onTransferPatient,
  onViewDetails,
}: BedManagementGridProps) {
  const [statusFilter, setStatusFilter] = useState<BedStatus | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<BedType | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const updateBedStatusMutation = useUpdateBedStatus();

  async function handleMarkClean(bedId: string) {
    try {
      await updateBedStatusMutation.mutateAsync({ bedId, status: 'available' });
      message.success('Bed marked as sanitized and available for admission');
    } catch {
      message.error('Failed to update bed status');
    }
  }

  async function handleMarkServiced(bedId: string) {
    try {
      await updateBedStatusMutation.mutateAsync({ bedId, status: 'available' });
      message.success('Bed maintenance complete; marked as available');
    } catch {
      message.error('Failed to update bed status');
    }
  }

  const filteredBeds = beds.filter((bed) => {
    if (statusFilter !== 'all' && bed.status !== statusFilter) return false;
    if (typeFilter !== 'all' && bed.bedType !== typeFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchBedNum = bed.bedNumber.toLowerCase().includes(q);
      const matchWard = bed.wardName.toLowerCase().includes(q);
      const matchPatient = bed.currentPatient?.patientName.toLowerCase().includes(q);
      const matchMrn = bed.currentPatient?.patientMrn.toLowerCase().includes(q);
      const matchDoctor = bed.currentPatient?.attendingDoctor.toLowerCase().includes(q);
      if (!matchBedNum && !matchWard && !matchPatient && !matchMrn && !matchDoctor) {
        return false;
      }
    }
    return true;
  });

  return (
    <div>
      {/* Filters bar */}
      <div
        style={{
          background: '#ffffff',
          padding: '14px 18px',
          borderRadius: 12,
          border: '1px solid #e2e8f0',
          marginBottom: 16,
          display: 'flex',
          flexWrap: 'wrap',
          gap: 12,
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Space wrap size="middle">
          <Input
            placeholder="Search bed, patient, MRN, physician..."
            prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            allowClear
            style={{ width: 280, borderRadius: 8 }}
          />

          <Select
            value={statusFilter}
            onChange={setStatusFilter}
            style={{ width: 150 }}
            options={[
              { label: 'All Statuses', value: 'all' },
              { label: 'Available', value: 'available' },
              { label: 'Occupied', value: 'occupied' },
              { label: 'Cleaning', value: 'cleaning' },
              { label: 'Maintenance', value: 'maintenance' },
              { label: 'Reserved', value: 'reserved' },
            ]}
          />

          <Select
            value={typeFilter}
            onChange={setTypeFilter}
            style={{ width: 160 }}
            options={[
              { label: 'All Bed Types', value: 'all' },
              { label: 'Standard', value: 'standard' },
              { label: 'ICU / Critical', value: 'icu' },
              { label: 'Isolation', value: 'isolation' },
              { label: 'Pediatric', value: 'pediatric' },
              { label: 'Maternity', value: 'maternity' },
              { label: 'Private / Deluxe', value: 'deluxe' },
            ]}
          />
        </Space>

        <div style={{ color: '#64748b', fontSize: 13, fontWeight: 500 }}>
          Showing <strong style={{ color: '#0f172a' }}>{filteredBeds.length}</strong> of{' '}
          {beds.length} beds
        </div>
      </div>

      {/* Bed Grid Cards */}
      {filteredBeds.length === 0 ? (
        <Card style={{ borderRadius: 12, textAlign: 'center', padding: '32px 0' }}>
          <Empty description="No beds match the selected filters" />
        </Card>
      ) : (
        <Row gutter={[16, 16]}>
          {filteredBeds.map((bed) => {
            const isAvailable = bed.status === 'available';
            const isOccupied = bed.status === 'occupied';
            const isCleaning = bed.status === 'cleaning';
            const isMaintenance = bed.status === 'maintenance';

            const cardBorder = isOccupied
              ? '1px solid #bfdbfe'
              : isAvailable
                ? '1px solid #a7f3d0'
                : isCleaning
                  ? '1px solid #fde68a'
                  : '1px solid #e2e8f0';

            const cardBg = isOccupied
              ? '#ffffff'
              : isAvailable
                ? '#fafffd'
                : isCleaning
                  ? '#fffefb'
                  : '#f8fafc';

            return (
              <Col xs={24} sm={12} md={8} lg={6} key={bed.id}>
                <Card
                  loading={isLoading}
                  styles={{ body: { padding: '16px' } }}
                  style={{
                    borderRadius: 12,
                    border: cardBorder,
                    background: cardBg,
                    boxShadow: isOccupied
                      ? '0 2px 6px rgba(59, 130, 246, 0.06)'
                      : '0 1px 3px rgba(0,0,0,0.04)',
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    {/* Header: Bed Number + Badges */}
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: 10,
                      }}
                    >
                      <Space size={6}>
                        <span
                          style={{
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            fontSize: 16,
                            color: '#0f172a',
                          }}
                        >
                          {bed.bedNumber}
                        </span>
                        <BedTypeTag type={bed.bedType} />
                      </Space>
                      <BedStatusBadge status={bed.status} />
                    </div>

                    <div style={{ fontSize: 12, color: '#64748b', marginBottom: 12 }}>
                      {bed.wardName}
                    </div>

                    {/* Occupied State Information */}
                    {isOccupied && bed.currentPatient && (
                      <div
                        style={{
                          background: '#f8fafc',
                          borderRadius: 8,
                          padding: '10px 12px',
                          border: '1px solid #e2e8f0',
                          marginBottom: 12,
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: 4,
                          }}
                        >
                          <Typography.Text strong style={{ fontSize: 14, color: '#0f172a' }}>
                            {bed.currentPatient.patientName}
                          </Typography.Text>
                          <SeverityBadge severity={bed.currentPatient.severity} />
                        </div>

                        <div style={{ fontSize: 11, color: '#64748b', marginBottom: 6 }}>
                          MRN:{' '}
                          <span style={{ fontFamily: 'monospace', color: '#334155' }}>
                            {bed.currentPatient.patientMrn}
                          </span>
                        </div>

                        <div
                          style={{
                            fontSize: 12,
                            color: '#1e293b',
                            lineHeight: '1.4',
                            marginBottom: 6,
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                          }}
                        >
                          {bed.currentPatient.admittingDiagnosis}
                        </div>

                        <div style={{ fontSize: 11, color: '#475569' }}>
                          Physician: <strong>{bed.currentPatient.attendingDoctor}</strong>
                        </div>
                      </div>
                    )}

                    {/* Available State Content */}
                    {isAvailable && (
                      <div
                        style={{
                          minHeight: 90,
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          alignItems: 'center',
                          border: '1px dashed #cbd5e1',
                          borderRadius: 8,
                          background: '#ffffff',
                          marginBottom: 12,
                          padding: '12px',
                        }}
                      >
                        <CheckCircleOutlined style={{ fontSize: 24, color: '#10b981', marginBottom: 6 }} />
                        <span style={{ fontSize: 12, color: '#059669', fontWeight: 600 }}>
                          Bed Ready for Admission
                        </span>
                        {bed.dailyRate && (
                          <span style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>
                            ETB {bed.dailyRate}/day
                          </span>
                        )}
                      </div>
                    )}

                    {/* Cleaning State Content */}
                    {isCleaning && (
                      <div
                        style={{
                          minHeight: 90,
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          alignItems: 'center',
                          border: '1px dashed #fde68a',
                          borderRadius: 8,
                          background: '#fffbeb',
                          marginBottom: 12,
                          padding: '12px',
                        }}
                      >
                        <span style={{ fontSize: 12, color: '#b45309', fontWeight: 600 }}>
                          Housekeeping / Sanitization in progress
                        </span>
                      </div>
                    )}

                    {/* Maintenance State Content */}
                    {isMaintenance && (
                      <div
                        style={{
                          minHeight: 90,
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          alignItems: 'center',
                          border: '1px dashed #fecaca',
                          borderRadius: 8,
                          background: '#fef2f2',
                          marginBottom: 12,
                          padding: '12px',
                        }}
                      >
                        <span style={{ fontSize: 12, color: '#b91c1c', fontWeight: 600 }}>
                          Equipment maintenance / repair
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Actions Footer */}
                  <div style={{ marginTop: 'auto', paddingTop: 8 }}>
                    {isAvailable && (
                      <Button
                        type="primary"
                        icon={<UserAddOutlined />}
                        block
                        onClick={() => onAdmitToBed(bed)}
                        style={{ background: '#059669', borderColor: '#059669', borderRadius: 6 }}
                      >
                        Admit to Bed
                      </Button>
                    )}

                    {isOccupied && bed.currentPatient && (
                      <Space style={{ width: '100%' }} direction="vertical" size={6}>
                        <Button
                          icon={<EyeOutlined />}
                          block
                          size="small"
                          onClick={() => onViewDetails(bed.currentPatient!.admissionId)}
                          style={{ borderRadius: 6 }}
                        >
                          View Patient Stay
                        </Button>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <Button
                            icon={<SwapOutlined />}
                            size="small"
                            onClick={() => onTransferPatient(bed.currentPatient!.admissionId, bed)}
                            style={{ flex: 1, borderRadius: 6 }}
                          >
                            Transfer
                          </Button>
                          <Button
                            danger
                            icon={<ExportOutlined />}
                            size="small"
                            data-testid="discharge-bed-btn"
                            onClick={() => onDischargePatient(bed.currentPatient!.admissionId, bed)}
                            style={{ flex: 1, borderRadius: 6 }}
                          >
                            Discharge
                          </Button>
                        </div>
                      </Space>
                    )}

                    {isCleaning && (
                      <Button
                        icon={<CheckCircleOutlined />}
                        block
                        size="small"
                        loading={updateBedStatusMutation.isPending}
                        onClick={() => handleMarkClean(bed.id)}
                        style={{
                          background: '#fef3c7',
                          color: '#92400e',
                          borderColor: '#fde68a',
                          borderRadius: 6,
                        }}
                      >
                        Mark Ready / Sanitized
                      </Button>
                    )}

                    {isMaintenance && (
                      <Button
                        icon={<CheckCircleOutlined />}
                        block
                        size="small"
                        loading={updateBedStatusMutation.isPending}
                        onClick={() => handleMarkServiced(bed.id)}
                        style={{
                          background: '#f1f5f9',
                          color: '#334155',
                          borderRadius: 6,
                        }}
                      >
                        Complete Maintenance
                      </Button>
                    )}
                  </div>
                </Card>
              </Col>
            );
          })}
        </Row>
      )}
    </div>
  );
}
