import React, { useEffect } from 'react';
import {
  Alert,
  Button,
  Card,
  Col,
  Descriptions,
  Drawer,
  Form,
  Input,
  InputNumber,
  Radio,
  Row,
  Select,
  Space,
  Typography,
  message,
} from 'antd';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { triageAssessmentSchema, type TriageAssessmentInput } from '../emergency.validation';
import { useSubmitTriage } from '../hooks/emergency.hooks';
import { extractErrorMessage } from '../../../utils/extractErrorMessage';
import type { EmergencyCase } from '../types';

interface TriageAssessmentDrawerProps {
  open: boolean;
  onClose: () => void;
  emergencyCase: EmergencyCase | null;
}

export const TriageAssessmentDrawer: React.FC<TriageAssessmentDrawerProps> = ({
  open,
  onClose,
  emergencyCase,
}) => {
  const triageMutation = useSubmitTriage();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TriageAssessmentInput>({
    resolver: zodResolver(triageAssessmentSchema),
    defaultValues: {
      triageCategory: 'urgent',
      assignedBay: 'Acute Bay 1',
      assignedDoctor: 'doc-1',
      temperature: undefined,
      bloodPressureSystolic: undefined,
      bloodPressureDiastolic: undefined,
      heartRate: undefined,
      respiratoryRate: undefined,
      spO2: undefined,
      gcs: 15,
      painScore: 0,
      bloodGlucose: undefined,
      triageNotes: '',
      immediateInterventions: '',
    },
  });

  useEffect(() => {
    if (emergencyCase) {
      reset({
        triageCategory: emergencyCase.triageCategory || 'urgent',
        assignedBay: emergencyCase.assignedBay || 'Acute Bay 1',
        assignedDoctor: emergencyCase.assignedDoctor || 'doc-1',
        temperature: emergencyCase.vitals?.temperature,
        bloodPressureSystolic: emergencyCase.vitals?.bloodPressureSystolic,
        bloodPressureDiastolic: emergencyCase.vitals?.bloodPressureDiastolic,
        heartRate: emergencyCase.vitals?.heartRate,
        respiratoryRate: emergencyCase.vitals?.respiratoryRate,
        spO2: emergencyCase.vitals?.spO2,
        gcs: emergencyCase.vitals?.gcs ?? 15,
        painScore: emergencyCase.vitals?.painScore ?? 0,
        bloodGlucose: emergencyCase.vitals?.bloodGlucose,
        triageNotes: emergencyCase.triageNotes || '',
        immediateInterventions: emergencyCase.immediateInterventions || '',
      });
    }
  }, [emergencyCase, reset]);

  const onSubmit = async (data: TriageAssessmentInput) => {
    if (!emergencyCase) return;
    try {
      await triageMutation.mutateAsync({
        caseId: emergencyCase.id,
        input: data,
      });
      message.success('Triage assessment submitted successfully');
      onClose();
    } catch (err) {
      message.error(extractErrorMessage(err));
    }
  };

  return (
    <Drawer
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span
            style={{
              width: 12,
              height: 12,
              borderRadius: '50%',
              backgroundColor: '#f59e0b',
              display: 'inline-block',
            }}
          />
          <div>
            <Typography.Title level={4} style={{ margin: 0, fontSize: 17 }}>
              Emergency Triage & Acuity Scoring
            </Typography.Title>
            <Typography.Text type="secondary" style={{ fontSize: 12 }}>
              Assess vital signs, assign triage priority, and allocate emergency treatment bay
            </Typography.Text>
          </div>
        </div>
      }
      width={720}
      open={open}
      onClose={onClose}
      destroyOnClose
      extra={
        <Space>
          <Button onClick={onClose}>Cancel</Button>
          <Button
            type="primary"
            onClick={handleSubmit(onSubmit)}
            loading={triageMutation.isPending}
            style={{ fontWeight: 600, background: '#0284c7' }}
          >
            Save Triage & Allocate Bay
          </Button>
        </Space>
      }
    >
      {emergencyCase && (
        <Card
          size="small"
          style={{
            marginBottom: 20,
            background: '#f8fafc',
            borderColor: '#e2e8f0',
          }}
        >
          <Descriptions size="small" column={{ xs: 1, sm: 2, md: 3 }}>
            <Descriptions.Item label={<strong style={{ color: '#475569' }}>Patient</strong>}>
              <span style={{ fontWeight: 600, color: '#0f172a' }}>
                {emergencyCase.patientName}
              </span>
            </Descriptions.Item>
            <Descriptions.Item label={<strong style={{ color: '#475569' }}>MRN</strong>}>
              <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>
                {emergencyCase.patientMrn}
              </span>
            </Descriptions.Item>
            <Descriptions.Item label={<strong style={{ color: '#475569' }}>Age / Gender</strong>}>
              {emergencyCase.age ? `${emergencyCase.age} yrs` : 'Unknown'}, {emergencyCase.gender}
            </Descriptions.Item>
            <Descriptions.Item label={<strong style={{ color: '#475569' }}>Arrival</strong>}>
              {emergencyCase.arrivalTime} ({emergencyCase.arrivalMode.toUpperCase()})
            </Descriptions.Item>
            <Descriptions.Item
              span={2}
              label={<strong style={{ color: '#475569' }}>Chief Complaint</strong>}
            >
              <span style={{ color: '#b91c1c', fontWeight: 500 }}>
                {emergencyCase.chiefComplaint}
              </span>
            </Descriptions.Item>
          </Descriptions>
        </Card>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        {triageMutation.isError && (
          <Alert
            type="error"
            message={extractErrorMessage(triageMutation.error)}
            showIcon
            style={{ marginBottom: 16 }}
          />
        )}

        <div style={{ marginBottom: 20 }}>
          <Typography.Title level={5} style={{ fontSize: 14, color: '#0f172a', marginBottom: 8 }}>
            1. Triage Acuity Category (MTS / ESI Standard)
          </Typography.Title>
          <Controller
            name="triageCategory"
            control={control}
            render={({ field }) => (
              <Radio.Group
                {...field}
                style={{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%' }}
              >
                <Radio
                  value="immediate"
                  style={{
                    padding: '10px 14px',
                    borderRadius: 8,
                    border: '1px solid #fecaca',
                    background: field.value === 'immediate' ? '#fee2e2' : '#ffffff',
                  }}
                >
                  <strong style={{ color: '#b91c1c' }}>Priority 1 - Immediate / Resuscitation (Red)</strong>
                  <div style={{ fontSize: 12, color: '#991b1b', marginLeft: 24 }}>
                    Immediate life-threat (cardiac arrest, severe airway compromise, profound shock)
                  </div>
                </Radio>
                <Radio
                  value="very_urgent"
                  style={{
                    padding: '10px 14px',
                    borderRadius: 8,
                    border: '1px solid #fed7aa',
                    background: field.value === 'very_urgent' ? '#ffedd5' : '#ffffff',
                  }}
                >
                  <strong style={{ color: '#c2410c' }}>Priority 2 - Very Urgent (Orange)</strong>
                  <div style={{ fontSize: 12, color: '#9a3412', marginLeft: 24 }}>
                    High risk, severe pain, active chest pain, altered mental status (&lt; 10 mins target)
                  </div>
                </Radio>
                <Radio
                  value="urgent"
                  style={{
                    padding: '10px 14px',
                    borderRadius: 8,
                    border: '1px solid #fef08a',
                    background: field.value === 'urgent' ? '#fef9c3' : '#ffffff',
                  }}
                >
                  <strong style={{ color: '#854d0e' }}>Priority 3 - Urgent (Yellow)</strong>
                  <div style={{ fontSize: 12, color: '#713f12', marginLeft: 24 }}>
                    Stable vital signs but multiple resources needed (&lt; 60 mins target)
                  </div>
                </Radio>
                <Radio
                  value="standard"
                  style={{
                    padding: '10px 14px',
                    borderRadius: 8,
                    border: '1px solid #bbf7d0',
                    background: field.value === 'standard' ? '#dcfce7' : '#ffffff',
                  }}
                >
                  <strong style={{ color: '#15803d' }}>Priority 4 - Standard / Less Urgent (Green)</strong>
                  <div style={{ fontSize: 12, color: '#166534', marginLeft: 24 }}>
                    Simple isolated injury, stable ambulatory patient
                  </div>
                </Radio>
                <Radio
                  value="non_urgent"
                  style={{
                    padding: '10px 14px',
                    borderRadius: 8,
                    border: '1px solid #bae6fd',
                    background: field.value === 'non_urgent' ? '#e0f2fe' : '#ffffff',
                  }}
                >
                  <strong style={{ color: '#0369a1' }}>Priority 5 - Non-Urgent (Blue)</strong>
                  <div style={{ fontSize: 12, color: '#075985', marginLeft: 24 }}>
                    Minor chronic complaint, medication refill or routine check
                  </div>
                </Radio>
              </Radio.Group>
            )}
          />
          {errors.triageCategory && (
            <div style={{ color: '#ef4444', fontSize: 12, marginTop: 4 }}>
              {errors.triageCategory.message}
            </div>
          )}
        </div>

        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item
              label={<span style={{ fontWeight: 600 }}>Assign Emergency Bay / Bed</span>}
              validateStatus={errors.assignedBay ? 'error' : ''}
              help={errors.assignedBay?.message}
              required
            >
              <Controller
                name="assignedBay"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    size="large"
                    options={[
                      { label: '🔴 Resus Bay 1 (Critical Care)', value: 'Resus Bay 1' },
                      { label: '🔴 Resus Bay 2 (Trauma / Shock)', value: 'Resus Bay 2' },
                      { label: '🟠 Trauma Bay 2', value: 'Trauma Bay 2' },
                      { label: '🟡 Acute Bay 1 (Cardiac/Resp)', value: 'Acute Bay 1' },
                      { label: '🟡 Acute Bay 2', value: 'Acute Bay 2' },
                      { label: '🟡 Acute Bay 3', value: 'Acute Bay 3' },
                      { label: '🟢 Minor Procedure Bay 1', value: 'Minor Procedure Bay 1' },
                      { label: '🟢 Observation Bed 1', value: 'Observation Bed 1' },
                      { label: '🟢 Observation Bed 2', value: 'Observation Bed 2' },
                    ]}
                  />
                )}
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12}>
            <Form.Item label={<span style={{ fontWeight: 600 }}>Assigned ED Doctor</span>}>
              <Controller
                name="assignedDoctor"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    size="large"
                    options={[
                      { label: 'Dr. Daniel Haile (ED Physician)', value: 'doc-1' },
                      { label: 'Dr. Sara Tesfaye (Trauma Lead)', value: 'doc-2' },
                      { label: 'Dr. Tigist Mengistu (Emergency Specialist)', value: 'doc-3' },
                    ]}
                  />
                )}
              />
            </Form.Item>
          </Col>
        </Row>

        <Typography.Title level={5} style={{ fontSize: 14, color: '#0f172a', margin: '12px 0 8px' }}>
          2. Emergency Vital Signs & Neuro / Pain Status
        </Typography.Title>

        <Row gutter={12}>
          <Col xs={12} sm={6}>
            <Form.Item
              label="BP Systolic (mmHg)"
              validateStatus={errors.bloodPressureSystolic ? 'error' : ''}
              help={errors.bloodPressureSystolic?.message}
            >
              <Controller
                name="bloodPressureSystolic"
                control={control}
                render={({ field }) => (
                  <InputNumber {...field} min={40} max={300} placeholder="120" style={{ width: '100%' }} />
                )}
              />
            </Form.Item>
          </Col>
          <Col xs={12} sm={6}>
            <Form.Item
              label="BP Diastolic (mmHg)"
              validateStatus={errors.bloodPressureDiastolic ? 'error' : ''}
              help={errors.bloodPressureDiastolic?.message}
            >
              <Controller
                name="bloodPressureDiastolic"
                control={control}
                render={({ field }) => (
                  <InputNumber {...field} min={20} max={200} placeholder="80" style={{ width: '100%' }} />
                )}
              />
            </Form.Item>
          </Col>
          <Col xs={12} sm={6}>
            <Form.Item
              label="Heart Rate (bpm)"
              validateStatus={errors.heartRate ? 'error' : ''}
              help={errors.heartRate?.message}
            >
              <Controller
                name="heartRate"
                control={control}
                render={({ field }) => (
                  <InputNumber {...field} min={20} max={260} placeholder="75" style={{ width: '100%' }} />
                )}
              />
            </Form.Item>
          </Col>
          <Col xs={12} sm={6}>
            <Form.Item
              label="SpO2 Sat (%)"
              validateStatus={errors.spO2 ? 'error' : ''}
              help={errors.spO2?.message}
            >
              <Controller
                name="spO2"
                control={control}
                render={({ field }) => (
                  <InputNumber {...field} min={40} max={100} placeholder="98" style={{ width: '100%' }} />
                )}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={12}>
          <Col xs={12} sm={6}>
            <Form.Item
              label="Temp (°C)"
              validateStatus={errors.temperature ? 'error' : ''}
              help={errors.temperature?.message}
            >
              <Controller
                name="temperature"
                control={control}
                render={({ field }) => (
                  <InputNumber {...field} min={25} max={45} step={0.1} placeholder="37.0" style={{ width: '100%' }} />
                )}
              />
            </Form.Item>
          </Col>
          <Col xs={12} sm={6}>
            <Form.Item
              label="Resp Rate (/min)"
              validateStatus={errors.respiratoryRate ? 'error' : ''}
              help={errors.respiratoryRate?.message}
            >
              <Controller
                name="respiratoryRate"
                control={control}
                render={({ field }) => (
                  <InputNumber {...field} min={4} max={80} placeholder="16" style={{ width: '100%' }} />
                )}
              />
            </Form.Item>
          </Col>
          <Col xs={12} sm={6}>
            <Form.Item
              label="GCS Scale (3-15)"
              validateStatus={errors.gcs ? 'error' : ''}
              help={errors.gcs?.message}
            >
              <Controller
                name="gcs"
                control={control}
                render={({ field }) => (
                  <InputNumber {...field} min={3} max={15} placeholder="15" style={{ width: '100%' }} />
                )}
              />
            </Form.Item>
          </Col>
          <Col xs={12} sm={6}>
            <Form.Item
              label="Pain Score (0-10)"
              validateStatus={errors.painScore ? 'error' : ''}
              help={errors.painScore?.message}
            >
              <Controller
                name="painScore"
                control={control}
                render={({ field }) => (
                  <InputNumber {...field} min={0} max={10} placeholder="0" style={{ width: '100%' }} />
                )}
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          label={<span style={{ fontWeight: 600 }}>Triage Assessment & Clinical Findings</span>}
          validateStatus={errors.triageNotes ? 'error' : ''}
          help={errors.triageNotes?.message}
          required
        >
          <Controller
            name="triageNotes"
            control={control}
            render={({ field }) => (
              <Input.TextArea
                {...field}
                rows={3}
                placeholder="Airway patent? Breathing effort? Circulation status? Clinical impressions..."
              />
            )}
          />
        </Form.Item>

        <Form.Item
          label={<span style={{ fontWeight: 600 }}>Immediate Resuscitative Interventions Done</span>}
        >
          <Controller
            name="immediateInterventions"
            control={control}
            render={({ field }) => (
              <Input.TextArea
                {...field}
                rows={2}
                placeholder="e.g. High-flow O2 via mask, IV 18G cannula secured, Salbutamol nebulizer given, C-collar immobilized..."
              />
            )}
          />
        </Form.Item>
      </form>
    </Drawer>
  );
};
