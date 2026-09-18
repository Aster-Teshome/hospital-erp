import {
  ExportOutlined,
  PhoneOutlined,
  SwapOutlined,
} from '@ant-design/icons';
import {
  Alert,
  Button,
  Card,
  Descriptions,
  Divider,
  Drawer,
  Space,
  Typography,
} from 'antd';
import type { Bed, InpatientAdmission } from '../types';
import { InpatientStatusTag, SeverityBadge } from './InpatientStatusTag';

interface InpatientDetailsDrawerProps {
  open: boolean;
  admission?: InpatientAdmission | null;
  bed?: Bed | null;
  onClose: () => void;
  onOpenDischarge: () => void;
  onOpenTransfer: () => void;
}

export function InpatientDetailsDrawer({
  open,
  admission,
  bed,
  onClose,
  onOpenDischarge,
  onOpenTransfer,
}: InpatientDetailsDrawerProps) {
  const patientName = admission?.patientName || bed?.currentPatient?.patientName;
  const patientMrn = admission?.patientMrn || bed?.currentPatient?.patientMrn;
  const wardName = admission?.wardName || bed?.wardName;
  const bedNumber = admission?.bedNumber || bed?.bedNumber;
  const severity = admission?.severity || bed?.currentPatient?.severity || 'stable';
  const attendingDoctor = admission?.attendingDoctor || bed?.currentPatient?.attendingDoctor;
  const admittingDiagnosis =
    admission?.admittingDiagnosis || bed?.currentPatient?.admittingDiagnosis;
  const admissionDate = admission?.admissionDate || bed?.currentPatient?.admissionDate;
  const status = admission?.status || (bed?.status === 'occupied' ? 'admitted' : 'discharged');

  return (
    <Drawer
      title={
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          <div>
            <Typography.Title level={4} style={{ margin: 0, color: '#0f172a' }}>
              Inpatient Medical Record
            </Typography.Title>
            <Typography.Text type="secondary" style={{ fontSize: 12 }}>
              Active Inpatient Admission & Bed Management
            </Typography.Text>
          </div>
          <InpatientStatusTag status={status} />
        </div>
      }
      open={open}
      onClose={onClose}
      width={580}
      styles={{ body: { padding: '20px' } }}
      extra={
        status === 'admitted' && (
          <Space>
            <Button icon={<SwapOutlined />} onClick={onOpenTransfer}>
              Transfer
            </Button>
            <Button type="primary" danger icon={<ExportOutlined />} onClick={onOpenDischarge}>
              Discharge
            </Button>
          </Space>
        )
      }
    >
      {/* Patient Header Card */}
      <Card
        styles={{ body: { padding: '16px' } }}
        style={{
          background: 'linear-gradient(135deg, #f8fafc 0%, #edf2f7 100%)',
          borderRadius: 12,
          border: '1px solid #e2e8f0',
          marginBottom: 20,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <Typography.Title level={4} style={{ margin: 0, color: '#0f172a' }}>
              {patientName}
            </Typography.Title>
            <div style={{ marginTop: 4, color: '#64748b', fontSize: 13 }}>
              MRN: <span style={{ fontFamily: 'monospace', fontWeight: 600, color: '#1e293b' }}>{patientMrn}</span>
              {admission?.gender && ` • ${admission.gender.toUpperCase()}`}
              {admission?.age && ` • ${admission.age} yrs`}
            </div>
          </div>
          <SeverityBadge severity={severity} />
        </div>

        <Divider style={{ margin: '12px 0' }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <span style={{ fontSize: 11, color: '#64748b', display: 'block' }}>LOCATION</span>
            <strong style={{ color: '#2563eb', fontSize: 14 }}>
              {bedNumber} ({wardName})
            </strong>
          </div>
          <div>
            <span style={{ fontSize: 11, color: '#64748b', display: 'block' }}>ADMITTED ON</span>
            <span style={{ fontSize: 13, color: '#334155', fontWeight: 500 }}>{admissionDate}</span>
          </div>
        </div>
      </Card>

      {/* Clinical Details */}
      <Descriptions
        title={<span style={{ fontSize: 14, fontWeight: 700, color: '#1e293b' }}>Clinical Information</span>}
        bordered
        column={1}
        size="small"
        style={{ marginBottom: 20 }}
      >
        <Descriptions.Item label="Attending Physician">
          <Typography.Text strong style={{ color: '#0f172a' }}>
            {attendingDoctor}
          </Typography.Text>
        </Descriptions.Item>
        <Descriptions.Item label="Admitting Diagnosis">
          <span style={{ color: '#0f172a', fontWeight: 500 }}>{admittingDiagnosis}</span>
        </Descriptions.Item>
        {admission?.admissionNotes && (
          <Descriptions.Item label="Admission Clinical Notes">
            <span style={{ color: '#334155' }}>{admission.admissionNotes}</span>
          </Descriptions.Item>
        )}
      </Descriptions>

      {/* Contact Details */}
      {(admission?.emergencyContactName || admission?.emergencyContactPhone) && (
        <Descriptions
          title={<span style={{ fontSize: 14, fontWeight: 700, color: '#1e293b' }}>Emergency Contact</span>}
          bordered
          column={1}
          size="small"
          style={{ marginBottom: 20 }}
        >
          <Descriptions.Item label="Contact Person">
            {admission?.emergencyContactName || 'N/A'}
          </Descriptions.Item>
          <Descriptions.Item label="Phone Number">
            <Space>
              <PhoneOutlined style={{ color: '#10b981' }} />
              <span style={{ fontFamily: 'monospace' }}>{admission?.emergencyContactPhone || 'N/A'}</span>
            </Space>
          </Descriptions.Item>
        </Descriptions>
      )}

      {/* Discharge info if already discharged */}
      {status === 'discharged' && admission?.dischargeDate && (
        <Alert
          type="success"
          showIcon
          message={`Discharged on ${admission.dischargeDate} (${admission.dischargeCondition?.toUpperCase()})`}
          description={
            <div>
              <div style={{ marginTop: 4 }}>
                <strong>Summary:</strong> {admission.dischargeSummary}
              </div>
              {admission.dischargeMedications && (
                <div style={{ marginTop: 4 }}>
                  <strong>Medications:</strong> {admission.dischargeMedications}
                </div>
              )}
              {admission.followUpInstructions && (
                <div style={{ marginTop: 4 }}>
                  <strong>Follow-up:</strong> {admission.followUpInstructions}
                </div>
              )}
            </div>
          }
          style={{ marginBottom: 20 }}
        />
      )}
    </Drawer>
  );
}
