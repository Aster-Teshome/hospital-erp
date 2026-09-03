import { Card, Typography } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { RegisterForm } from '../components/RegisterForm';
import { useRegister } from '../hooks/auth.hooks';
import type { RegisterInput } from '../auth.validation';
import { extractErrorMessage } from '../../../utils/extractErrorMessage';

export function RegisterPage() {
  const navigate = useNavigate();
  const register = useRegister();

  function handleSubmit(values: RegisterInput) {
    register.mutate(values, { onSuccess: () => navigate('/', { replace: true }) });
  }

  return (
    <Card style={{ width: 440 }}>
      <Typography.Title level={3} style={{ textAlign: 'center', marginTop: 0 }}>
        Register your hospital
      </Typography.Title>

      <RegisterForm
        onSubmit={handleSubmit}
        isSubmitting={register.isPending}
        errorMessage={extractErrorMessage(register.error)}
      />

      <Typography.Paragraph style={{ textAlign: 'center', marginBottom: 0 }} type="secondary">
        Already have an account? <Link to="/login">Log in</Link>
      </Typography.Paragraph>
    </Card>
  );
}
