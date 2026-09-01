import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, Button, Form, Input } from 'antd';
import { Controller, useForm } from 'react-hook-form';
import { loginSchema, type LoginInput } from '../auth.validation';

interface LoginFormProps {
  onSubmit: (values: LoginInput) => void;
  isSubmitting: boolean;
  errorMessage?: string;
}

export function LoginForm({ onSubmit, isSubmitting, errorMessage }: LoginFormProps) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  return (
    <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
      {errorMessage && (
        <Form.Item>
          <Alert type="error" showIcon title={errorMessage} />
        </Form.Item>
      )}

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
            <Input {...field} id="email" placeholder="you@hotel.com" autoComplete="email" />
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
          render={({ field }) => <Input.Password {...field} id="password" autoComplete="current-password" />}
        />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={isSubmitting} block>
          Log in
        </Button>
      </Form.Item>
    </Form>
  );
}
