import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  Modal,
  Row,
  Select,
  Typography,
  message,
} from 'antd';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { useBeds, useTransferBed, useWards } from '../hooks/inpatient.hooks';
import { type BedTransferInput, bedTransferSchema } from '../inpatient.validation';
import type { Bed, InpatientAdmission } from '../types';

interface BedTransferModalProps {
  open: boolean;
  admission?: InpatientAdmission | null;
  bed?: Bed | null;
  onClose: () => void;
}

export function BedTransferModal({ open, admission, bed, onClose }: BedTransferModalProps) {
  const { data: wards = [] } = useWards();
  const transferMutation = useTransferBed();

  const admissionId = admission?.id || bed?.currentPatient?.admissionId;
  const patientName = admission?.patientName || bed?.currentPatient?.patientName;
  const patientMrn = admission?.patientMrn || bed?.currentPatient?.patientMrn;
  const currentBedNumber = admission?.bedNumber || bed?.bedNumber;

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<BedTransferInput>({
    resolver: zodResolver(bedTransferSchema),
    defaultValues: {
      targetWardId: '',
      targetBedId: '',
      reason: '',
    },
  });

  const selectedTargetWardId = useWatch({ control, name: 'targetWardId' });
  const { data: availableTargetBeds = [] } = useBeds(selectedTargetWardId || undefined);

  // Available beds in selected target ward
  const availableBeds = availableTargetBeds.filter((b) => b.status === 'available');

  useEffect(() => {
    if (open) {
      reset({
        targetWardId: '',
        targetBedId: '',
        reason: '',
      });
    }
  }, [open, reset]);

  async function onSubmit(data: BedTransferInput) {
    if (!admissionId) {
      message.error('No admission record specified');
      return;
    }

    try {
      await transferMutation.mutateAsync({
        admissionId,
        input: data,
      });
      message.success(`Patient ${patientName} transferred successfully!`);
      onClose();
    } catch {
      message.error('Failed to transfer patient');
    }
  }

  return (
    <Modal
      title={
        <div style={{ paddingBottom: 6, borderBottom: '1px solid #f1f5f9' }}>
          <Typography.Title level={4} style={{ margin: 0, color: '#0f172a' }}>
            Transfer Inpatient Bed / Ward
          </Typography.Title>
          <Typography.Text type="secondary" style={{ fontSize: 13 }}>
            Transfer patient to another bed or specialized unit (e.g. Step-down or ICU)
          </Typography.Text>
        </div>
      }
      open={open}
      onCancel={onClose}
      footer={null}
      destroyOnHidden
      width={Math.min(560, typeof window !== 'undefined' ? window.innerWidth - 32 : 560)}
    >
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
          <Col span={14}>
            <div style={{ fontSize: 11, color: '#64748b' }}>PATIENT</div>
            <Typography.Text strong style={{ fontSize: 14, color: '#0f172a' }}>
              {patientName}
            </Typography.Text>
            <div style={{ fontSize: 12, color: '#475569' }}>
              MRN: <span style={{ fontFamily: 'monospace' }}>{patientMrn}</span>
            </div>
          </Col>
          <Col span={10}>
            <div style={{ fontSize: 11, color: '#64748b' }}>CURRENT BED</div>
            <Typography.Text strong style={{ fontSize: 14, color: '#2563eb' }}>
              {currentBedNumber}
            </Typography.Text>
          </Col>
        </Row>
      </Card>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Form.Item
          label="Target Ward"
          validateStatus={errors.targetWardId ? 'error' : ''}
          help={errors.targetWardId?.message}
          required
        >
          <Controller
            name="targetWardId"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                size="large"
                placeholder="Select Destination Ward"
                onChange={(val) => {
                  field.onChange(val);
                  setValue('targetBedId', '');
                }}
                options={wards.map((w) => ({
                  label: `${w.name} (${w.code})`,
                  value: w.id,
                }))}
              />
            )}
          />
        </Form.Item>

        <Form.Item
          label="Target Available Bed"
          validateStatus={errors.targetBedId ? 'error' : ''}
          help={errors.targetBedId?.message}
          required
        >
          <Controller
            name="targetBedId"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                size="large"
                placeholder={
                  availableBeds.length === 0
                    ? 'No available beds in selected ward'
                    : 'Select Available Bed'
                }
                disabled={availableBeds.length === 0}
                options={availableBeds.map((b) => ({
                  label: `${b.bedNumber} - ${b.bedType.toUpperCase()} (ETB ${b.dailyRate ?? 400}/day)`,
                  value: b.id,
                }))}
              />
            )}
          />
        </Form.Item>

        <Form.Item
          label="Reason for Transfer"
          validateStatus={errors.reason ? 'error' : ''}
          help={errors.reason?.message}
          required
        >
          <Controller
            name="reason"
            control={control}
            render={({ field }) => (
              <Input.TextArea
                {...field}
                rows={3}
                placeholder="e.g. Clinical improvement, step-down from ICU to General Medical Ward..."
              />
            )}
          />
        </Form.Item>

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
            htmlType="submit"
            loading={isSubmitting || transferMutation.isPending}
            size="large"
            style={{ background: '#2563eb', borderColor: '#2563eb' }}
          >
            Confirm Bed Transfer
          </Button>
        </div>
      </form>
    </Modal>
  );
}
