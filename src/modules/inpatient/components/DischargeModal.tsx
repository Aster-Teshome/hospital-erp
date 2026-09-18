import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Alert,
  Button,
  Card,
  Col,
  Form,
  Input,
  Modal,
  Radio,
  Row,
  Typography,
  message,
} from 'antd';
import { Controller, useForm } from 'react-hook-form';
import { useDischargePatient } from '../hooks/inpatient.hooks';
import { type DischargeInput, dischargeSchema } from '../inpatient.validation';
import type { Bed, InpatientAdmission } from '../types';

interface DischargeModalProps {
  open: boolean;
  admission?: InpatientAdmission | null;
  bed?: Bed | null;
  onClose: () => void;
}

export function DischargeModal({ open, admission, bed, onClose }: DischargeModalProps) {
  const dischargeMutation = useDischargePatient();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<DischargeInput>({
    resolver: zodResolver(dischargeSchema),
    defaultValues: {
      dischargeCondition: 'recovered',
      dischargeSummary: '',
      followUpInstructions: '',
      dischargeMedications: '',
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        dischargeCondition: 'recovered',
        dischargeSummary: '',
        followUpInstructions: '',
        dischargeMedications: '',
      });
    }
  }, [open, reset]);

  const admissionId = admission?.id || bed?.currentPatient?.admissionId;
  const patientName = admission?.patientName || bed?.currentPatient?.patientName;
  const patientMrn = admission?.patientMrn || bed?.currentPatient?.patientMrn;
  const bedNumber = admission?.bedNumber || bed?.bedNumber;
  const admittingDiagnosis =
    admission?.admittingDiagnosis || bed?.currentPatient?.admittingDiagnosis;

  async function onSubmit(data: DischargeInput) {
    if (!admissionId) {
      message.error('No valid admission record found to discharge');
      return;
    }

    try {
      await dischargeMutation.mutateAsync({
        admissionId,
        input: data,
      });
      message.success(`Patient ${patientName} discharged successfully! Bed ${bedNumber} is marked for cleaning.`);
      onClose();
    } catch {
      message.error('Failed to discharge patient');
    }
  }

  return (
    <Modal
      title={
        <div style={{ paddingBottom: 6, borderBottom: '1px solid #f1f5f9' }}>
          <Typography.Title level={4} style={{ margin: 0, color: '#0f172a' }}>
            Inpatient Clinical Discharge
          </Typography.Title>
          <Typography.Text type="secondary" style={{ fontSize: 13 }}>
            Finalize hospital stay, document discharge summary, release bed to sanitization
          </Typography.Text>
        </div>
      }
      open={open}
      onCancel={onClose}
      footer={null}
      destroyOnHidden
      width={Math.min(680, typeof window !== 'undefined' ? window.innerWidth - 32 : 680)}
      style={{ top: 40 }}
    >
      {/* Patient stay brief */}
      <Card
        styles={{ body: { padding: '12px 16px' } }}
        style={{
          background: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: 8,
          margin: '16px 0',
        }}
      >
        <Row gutter={16}>
          <Col span={12}>
            <div style={{ fontSize: 11, color: '#64748b' }}>PATIENT</div>
            <Typography.Text strong style={{ fontSize: 15, color: '#0f172a' }}>
              {patientName}
            </Typography.Text>
            <div style={{ fontSize: 12, color: '#475569' }}>
              MRN: <span style={{ fontFamily: 'monospace' }}>{patientMrn}</span>
            </div>
          </Col>
          <Col span={12}>
            <div style={{ fontSize: 11, color: '#64748b' }}>ASSIGNED BED & WARD</div>
            <Typography.Text strong style={{ fontSize: 15, color: '#2563eb' }}>
              {bedNumber}
            </Typography.Text>
            <div style={{ fontSize: 12, color: '#475569' }}>{bed?.wardName || admission?.wardName}</div>
          </Col>
        </Row>
        {admittingDiagnosis && (
          <div style={{ marginTop: 8, paddingTop: 8, borderTop: '1px solid #e2e8f0', fontSize: 12 }}>
            <span style={{ color: '#64748b' }}>Admitting Diagnosis: </span>
            <span style={{ color: '#1e293b', fontWeight: 500 }}>{admittingDiagnosis}</span>
          </div>
        )}
      </Card>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Form.Item
          label="Condition on Discharge"
          validateStatus={errors.dischargeCondition ? 'error' : ''}
          help={errors.dischargeCondition?.message}
          required
        >
          <Controller
            name="dischargeCondition"
            control={control}
            render={({ field }) => (
              <Radio.Group {...field} buttonStyle="solid" style={{ width: '100%' }}>
                <Radio.Button value="recovered" style={{ width: '25%', textAlign: 'center' }}>
                  Recovered
                </Radio.Button>
                <Radio.Button value="improved" style={{ width: '25%', textAlign: 'center' }}>
                  Improved
                </Radio.Button>
                <Radio.Button value="transferred" style={{ width: '25%', textAlign: 'center' }}>
                  Transferred
                </Radio.Button>
                <Radio.Button value="against_advice" style={{ width: '25%', textAlign: 'center' }}>
                  AMA
                </Radio.Button>
              </Radio.Group>
            )}
          />
        </Form.Item>

        <Form.Item
          label="Clinical Discharge Summary"
          validateStatus={errors.dischargeSummary ? 'error' : ''}
          help={errors.dischargeSummary?.message}
          required
        >
          <Controller
            name="dischargeSummary"
            control={control}
            render={({ field }) => (
              <Input.TextArea
                {...field}
                rows={3}
                placeholder="Clinical course during stay, procedures performed, resolved issues, condition at discharge..."
              />
            )}
          />
        </Form.Item>

        <Form.Item label="Discharge Medications & Regimen">
          <Controller
            name="dischargeMedications"
            control={control}
            render={({ field }) => (
              <Input.TextArea
                {...field}
                rows={2}
                placeholder="e.g. Amoxicillin/Clavulanate 625mg PO TID x 7 days; Paracetamol 1g PO PRN..."
              />
            )}
          />
        </Form.Item>

        <Form.Item label="Follow-Up Care Instructions & Next Clinic Date">
          <Controller
            name="followUpInstructions"
            control={control}
            render={({ field }) => (
              <Input.TextArea
                {...field}
                rows={2}
                placeholder="e.g. Return to Surgical OPD in 1 week for suture removal. Report immediately if fever > 38.5°C."
              />
            )}
          />
        </Form.Item>

        <Alert
          type="info"
          showIcon
          title={`Submitting this discharge will automatically mark Bed ${bedNumber} as 'Cleaning' so nursing/sanitation staff can prepare it for the next patient.`}
          style={{ marginBottom: 16 }}
        />

        <div
          style={{
            marginTop: 20,
            paddingTop: 16,
            borderTop: '1px solid #f1f5f9',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 12,
          }}
        >
          <Button onClick={onClose} size="large">
            Cancel
          </Button>
          <Button
            type="primary"
            danger
            htmlType="submit"
            loading={isSubmitting || dischargeMutation.isPending}
            size="large"
          >
            Confirm Discharge & Free Bed
          </Button>
        </div>
      </form>
    </Modal>
  );
}
