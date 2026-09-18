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
    <Card
      style={{
        width: '100%',
        borderRadius: 18,
        border: '1px solid rgba(255, 255, 255, 0.12)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.08)',
        background: '#ffffff',
        padding: '8px 4px',
      }}
    >
      {/* Brand Header */}
      <div style={{ textAlign: 'center', marginBottom: 24, marginTop: 8 }}>
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: 12,
            background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            fontWeight: 800,
            fontSize: 26,
            marginBottom: 14,
            boxShadow: '0 4px 16px rgba(2, 132, 199, 0.4)',
          }}
        >
          +
        </div>
        <Typography.Title
          level={3}
          style={{
            margin: 0,
            fontWeight: 800,
            color: '#0f172a',
            letterSpacing: '-0.02em',
            fontSize: 22,
          }}
        >
          HMS Sign in
        </Typography.Title>
        <Typography.Text type="secondary" style={{ fontSize: 13, display: 'block', marginTop: 4 }}>
          Central Hospital Clinical Enterprise EMR
        </Typography.Text>
      </div>

      <LoginForm
        onSubmit={handleSubmit}
        isSubmitting={login.isPending}
        errorMessage={extractErrorMessage(login.error)}
      />

      <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid #f1f5f9', textAlign: 'center' }}>
        <Typography.Paragraph style={{ marginBottom: 8, fontSize: 13 }} type="secondary">
          Setting up a new hospital? <Link to="/register" style={{ fontWeight: 600, color: '#0284c7' }}>Register it</Link>
        </Typography.Paragraph>

        <div
          style={{
            padding: '8px 12px',
            background: '#f8fafc',
            borderRadius: 8,
            border: '1px solid #e2e8f0',
            fontSize: 11,
            color: '#64748b',
            display: 'inline-block',
          }}
        >
          Demo credentials: <strong style={{ color: '#0f172a' }}>admin@smartech-demo.test</strong> / <span className="clinical-mono" style={{ color: '#0284c7', fontWeight: 600 }}>ChangeMe123!</span>
        </div>
      </div>
    </Card>
  );
}
