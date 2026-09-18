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
                  className="hover-lift"
                  styles={{ body: { padding: '16px' } }}
                  style={{
                    borderRadius: 14,
                    border: cardBorder,
                    background: cardBg,
                    boxShadow: isOccupied
                      ? '0 4px 12px rgba(37, 99, 235, 0.06)'
                      : isAvailable
                        ? '0 4px 12px rgba(16, 185, 129, 0.05)'
                        : '0 2px 6px rgba(0,0,0,0.03)',
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                    justifyContent: 'space-between',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  {/* Top Status Accent Bar */}
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: 4,
                      background: isOccupied
                        ? '#2563eb'
                        : isAvailable
                          ? '#10b981'
                          : isCleaning
                            ? '#f59e0b'
                            : '#ef4444',
                    }}
                  />

                  <div>
                    {/* Header: Bed Number + Badges */}
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: 10,
                        marginTop: 2,
                      }}
                    >
                      <Space size={6} align="center">
                        <span
                          className="clinical-mono"
                          style={{
                            fontWeight: 800,
                            fontSize: 16,
                            color: '#0f172a',
                            letterSpacing: '-0.02em',
                          }}
                        >
                          {bed.bedNumber}
                        </span>
                        <BedTypeTag type={bed.bedType} />
                      </Space>
                      <BedStatusBadge status={bed.status} />
                    </div>

                    <div style={{ fontSize: 12, color: '#64748b', fontWeight: 500, marginBottom: 12 }}>
                      {bed.wardName}
                    </div>

                    {/* Occupied State Information */}
                    {isOccupied && bed.currentPatient && (
                      <div
                        style={{
                          background: '#f8fafc',
                          borderRadius: 10,
                          padding: '12px',
                          border: '1px solid #e2e8f0',
                          marginBottom: 12,
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: 6,
                          }}
                        >
                          <Typography.Text strong style={{ fontSize: 14, color: '#0f172a' }}>
                            {bed.currentPatient.patientName}
                          </Typography.Text>
                          <SeverityBadge severity={bed.currentPatient.severity} />
                        </div>

                        <div style={{ fontSize: 11, color: '#64748b', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span>MRN:</span>
                          <span
                            className="clinical-mono"
                            style={{
                              padding: '1px 5px',
                              background: '#ffffff',
                              border: '1px solid #cbd5e1',
                              borderRadius: 4,
                              color: '#0f172a',
                              fontWeight: 600,
                            }}
                          >
                            {bed.currentPatient.patientMrn}
                          </span>
                        </div>

                        <div
                          style={{
                            fontSize: 12,
                            color: '#334155',
                            lineHeight: '1.45',
                            marginBottom: 8,
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                          }}
                        >
                          {bed.currentPatient.admittingDiagnosis}
                        </div>

                        <div style={{ fontSize: 11, color: '#64748b', paddingTop: 6, borderTop: '1px solid #edf2f7' }}>
                          Physician: <strong style={{ color: '#1e293b' }}>{bed.currentPatient.attendingDoctor}</strong>
                        </div>
                      </div>
                    )}

                    {/* Available State Content */}
                    {isAvailable && (
                      <div
                        style={{
                          minHeight: 100,
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          alignItems: 'center',
                          border: '1px dashed #a7f3d0',
                          borderRadius: 10,
                          background: 'linear-gradient(180deg, #ffffff 0%, #f0fdf4 100%)',
                          marginBottom: 12,
                          padding: '14px',
                        }}
                      >
                        <CheckCircleOutlined style={{ fontSize: 26, color: '#10b981', marginBottom: 6 }} />
                        <span style={{ fontSize: 13, color: '#047857', fontWeight: 700 }}>
                          Bed Ready for Admission
                        </span>
                        {bed.dailyRate && (
                          <span style={{ fontSize: 11, color: '#64748b', marginTop: 3 }}>
                            Rate: ETB {bed.dailyRate}/day
                          </span>
                        )}
                      </div>
                    )}

                    {/* Cleaning State Content */}
                    {isCleaning && (
                      <div
                        style={{
                          minHeight: 100,
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          alignItems: 'center',
                          border: '1px dashed #fde68a',
                          borderRadius: 10,
                          background: '#fffbeb',
                          marginBottom: 12,
                          padding: '14px',
                        }}
                      >
                        <span style={{ fontSize: 12, color: '#b45309', fontWeight: 700, textAlign: 'center' }}>
                          🧹 Housekeeping & Sanitization In Progress
                        </span>
                      </div>
                    )}

                    {/* Maintenance State Content */}
                    {isMaintenance && (
                      <div
                        style={{
                          minHeight: 100,
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          alignItems: 'center',
                          border: '1px dashed #fecaca',
                          borderRadius: 10,
                          background: '#fef2f2',
                          marginBottom: 12,
                          padding: '14px',
                        }}
                      >
                        <span style={{ fontSize: 12, color: '#b91c1c', fontWeight: 700, textAlign: 'center' }}>
                          ⚠️ Equipment Maintenance Required
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
                        style={{
                          background: '#10b981',
                          borderColor: '#10b981',
                          borderRadius: 8,
                          fontWeight: 700,
                          boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)',
                        }}
                      >
                        Admit to Bed
                      </Button>
                    )}

                    {isOccupied && bed.currentPatient && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%' }}>
                        <Button
                          icon={<EyeOutlined />}
                          block
                          size="small"
                          onClick={() => onViewDetails(bed.currentPatient!.admissionId)}
                          style={{ borderRadius: 7, fontWeight: 500 }}
                        >
                          View Patient Stay
                        </Button>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <Button
                            icon={<SwapOutlined />}
                            size="small"
                            onClick={() => onTransferPatient(bed.currentPatient!.admissionId, bed)}
                            style={{ flex: 1, borderRadius: 7, fontWeight: 500 }}
                          >
                            Transfer
                          </Button>
                          <Button
                            danger
                            icon={<ExportOutlined />}
                            size="small"
                            data-testid="discharge-bed-btn"
                            onClick={() => onDischargePatient(bed.currentPatient!.admissionId, bed)}
                            style={{ flex: 1, borderRadius: 7, fontWeight: 600 }}
                          >
                            Discharge
                          </Button>
                        </div>
                      </div>
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
                          borderRadius: 7,
                          fontWeight: 600,
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
                          borderRadius: 7,
                          fontWeight: 600,
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
