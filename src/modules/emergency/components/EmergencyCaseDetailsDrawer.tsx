import React from 'react';
import {
  Alert,
  Button,
  Card,
  Col,
  Descriptions,
  Divider,
  Drawer,
  Form,
  Input,
  Row,
  Select,
  Space,
  Statistic,
  Typography,
  message,
} from 'antd';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  emergencyDispositionSchema,
  type EmergencyDispositionInput,
} from '../emergency.validation';
import { useUpdateEmergencyDisposition } from '../hooks/emergency.hooks';
import { TriageBadge } from './TriageBadge';
import { EmergencyStatusTag } from './EmergencyStatusTag';
import { extractErrorMessage } from '../../../utils/extractErrorMessage';
import type { EmergencyCase } from '../types';

interface EmergencyCaseDetailsDrawerProps {
  open: boolean;
  onClose: () => void;
  emergencyCase: EmergencyCase | null;
  onStartTriage?: (emergencyCase: EmergencyCase) => void;
}

export const EmergencyCaseDetailsDrawer: React.FC<EmergencyCaseDetailsDrawerProps> = ({
  open,
  onClose,
  emergencyCase,
  onStartTriage,
}) => {
  const updateDispositionMutation = useUpdateEmergencyDisposition();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EmergencyDispositionInput>({
    resolver: zodResolver(emergencyDispositionSchema),
    defaultValues: {
      status: emergencyCase?.status === 'registered' ? 'in_treatment' : (emergencyCase?.status as any) || 'in_treatment',
      clinicalSummary: emergencyCase?.clinicalSummary || '',
      dispositionOutcome: emergencyCase?.dispositionOutcome || '',
    },
  });

  React.useEffect(() => {
    if (emergencyCase) {
      reset({
        status: (emergencyCase.status as any) || 'in_treatment',
        clinicalSummary: emergencyCase.clinicalSummary || '',
        dispositionOutcome: emergencyCase.dispositionOutcome || '',
      });
    }
  }, [emergencyCase, reset]);

  const onUpdateDisposition = async (data: EmergencyDispositionInput) => {
    if (!emergencyCase) return;
    try {
      await updateDispositionMutation.mutateAsync({
        caseId: emergencyCase.id,
        input: data,
      });
      message.success('Emergency disposition updated successfully');
      onClose();
    } catch (err) {
      message.error(extractErrorMessage(err));
    }
  };

  if (!emergencyCase) return null;

  return (
    <Drawer
      title={
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', paddingRight: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 18 }}>🚨</span>
            <div>
              <Typography.Title level={4} style={{ margin: 0, fontSize: 17 }}>
                {emergencyCase.patientName}
              </Typography.Title>
              <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                MRN: <span style={{ fontFamily: 'monospace' }}>{emergencyCase.patientMrn}</span> | Arrival: {emergencyCase.arrivalTime}
              </Typography.Text>
            </div>
          </div>
          <Space>
            <TriageBadge category={emergencyCase.triageCategory} />
            <EmergencyStatusTag status={emergencyCase.status} />
          </Space>
        </div>
      }
      width={780}
      open={open}
      onClose={onClose}
      destroyOnClose
    >
      <Descriptions bordered size="small" column={{ xs: 1, sm: 2 }}>
        <Descriptions.Item label="Age & Gender">
          {emergencyCase.age ? `${emergencyCase.age} yrs` : 'Unknown'}, {emergencyCase.gender}
        </Descriptions.Item>
        <Descriptions.Item label="Arrival Mode">
          <strong style={{ textTransform: 'uppercase' }}>{emergencyCase.arrivalMode}</strong>
        </Descriptions.Item>
        <Descriptions.Item label="Allocated Bay">
          <strong style={{ color: '#0284c7' }}>{emergencyCase.assignedBay || 'Unassigned'}</strong>
        </Descriptions.Item>
        <Descriptions.Item label="Assigned Doctor">
          {emergencyCase.assignedDoctorName || 'Pending Assignment'}
        </Descriptions.Item>
        <Descriptions.Item span={2} label="Accompanied By">
          {emergencyCase.accompaniedBy || 'Unaccompanied'} (Phone: {emergencyCase.contactPhone || 'N/A'})
        </Descriptions.Item>
        <Descriptions.Item span={2} label="Chief Complaint">
          <span style={{ color: '#b91c1c', fontWeight: 600 }}>{emergencyCase.chiefComplaint}</span>
        </Descriptions.Item>
      </Descriptions>

      {/* Emergency Vitals Card */}
      <Card
        size="small"
        title="Emergency Vital Signs & Acuity"
        style={{ marginTop: 16, background: '#f8fafc' }}
        extra={
          emergencyCase.status === 'registered' && onStartTriage ? (
            <Button
              type="primary"
              size="small"
              onClick={() => {
                onClose();
                onStartTriage(emergencyCase);
              }}
            >
              Perform Triage Now
            </Button>
          ) : null
        }
      >
        {emergencyCase.vitals ? (
          <Row gutter={[12, 12]}>
            <Col span={6}>
              <Statistic
                title="Blood Pressure"
                value={
                  emergencyCase.vitals.bloodPressureSystolic && emergencyCase.vitals.bloodPressureDiastolic
                    ? `${emergencyCase.vitals.bloodPressureSystolic}/${emergencyCase.vitals.bloodPressureDiastolic}`
                    : 'N/A'
                }
                suffix="mmHg"
                valueStyle={{ fontSize: 16, fontWeight: 700, color: '#0f172a' }}
              />
            </Col>
            <Col span={6}>
              <Statistic
                title="Heart Rate"
                value={emergencyCase.vitals.heartRate ?? 'N/A'}
                suffix="bpm"
                valueStyle={{
                  fontSize: 16,
                  fontWeight: 700,
                  color: (emergencyCase.vitals.heartRate ?? 0) > 100 ? '#ef4444' : '#0f172a',
                }}
              />
            </Col>
            <Col span={6}>
              <Statistic
                title="SpO2 Saturation"
                value={emergencyCase.vitals.spO2 ?? 'N/A'}
                suffix="%"
                valueStyle={{
                  fontSize: 16,
                  fontWeight: 700,
                  color: (emergencyCase.vitals.spO2 ?? 100) < 94 ? '#ef4444' : '#10b981',
                }}
              />
            </Col>
            <Col span={6}>
              <Statistic
                title="Temperature"
                value={emergencyCase.vitals.temperature ?? 'N/A'}
                suffix="°C"
                valueStyle={{ fontSize: 16, fontWeight: 700, color: '#0f172a' }}
              />
            </Col>
            <Col span={6}>
              <Statistic
                title="Resp Rate"
                value={emergencyCase.vitals.respiratoryRate ?? 'N/A'}
                suffix="/min"
                valueStyle={{ fontSize: 16, fontWeight: 700 }}
              />
            </Col>
            <Col span={6}>
              <Statistic
                title="GCS Neuro"
                value={emergencyCase.vitals.gcs ? `${emergencyCase.vitals.gcs}/15` : 'N/A'}
                valueStyle={{
                  fontSize: 16,
                  fontWeight: 700,
                  color: (emergencyCase.vitals.gcs ?? 15) < 13 ? '#ef4444' : '#0f172a',
                }}
              />
            </Col>
            <Col span={6}>
              <Statistic
                title="Pain Score"
                value={emergencyCase.vitals.painScore ? `${emergencyCase.vitals.painScore}/10` : '0/10'}
                valueStyle={{ fontSize: 16, fontWeight: 700 }}
              />
            </Col>
            <Col span={6}>
              <Statistic
                title="Blood Glucose"
                value={emergencyCase.vitals.bloodGlucose ?? 'N/A'}
                suffix="mg/dL"
                valueStyle={{ fontSize: 16, fontWeight: 700 }}
              />
            </Col>
          </Row>
        ) : (
          <Alert
            type="warning"
            message="No vitals recorded yet. Patient requires prompt triage triage assessment."
            showIcon
          />
        )}

        {emergencyCase.triageNotes && (
          <div style={{ marginTop: 12, borderTop: '1px solid #e2e8f0', paddingTop: 8 }}>
            <Typography.Text type="secondary" style={{ fontSize: 12 }}>
              Triage Nurse Notes ({emergencyCase.triageNurse} at {emergencyCase.triageTime}):
            </Typography.Text>
            <div style={{ color: '#1e293b', fontSize: 13, marginTop: 2 }}>
              {emergencyCase.triageNotes}
            </div>
          </div>
        )}

        {emergencyCase.immediateInterventions && (
          <div style={{ marginTop: 8 }}>
            <Typography.Text type="secondary" style={{ fontSize: 12 }}>
              Immediate Interventions Performed:
            </Typography.Text>
            <div style={{ color: '#0369a1', fontSize: 13, fontWeight: 500, marginTop: 2 }}>
              {emergencyCase.immediateInterventions}
            </div>
          </div>
        )}
      </Card>

      <Divider style={{ margin: '20px 0' }} />

      {/* Clinical Disposition & Outcome Form */}
      <div>
        <Typography.Title level={5} style={{ fontSize: 15, marginBottom: 12 }}>
          Update Case Status & Clinical Disposition
        </Typography.Title>

        <form onSubmit={handleSubmit(onUpdateDisposition)}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label={<span style={{ fontWeight: 600 }}>Emergency Disposition Status</span>}
                validateStatus={errors.status ? 'error' : ''}
                help={errors.status?.message}
                required
              >
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      size="large"
                      options={[
                        { label: '🟣 In Active Treatment Bay', value: 'in_treatment' },
                        { label: '🟢 Admitted to Inpatient Ward / ICU', value: 'admitted' },
                        { label: '⚪ Discharged Home (Stabilized)', value: 'discharged' },
                        { label: '🟠 Transferred to Tertiary Hospital', value: 'transferred' },
                      ]}
                    />
                  )}
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item label={<span style={{ fontWeight: 600 }}>Outcome / Destination Details</span>}>
                <Controller
                  name="dispositionOutcome"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      size="large"
                      placeholder="e.g. Transferred to ICU Bed 4 or Discharged with Rx"
                    />
                  )}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label={<span style={{ fontWeight: 600 }}>Clinical Treatment Summary</span>}
            validateStatus={errors.clinicalSummary ? 'error' : ''}
            help={errors.clinicalSummary?.message}
            required
          >
            <Controller
              name="clinicalSummary"
              control={control}
              render={({ field }) => (
                <Input.TextArea
                  {...field}
                  rows={3}
                  placeholder="Summary of emergency interventions, response to therapy, lab/imaging results..."
                />
              )}
            />
          </Form.Item>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
            <Button onClick={onClose}>Close</Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={updateDispositionMutation.isPending}
              style={{ fontWeight: 600 }}
            >
              Save Disposition
            </Button>
          </div>
        </form>
      </div>
    </Drawer>
  );
};
