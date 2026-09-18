import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Alert,
  Button,
  Col,
  Form,
  Input,
  InputNumber,
  Modal,
  Radio,
  Row,
  Select,
  Typography,
  message,
} from 'antd';
import { Controller, useForm } from 'react-hook-form';
import { useAdmitPatient, useBeds, useWards } from '../hooks/inpatient.hooks';
import { type AdmissionInput, admissionSchema } from '../inpatient.validation';
import type { Bed } from '../types';

interface AdmissionModalProps {
  open: boolean;
  preSelectedBed?: Bed | null;
  onClose: () => void;
}

export function AdmissionModal({ open, preSelectedBed, onClose }: AdmissionModalProps) {
  const { data: wards = [] } = useWards();
  const admitMutation = useAdmitPatient();

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<AdmissionInput>({
    resolver: zodResolver(admissionSchema),
    defaultValues: {
      patientName: '',
      patientMrn: '',
      gender: 'male',
      age: 30,
      wardId: '',
      bedId: '',
      attendingDoctor: 'Dr. Daniel Haile',
      admittingDiagnosis: '',
      severity: 'stable',
      admissionNotes: '',
      emergencyContactName: '',
      emergencyContactPhone: '',
    },
  });

  const selectedWardId = watch('wardId');
  const { data: beds = [] } = useBeds(selectedWardId || undefined);

  // Available beds in selected ward
  const availableBeds = beds.filter(
    (b) => b.status === 'available' || b.id === preSelectedBed?.id,
  );

  useEffect(() => {
    if (open) {
      reset({
        patientName: '',
        patientMrn: '',
        gender: 'male',
        age: 30,
        wardId: preSelectedBed?.wardId || (wards.length > 0 ? wards[0].id : ''),
        bedId: preSelectedBed?.id || '',
        attendingDoctor: 'Dr. Daniel Haile',
        admittingDiagnosis: '',
        severity: 'stable',
        admissionNotes: '',
        emergencyContactName: '',
        emergencyContactPhone: '',
      });
    }
  }, [open, preSelectedBed, wards, reset]);

  async function onSubmit(data: AdmissionInput) {
    try {
      await admitMutation.mutateAsync(data);
      message.success(`Patient ${data.patientName} admitted successfully!`);
      onClose();
    } catch {
      message.error('Failed to admit patient');
    }
  }

  return (
    <Modal
      title={
        <div style={{ paddingBottom: 6, borderBottom: '1px solid #f1f5f9' }}>
          <Typography.Title level={4} style={{ margin: 0, color: '#0f172a' }}>
            Inpatient Patient Admission
          </Typography.Title>
          <Typography.Text type="secondary" style={{ fontSize: 13 }}>
            Register and admit an inpatient, assign bed and attending physician
          </Typography.Text>
        </div>
      }
      open={open}
      onCancel={onClose}
      footer={null}
      destroyOnHidden
      width={720}
      style={{ top: 30 }}
    >
      <form onSubmit={handleSubmit(onSubmit)} style={{ marginTop: 16 }}>
        {/* Section 1: Patient Identity */}
        <Typography.Text
          strong
          style={{
            display: 'block',
            fontSize: 13,
            color: '#1e293b',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            marginBottom: 12,
          }}
        >
          1. Patient Demographics
        </Typography.Text>

        <Row gutter={16}>
          <Col xs={24} sm={14}>
            <Form.Item
              label="Full Patient Name"
              validateStatus={errors.patientName ? 'error' : ''}
              help={errors.patientName?.message}
              required
            >
              <Controller
                name="patientName"
                control={control}
                render={({ field }) => (
                  <Input {...field} placeholder="e.g. Bethlehem Tesfaye" size="large" />
                )}
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={10}>
            <Form.Item
              label="Medical Record No. (MRN)"
              validateStatus={errors.patientMrn ? 'error' : ''}
              help={errors.patientMrn?.message}
              required
            >
              <Controller
                name="patientMrn"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="e.g. MRN-78401"
                    size="large"
                    style={{ fontFamily: 'monospace' }}
                  />
                )}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={12} sm={6}>
            <Form.Item
              label="Age (Years)"
              validateStatus={errors.age ? 'error' : ''}
              help={errors.age?.message}
              required
            >
              <Controller
                name="age"
                control={control}
                render={({ field }) => (
                  <InputNumber
                    {...field}
                    min={0}
                    max={130}
                    style={{ width: '100%' }}
                    size="large"
                  />
                )}
              />
            </Form.Item>
          </Col>

          <Col xs={12} sm={8}>
            <Form.Item
              label="Gender"
              validateStatus={errors.gender ? 'error' : ''}
              help={errors.gender?.message}
              required
            >
              <Controller
                name="gender"
                control={control}
                render={({ field }) => (
                  <Radio.Group {...field} buttonStyle="solid" size="large">
                    <Radio.Button value="male">Male</Radio.Button>
                    <Radio.Button value="female">Female</Radio.Button>
                    <Radio.Button value="other">Other</Radio.Button>
                  </Radio.Group>
                )}
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={10}>
            <Form.Item
              label="Clinical Severity / Acuity"
              validateStatus={errors.severity ? 'error' : ''}
              help={errors.severity?.message}
              required
            >
              <Controller
                name="severity"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    size="large"
                    options={[
                      { label: '🟢 Stable (Standard Ward)', value: 'stable' },
                      { label: '🟠 Serious (Close Monitoring)', value: 'serious' },
                      { label: '🔴 Critical (ICU / High Dependency)', value: 'critical' },
                    ]}
                  />
                )}
              />
            </Form.Item>
          </Col>
        </Row>

        {/* Section 2: Ward & Bed Assignment */}
        <Typography.Text
          strong
          style={{
            display: 'block',
            fontSize: 13,
            color: '#1e293b',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            margin: '16px 0 12px 0',
          }}
        >
          2. Bed & Ward Placement
        </Typography.Text>

        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item
              label="Select Inpatient Ward"
              validateStatus={errors.wardId ? 'error' : ''}
              help={errors.wardId?.message}
              required
            >
              <Controller
                name="wardId"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    size="large"
                    placeholder="Choose Ward"
                    onChange={(val) => {
                      field.onChange(val);
                      setValue('bedId', '');
                    }}
                    options={wards.map((w) => ({
                      label: `${w.name} (${w.occupiedBeds}/${w.totalBeds} occupied)`,
                      value: w.id,
                    }))}
                  />
                )}
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12}>
            <Form.Item
              label="Select Available Bed"
              validateStatus={errors.bedId ? 'error' : ''}
              help={errors.bedId?.message}
              required
            >
              <Controller
                name="bedId"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    size="large"
                    placeholder={
                      availableBeds.length === 0
                        ? 'No available beds in this ward'
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
          </Col>
        </Row>

        {availableBeds.length === 0 && selectedWardId && (
          <Alert
            type="warning"
            showIcon
            message="No beds currently available in this ward. Please select another ward or discharge/transfer an occupant."
            style={{ marginBottom: 16 }}
          />
        )}

        {/* Section 3: Clinical Information */}
        <Typography.Text
          strong
          style={{
            display: 'block',
            fontSize: 13,
            color: '#1e293b',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            margin: '16px 0 12px 0',
          }}
        >
          3. Clinical Details & Attending Physician
        </Typography.Text>

        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item
              label="Attending Physician"
              validateStatus={errors.attendingDoctor ? 'error' : ''}
              help={errors.attendingDoctor?.message}
              required
            >
              <Controller
                name="attendingDoctor"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    size="large"
                    options={[
                      { label: 'Dr. Daniel Haile (Internal Medicine)', value: 'Dr. Daniel Haile' },
                      { label: 'Dr. Sara Tesfaye (Critical Care / ICU)', value: 'Dr. Sara Tesfaye' },
                      { label: 'Dr. Samuel Kassa (General Surgery)', value: 'Dr. Samuel Kassa' },
                      { label: 'Dr. Bethlehem Worku (Pediatrics)', value: 'Dr. Bethlehem Worku' },
                      { label: 'Dr. Tigist Mengistu (Obstetrics)', value: 'Dr. Tigist Mengistu' },
                    ]}
                  />
                )}
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12}>
            <Form.Item
              label="Admitting Diagnosis"
              validateStatus={errors.admittingDiagnosis ? 'error' : ''}
              help={errors.admittingDiagnosis?.message}
              required
            >
              <Controller
                name="admittingDiagnosis"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    size="large"
                    placeholder="e.g. Acute Appendicitis with localized peritonitis"
                  />
                )}
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item label="Admission Clinical Notes & Orders">
          <Controller
            name="admissionNotes"
            control={control}
            render={({ field }) => (
              <Input.TextArea
                {...field}
                rows={2}
                placeholder="Initial clinical status, IV fluids ordered, vital signs alerts..."
              />
            )}
          />
        </Form.Item>

        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item label="Emergency Contact Person">
              <Controller
                name="emergencyContactName"
                control={control}
                render={({ field }) => (
                  <Input {...field} placeholder="e.g. Abebe Worku (Spouse)" />
                )}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item label="Emergency Contact Phone">
              <Controller
                name="emergencyContactPhone"
                control={control}
                render={({ field }) => (
                  <Input {...field} placeholder="+251 911 000000" />
                )}
              />
            </Form.Item>
          </Col>
        </Row>

        {/* Action Buttons */}
        <div
          style={{
            marginTop: 24,
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
            loading={isSubmitting || admitMutation.isPending}
            size="large"
            style={{ background: '#2563eb', borderColor: '#2563eb' }}
          >
            Confirm Admission & Bed Placement
          </Button>
        </div>
      </form>
    </Modal>
  );
}
