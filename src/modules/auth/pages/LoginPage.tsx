import { Card, Typography } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { LoginForm } from '../components/LoginForm';
import { useLogin } from '../hooks/auth.hooks';
import type { LoginInput } from '../auth.validation';
import { extractErrorMessage } from '../../../utils/extractErrorMessage';

export function LoginPage() {
  const navigate = useNavigate();
  const login = useLogin();

  function handleSubmit(values: LoginInput) {
    login.mutate(values, { onSuccess: () => navigate('/', { replace: true }) });
  }

  return (
    <Card style={{ width: 400 }}>
      <Typography.Title level={3} style={{ textAlign: 'center', marginTop: 0 }}>
        HMS Sign in
      </Typography.Title>

      <LoginForm
        onSubmit={handleSubmit}
        isSubmitting={login.isPending}
        errorMessage={extractErrorMessage(login.error)}
      />

      <Typography.Paragraph style={{ textAlign: 'center', marginBottom: 0 }} type="secondary">
        Setting up a new hospital? <Link to="/register">Register it</Link>
      </Typography.Paragraph>

      <Typography.Paragraph style={{ textAlign: 'center', marginTop: 8, marginBottom: 0 }} type="secondary">
        Seeded demo login: admin@smartech-demo.test / ChangeMe123!
      </Typography.Paragraph>
    </Card>
  );
}
