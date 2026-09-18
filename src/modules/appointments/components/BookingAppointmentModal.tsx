import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, DatePicker, Form, Input, Modal, Select, message } from 'antd';
import { Controller, useForm } from 'react-hook-form';
import dayjs from 'dayjs';
import { bookAppointmentSchema, type BookAppointmentInput } from '../appointments.validation';
import { useBookAppointment } from '../hooks/appointments.hooks';
import { extractErrorMessage } from '../../../utils/extractErrorMessage';

interface BookingAppointmentModalProps {
  open: boolean;
  onClose: () => void;
}

export function BookingAppointmentModal({ open, onClose }: BookingAppointmentModalProps) {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const bookMutation = useBookAppointment();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BookAppointmentInput>({
    resolver: zodResolver(bookAppointmentSchema),
    defaultValues: {
      patientId: '',
      doctorId: '',
      appointmentDate: dayjs().format('YYYY-MM-DD'),
      startTime: '09:00',
      type: 'consultation',
      reason: '',
    },
  });

  function handleFormSubmit(values: BookAppointmentInput) {
    setSubmitError(null);
    bookMutation.mutate(values, {
      onSuccess: () => {
        message.success('Appointment booked successfully!');
        reset();
        onClose();
      },
      onError: (err) => {
        setSubmitError(extractErrorMessage(err) ?? 'Failed to book appointment');
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
      centered
      title="Book New Appointment"
      open={open}
      onOk={handleSubmit(handleFormSubmit)}
      onCancel={handleCancel}
      confirmLoading={bookMutation.isPending}
      okText="Book Appointment"
      destroyOnHidden
      width={Math.min(520, typeof window !== 'undefined' ? window.innerWidth - 32 : 520)}
    >
      {submitError && (
        <Alert
          type="error"
          showIcon
          title="Booking Error"
          description={submitError}
          style={{ marginBottom: 16 }}
        />
      )}

      <Form layout="vertical">
        <Form.Item
          label="Patient ID / MRN"
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
          label="Doctor"
          validateStatus={errors.doctorId ? 'error' : ''}
          help={errors.doctorId?.message}
          required
        >
          <Controller
            name="doctorId"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                placeholder="Select doctor"
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

        <Form.Item
          label="Appointment Date"
          validateStatus={errors.appointmentDate ? 'error' : ''}
          help={errors.appointmentDate?.message}
          required
        >
          <Controller
            name="appointmentDate"
            control={control}
            render={({ field }) => (
              <DatePicker
                style={{ width: '100%' }}
                value={field.value ? dayjs(field.value) : null}
                onChange={(_, dateString) =>
                  field.onChange(Array.isArray(dateString) ? dateString[0] : dateString)
                }
                minDate={dayjs()}
              />
            )}
          />
        </Form.Item>

        <Form.Item
          label="Start Time Slot"
          validateStatus={errors.startTime ? 'error' : ''}
          help={errors.startTime?.message}
          required
        >
          <Controller
            name="startTime"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                placeholder="Select time slot"
                options={[
                  { value: '08:30', label: '08:30 AM' },
                  { value: '09:00', label: '09:00 AM' },
                  { value: '09:30', label: '09:30 AM' },
                  { value: '10:00', label: '10:00 AM' },
                  { value: '10:30', label: '10:30 AM' },
                  { value: '11:00', label: '11:00 AM' },
                  { value: '11:30', label: '11:30 AM' },
                  { value: '14:00', label: '02:00 PM' },
                  { value: '14:30', label: '02:30 PM' },
                  { value: '15:00', label: '03:00 PM' },
                  { value: '15:30', label: '03:30 PM' },
                  { value: '16:00', label: '04:00 PM' },
                ]}
              />
            )}
          />
        </Form.Item>

        <Form.Item
          label="Appointment Type"
          validateStatus={errors.type ? 'error' : ''}
          help={errors.type?.message}
          required
        >
          <Controller
            name="type"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                options={[
                  { value: 'consultation', label: 'Consultation' },
                  { value: 'follow_up', label: 'Follow Up' },
                  { value: 'routine_checkup', label: 'Routine Checkup' },
                  { value: 'emergency', label: 'Emergency' },
                ]}
              />
            )}
          />
        </Form.Item>

        <Form.Item
          label="Reason for Visit / Symptoms"
          validateStatus={errors.reason ? 'error' : ''}
          help={errors.reason?.message}
        >
          <Controller
            name="reason"
            control={control}
            render={({ field }) => (
              <Input.TextArea
                {...field}
                rows={3}
                placeholder="Briefly describe the symptoms or reason for visit"
              />
            )}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}
