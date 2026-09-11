import { createBrowserRouter } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { AuthLayout } from '../components/layout/AuthLayout';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { LoginPage } from '../modules/auth/pages/LoginPage';
import { RegisterPage } from '../modules/auth/pages/RegisterPage';
import { DashboardPage } from '../modules/dashboard/pages/DashboardPage';

import { AppointmentsPage } from '../modules/appointments/pages/AppointmentsPage';
import { OutpatientQueuePage } from '../modules/outpatient/pages/OutpatientQueuePage';

/**
 * Route tree: public auth pages under AuthLayout, everything else behind
 * ProtectedRoute + AppLayout. Add a new module's routes as children of the
 * ProtectedRoute element below, and a matching nav entry in AppLayout.tsx.
 */
export const router = createBrowserRouter([
  {
    element: <AuthLayout />,
    children: [
      { path: '/login', element: <LoginPage /> },
      { path: '/register', element: <RegisterPage /> },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { path: '/', element: <DashboardPage /> },
          { path: '/appointments', element: <AppointmentsPage /> },
          { path: '/outpatient', element: <OutpatientQueuePage /> },
        ],
      },
    ],
  },
]);
