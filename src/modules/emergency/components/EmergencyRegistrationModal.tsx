import React, { useEffect } from 'react';
import {
  Alert,
  Button,
  Checkbox,
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
import { Controller, useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  emergencyRegistrationSchema,
  type EmergencyRegistrationInput,
} from '../emergency.validation';
import { useRegisterEmergencyPatient } from '../hooks/emergency.hooks';
import { extractErrorMessage } from '../../../utils/extractErrorMessage';

interface EmergencyRegistrationModalProps {
  open: boolean;
  onClose: () => void;
}

export const EmergencyRegistrationModal: React.FC<EmergencyRegistrationModalProps> = ({
  open,
  onClose,
}) => {
  const registerMutation = useRegisterEmergencyPatient();

  const {
    control,
    handleSubmit,
    reset,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<EmergencyRegistrationInput>({
    resolver: zodResolver(emergencyRegistrationSchema),
    defaultValues: {
      patientName: '',
      isUnidentified: false,
      age: undefined,
      gender: 'male',
      arrivalMode: 'ambulance',
      chiefComplaint: '',
      accompaniedBy: '',
      contactPhone: '',
      initialObservations: '',
    },
  });

  const isUnidentified = useWatch({ control, name: 'isUnidentified' });

  useEffect(() => {
    if (isUnidentified) {
      setValue('patientName', 'Trauma Unidentified / John Doe');
      setValue('chiefComplaint', getValues('chiefComplaint') || 'Unresponsive trauma casualty');
    }
  }, [isUnidentified, setValue, getValues]);

  const onSubmit = async (data: EmergencyRegistrationInput) => {
    try {
      await registerMutation.mutateAsync(data);
      message.success('Emergency patient registered successfully');
      reset();
      onClose();
    } catch (err) {
      message.error(extractErrorMessage(err));
    }
  };

  const handleCancel = () => {
    reset();
    onClose();
  };

  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span
            style={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              backgroundColor: '#ef4444',
              display: 'inline-block',
            }}
          />
          <div>
            <Typography.Title level={4} style={{ margin: 0, fontSize: 18 }}>
              Emergency Patient Registration
            </Typography.Title>
            <Typography.Text type="secondary" style={{ fontSize: 12 }}>
              Fast-track trauma & acute intake. Minimum required fields for expedited resuscitation.
            </Typography.Text>
          </div>
        </div>
      }
      open={open}
      onCancel={handleCancel}
      footer={null}
      width={Math.min(700, typeof window !== 'undefined' ? window.innerWidth - 32 : 700)}
      destroyOnHidden
    >
      <form onSubmit={handleSubmit(onSubmit)} style={{ marginTop: 16 }}>
        {registerMutation.isError && (
          <Alert
            type="error"
            title={extractErrorMessage(registerMutation.error)}
            showIcon
            style={{ marginBottom: 16 }}
          />
        )}

        <div
          style={{
            background: '#fef2f2',
            padding: '12px 16px',
            borderRadius: 8,
            border: '1px solid #fecaca',
            marginBottom: 20,
          }}
        >
          <Controller
            name="isUnidentified"
            control={control}
            render={({ field }) => (
              <Checkbox
                checked={field.value}
                onChange={(e) => field.onChange(e.target.checked)}
                style={{ fontWeight: 600, color: '#991b1b' }}
              >
                Unidentified / Unconscious Casualty (John/Jane Doe)
              </Checkbox>
            )}
          />
          <Typography.Paragraph
            type="secondary"
            style={{ margin: '4px 0 0 24px', fontSize: 12, color: '#7f1d1d' }}
          >
            Check this to generate an expedited temporary MRN for critically injured or unresponsive arrivals.
          </Typography.Paragraph>
        </div>

        <Row gutter={16}>
          <Col xs={24} sm={14}>
            <Form.Item
              label={<span style={{ fontWeight: 600 }}>Patient Full Name / Identifier</span>}
              validateStatus={errors.patientName ? 'error' : ''}
              help={errors.patientName?.message}
              required
            >
              <Controller
                name="patientName"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="e.g., Almaz Bekele or Unknown Male in Red Jacket"
                    size="large"
                  />
                )}
              />
            </Form.Item>
          </Col>

          <Col xs={12} sm={5}>
            <Form.Item
              label={<span style={{ fontWeight: 600 }}>Age (Est.)</span>}
              validateStatus={errors.age ? 'error' : ''}
              help={errors.age?.message}
            >
              <Controller
                name="age"
                control={control}
                render={({ field }) => (
                  <InputNumber
                    {...field}
                    min={0}
                    max={125}
                    placeholder="e.g. 45"
                    style={{ width: '100%' }}
                    size="large"
                  />
                )}
              />
            </Form.Item>
          </Col>

          <Col xs={12} sm={5}>
            <Form.Item
              label={<span style={{ fontWeight: 600 }}>Gender</span>}
              validateStatus={errors.gender ? 'error' : ''}
              help={errors.gender?.message}
              required
            >
              <Controller
                name="gender"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    size="large"
                    options={[
                      { label: 'Male', value: 'male' },
                      { label: 'Female', value: 'female' },
                      { label: 'Other', value: 'other' },
                    ]}
                  />
                )}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item
              label={<span style={{ fontWeight: 600 }}>Arrival Mode</span>}
              validateStatus={errors.arrivalMode ? 'error' : ''}
              help={errors.arrivalMode?.message}
              required
            >
              <Controller
                name="arrivalMode"
                control={control}
                render={({ field }) => (
                  <Radio.Group {...field} buttonStyle="solid" style={{ width: '100%' }}>
                    <Radio.Button value="ambulance" style={{ width: '25%', textAlign: 'center' }}>
                      Ambulance
                    </Radio.Button>
                    <Radio.Button value="walk_in" style={{ width: '25%', textAlign: 'center' }}>
                      Walk-in
                    </Radio.Button>
                    <Radio.Button value="police" style={{ width: '25%', textAlign: 'center' }}>
                      Police
                    </Radio.Button>
                    <Radio.Button value="referral" style={{ width: '25%', textAlign: 'center' }}>
                      Referral
                    </Radio.Button>
                  </Radio.Group>
                )}
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12}>
            <Form.Item
              label={<span style={{ fontWeight: 600 }}>Accompanied By</span>}
              validateStatus={errors.accompaniedBy ? 'error' : ''}
              help={errors.accompaniedBy?.message}
            >
              <Controller
                name="accompaniedBy"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="e.g., EMS Team, Federal Police, Relative"
                    size="large"
                  />
                )}
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          label={<span style={{ fontWeight: 600 }}>Chief Complaint & Presenting Problem</span>}
          validateStatus={errors.chiefComplaint ? 'error' : ''}
          help={errors.chiefComplaint?.message}
          required
        >
          <Controller
            name="chiefComplaint"
            control={control}
            render={({ field }) => (
              <Input.TextArea
                {...field}
                rows={3}
                placeholder="Describe reason for emergency presentation (e.g. severe chest pain, shortness of breath, trauma, hemorrhage)..."
              />
            )}
          />
        </Form.Item>

        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item
              label={<span style={{ fontWeight: 600 }}>Emergency Contact Phone</span>}
              validateStatus={errors.contactPhone ? 'error' : ''}
              help={errors.contactPhone?.message}
            >
              <Controller
                name="contactPhone"
                control={control}
                render={({ field }) => (
                  <Input {...field} placeholder="+251 911 ..." size="large" />
                )}
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12}>
            <Form.Item
              label={<span style={{ fontWeight: 600 }}>Initial Paramedic / Observation Notes</span>}
            >
              <Controller
                name="initialObservations"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="e.g. Oxygen administered en-route, neck collar on"
                    size="large"
                  />
                )}
              />
            </Form.Item>
          </Col>
        </Row>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 16 }}>
          <Button onClick={handleCancel} size="large">
            Cancel
          </Button>
          <Button
            type="primary"
            danger
            htmlType="submit"
            size="large"
            loading={registerMutation.isPending}
            style={{ fontWeight: 600 }}
          >
            Admit to Emergency
          </Button>
        </div>
      </form>
    </Modal>
  );
};
