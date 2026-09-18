import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, Button, Col, Drawer, Form, InputNumber, Row, Space, Tag, Typography, message } from 'antd';
import { Controller, useForm, useWatch } from 'react-hook-form';
import type { OpdVisit } from '../types';
import { vitalsSchema, type VitalsInput } from '../outpatient.validation';
import { useRecordVitals } from '../hooks/outpatient.hooks';
import { extractErrorMessage } from '../../../utils/extractErrorMessage';

interface VitalSignsDrawerProps {
  open: boolean;
  visit: OpdVisit | null;
  onClose: () => void;
}

export function VitalSignsDrawer({ open, visit, onClose }: VitalSignsDrawerProps) {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const recordMutation = useRecordVitals();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<VitalsInput>({
    resolver: zodResolver(vitalsSchema),
    defaultValues: {
      temperature: visit?.vitals?.temperature ?? 36.6,
      bloodPressureSystolic: visit?.vitals?.bloodPressureSystolic ?? 120,
      bloodPressureDiastolic: visit?.vitals?.bloodPressureDiastolic ?? 80,
      heartRate: visit?.vitals?.heartRate ?? 72,
      respiratoryRate: visit?.vitals?.respiratoryRate ?? 16,
      spO2: visit?.vitals?.spO2 ?? 98,
      weight: visit?.vitals?.weight ?? 68,
      height: visit?.vitals?.height ?? 170,
    },
  });

  const weight = useWatch({ control, name: 'weight' });
  const height = useWatch({ control, name: 'height' });

  // Live BMI calculation: weight(kg) / (height(m) * height(m))
  let bmi: number | null = null;
  let bmiCategory: { label: string; color: string } | null = null;
  if (weight && height && Number(height) > 0) {
    const heightInMeters = Number(height) / 100;
    bmi = Number((Number(weight) / (heightInMeters * heightInMeters)).toFixed(1));
    if (bmi < 18.5) bmiCategory = { label: 'Underweight', color: 'orange' };
    else if (bmi < 25) bmiCategory = { label: 'Normal weight', color: 'green' };
    else if (bmi < 30) bmiCategory = { label: 'Overweight', color: 'volcano' };
    else bmiCategory = { label: 'Obese', color: 'red' };
  }

  function handleFormSubmit(values: VitalsInput) {
    if (!visit) return;
    setSubmitError(null);
    recordMutation.mutate(
      { visitId: visit.id, vitals: values },
      {
        onSuccess: () => {
          message.success('Vital signs recorded successfully!');
          reset();
          onClose();
        },
        onError: (err) => {
          setSubmitError(extractErrorMessage(err) ?? 'Failed to record vitals');
        },
      },
    );
  }

  return (
    <Drawer
      title={`Record Vital Signs - ${visit?.patientName ?? ''}`}
      open={open}
      onClose={onClose}
      size={Math.min(500, typeof window !== 'undefined' ? window.innerWidth : 500)}
      extra={
        <Space>
          <Button onClick={onClose}>Cancel</Button>
          <Button
            type="primary"
            onClick={handleSubmit(handleFormSubmit)}
            loading={recordMutation.isPending}
          >
            Save Vitals
          </Button>
        </Space>
      }
    >
      {submitError && (
        <Alert
          type="error"
          showIcon
          title="Vitals Error"
          description={submitError}
          style={{ marginBottom: 16 }}
        />
      )}

      {visit && (
        <div style={{ marginBottom: 20, padding: 12, background: '#f8faf9', borderRadius: 8 }}>
          <Typography.Text strong>MRN: {visit.patientMrn}</Typography.Text>
          <div style={{ color: '#64748b', fontSize: 13 }}>
            Attending Doctor: {visit.doctorName ?? 'Unassigned'}
          </div>
        </div>
      )}

      <Form layout="vertical">
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Temperature (°C)"
              validateStatus={errors.temperature ? 'error' : ''}
              help={errors.temperature?.message}
            >
              <Controller
                name="temperature"
                control={control}
                render={({ field }) => (
                  <InputNumber
                    {...field}
                    step={0.1}
                    min={30}
                    max={45}
                    style={{ width: '100%' }}
                    placeholder="e.g. 36.8"
                  />
                )}
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="SpO2 (% Oxygen)"
              validateStatus={errors.spO2 ? 'error' : ''}
              help={errors.spO2?.message}
            >
              <Controller
                name="spO2"
                control={control}
                render={({ field }) => (
                  <InputNumber
                    {...field}
                    min={50}
                    max={100}
                    style={{ width: '100%' }}
                    placeholder="e.g. 98"
                  />
                )}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="BP Systolic (mmHg)"
              validateStatus={errors.bloodPressureSystolic ? 'error' : ''}
              help={errors.bloodPressureSystolic?.message}
            >
              <Controller
                name="bloodPressureSystolic"
                control={control}
                render={({ field }) => (
                  <InputNumber
                    {...field}
                    min={50}
                    max={250}
                    style={{ width: '100%' }}
                    placeholder="e.g. 120"
                  />
                )}
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="BP Diastolic (mmHg)"
              validateStatus={errors.bloodPressureDiastolic ? 'error' : ''}
              help={errors.bloodPressureDiastolic?.message}
            >
              <Controller
                name="bloodPressureDiastolic"
                control={control}
                render={({ field }) => (
                  <InputNumber
                    {...field}
                    min={30}
                    max={150}
                    style={{ width: '100%' }}
                    placeholder="e.g. 80"
                  />
                )}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Heart Rate (BPM)"
              validateStatus={errors.heartRate ? 'error' : ''}
              help={errors.heartRate?.message}
            >
              <Controller
                name="heartRate"
                control={control}
                render={({ field }) => (
                  <InputNumber
                    {...field}
                    min={30}
                    max={220}
                    style={{ width: '100%' }}
                    placeholder="e.g. 72"
                  />
                )}
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Respiratory Rate (/min)"
              validateStatus={errors.respiratoryRate ? 'error' : ''}
              help={errors.respiratoryRate?.message}
            >
              <Controller
                name="respiratoryRate"
                control={control}
                render={({ field }) => (
                  <InputNumber
                    {...field}
                    min={5}
                    max={60}
                    style={{ width: '100%' }}
                    placeholder="e.g. 16"
                  />
                )}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Weight (kg)"
              validateStatus={errors.weight ? 'error' : ''}
              help={errors.weight?.message}
            >
              <Controller
                name="weight"
                control={control}
                render={({ field }) => (
                  <InputNumber
                    {...field}
                    min={1}
                    max={300}
                    step={0.5}
                    style={{ width: '100%' }}
                    placeholder="e.g. 70"
                  />
                )}
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Height (cm)"
              validateStatus={errors.height ? 'error' : ''}
              help={errors.height?.message}
            >
              <Controller
                name="height"
                control={control}
                render={({ field }) => (
                  <InputNumber
                    {...field}
                    min={30}
                    max={250}
                    style={{ width: '100%' }}
                    placeholder="e.g. 175"
                  />
                )}
              />
            </Form.Item>
          </Col>
        </Row>

        {bmi !== null && bmiCategory && (
          <div
            style={{
              padding: 16,
              background: '#f1f5f4',
              borderRadius: 12,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>
              <Typography.Text strong>Calculated BMI: </Typography.Text>
              <Typography.Text style={{ fontSize: 16, fontWeight: 700 }}>
                {bmi} kg/m²
              </Typography.Text>
            </div>
            <Tag color={bmiCategory.color}>{bmiCategory.label}</Tag>
          </div>
        )}
      </Form>
    </Drawer>
  );
}
