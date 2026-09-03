import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, Button, Form, Input } from 'antd';
import { Controller, useForm } from 'react-hook-form';
import { registerSchema, type RegisterInput } from '../auth.validation';

interface RegisterFormProps {
  onSubmit: (values: RegisterInput) => void;
  isSubmitting: boolean;
  errorMessage?: string;
}

export function RegisterForm({ onSubmit, isSubmitting, errorMessage }: RegisterFormProps) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      hospitalName: '',
      email: '',
      password: '',
      firstName: '',
      lastName: '',
    },
  });

  return (
    <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
      {errorMessage && (
        <Form.Item>
          <Alert type="error" showIcon title={errorMessage} />
        </Form.Item>
      )}

      <Form.Item
        label="Hospital name"
        htmlFor="hospitalName"
        validateStatus={errors.hospitalName ? 'error' : ''}
        help={errors.hospitalName?.message}
      >
        <Controller
          name="hospitalName"
          control={control}
          render={({ field }) => <Input {...field} id="hospitalName" />}
        />
      </Form.Item>

      <Form.Item
        label="First name"
        htmlFor="firstName"
        validateStatus={errors.firstName ? 'error' : ''}
        help={errors.firstName?.message}
      >
        <Controller name="firstName" control={control} render={({ field }) => <Input {...field} id="firstName" />} />
      </Form.Item>

      <Form.Item
        label="Last name"
        htmlFor="lastName"
        validateStatus={errors.lastName ? 'error' : ''}
        help={errors.lastName?.message}
      >
        <Controller name="lastName" control={control} render={({ field }) => <Input {...field} id="lastName" />} />
      </Form.Item>

      <Form.Item
        label="Email"
        htmlFor="email"
        validateStatus={errors.email ? 'error' : ''}
        help={errors.email?.message}
      >
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <Input {...field} id="email" placeholder="you@hospital.com" autoComplete="email" />
          )}
        />
      </Form.Item>

      <Form.Item
        label="Password"
        htmlFor="password"
        validateStatus={errors.password ? 'error' : ''}
        help={errors.password?.message}
      >
        <Controller
          name="password"
          control={control}
          render={({ field }) => <Input.Password {...field} id="password" autoComplete="new-password" />}
        />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={isSubmitting} block>
          Register hospital
        </Button>
      </Form.Item>
    </Form>
  );
}
