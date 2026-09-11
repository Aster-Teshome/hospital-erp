import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, Form, Input, Modal, Select, message } from 'antd';
import { Controller, useForm } from 'react-hook-form';
import { checkInSchema, type CheckInInput } from '../outpatient.validation';
import { useCheckInPatient } from '../hooks/outpatient.hooks';
import { extractErrorMessage } from '../../../utils/extractErrorMessage';

interface CheckInModalProps {
  open: boolean;
  onClose: () => void;
}

export function CheckInModal({ open, onClose }: CheckInModalProps) {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const checkInMutation = useCheckInPatient();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CheckInInput>({
    resolver: zodResolver(checkInSchema),
    defaultValues: {
      patientId: '',
      patientName: '',
      doctorId: 'doc-1',
    },
  });

  function handleFormSubmit(values: CheckInInput) {
    setSubmitError(null);
    checkInMutation.mutate(values, {
      onSuccess: () => {
        message.success('Patient checked in to OPD successfully!');
        reset();
        onClose();
      },
      onError: (err) => {
        setSubmitError(extractErrorMessage(err) ?? 'Failed to check in patient');
      },
    });
  }

  function handleCancel() {
    reset();
    setSubmitError(null);
    onClose();
  }

  return (
    <Modal
      title="Check In Patient to Outpatient (OPD)"
      open={open}
      onOk={handleSubmit(handleFormSubmit)}
      onCancel={handleCancel}
      confirmLoading={checkInMutation.isPending}
      okText="Complete Check-In"
      destroyOnClose
    >
      {submitError && (
        <Alert
          type="error"
          showIcon
          message="Check-in Error"
          description={submitError}
          style={{ marginBottom: 16 }}
        />
      )}

      <Form layout="vertical">
        <Form.Item
          label="Patient MRN / ID"
          validateStatus={errors.patientId ? 'error' : ''}
          help={errors.patientId?.message}
          required
        >
          <Controller
            name="patientId"
            control={control}
            render={({ field }) => (
              <Input {...field} placeholder="e.g. PAT-2026-001 or patient ID" />
            )}
          />
        </Form.Item>

        <Form.Item
          label="Patient Full Name"
          validateStatus={errors.patientName ? 'error' : ''}
          help={errors.patientName?.message}
          required
        >
          <Controller
            name="patientName"
            control={control}
            render={({ field }) => (
              <Input {...field} placeholder="e.g. Almaz Bekele" />
            )}
          />
        </Form.Item>

        <Form.Item label="Assign Doctor">
          <Controller
            name="doctorId"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                placeholder="Select attending doctor"
                options={[
                  { value: 'doc-1', label: 'Dr. Abebe Kebede (Internal Medicine)' },
                  { value: 'doc-2', label: 'Dr. Sara Tesfaye (Pediatrics)' },
                  { value: 'doc-3', label: 'Dr. Daniel Haile (General Surgery)' },
                  { value: 'doc-4', label: 'Dr. Tigist Mengistu (Gynecology)' },
                ]}
              />
            )}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}
