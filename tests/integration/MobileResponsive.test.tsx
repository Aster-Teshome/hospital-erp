import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { AppLayout } from '../../src/components/layout/AppLayout';
import { DashboardPage } from '../../src/modules/dashboard/pages/DashboardPage';
import { InpatientDashboardPage } from '../../src/modules/inpatient/pages/InpatientDashboardPage';
import { apiClient } from '../../src/lib/apiClient';
import { useAuthStore } from '../../src/modules/auth/store/auth.store';

function renderAppWithRoutes(initialRoute = '/') {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[initialRoute]}>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/inpatient" element={<InpatientDashboardPage />} />
            <Route path="/emergency" element={<div>Emergency Module</div>} />
            <Route path="/outpatient" element={<div>Outpatient Module</div>} />
            <Route path="/appointments" element={<div>Appointments Module</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe('Mobile Responsive Layout & Workstations', () => {
  const originalInnerWidth = window.innerWidth;

  beforeEach(() => {
    // Set authenticated user
    useAuthStore.setState({
      user: {
        id: 'u-1',
        email: 'nurse.sarah@smartech-demo.test',
        firstName: 'Sarah',
        lastName: 'Connor',
        role: 'nurse' as any,
        isActive: true,
        createdAt: '2026-09-01T00:00:00Z',
        updatedAt: '2026-09-01T00:00:00Z',
      },
      tokens: {
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token',
      },
      isAuthenticated: true,
    });

    vi.spyOn(apiClient, 'get').mockImplementation(async (url: string) => {
      if (url === '/inpatient/stats') {
        return {
          data: {
            totalBeds: 20,
            occupiedBeds: 12,
            availableBeds: 6,
            maintenanceBeds: 2,
            occupancyRate: 60,
            todayAdmissions: 2,
            todayDischarges: 1,
            criticalCases: 2,
          },
        } as any;
      }

      if (url === '/inpatient/wards') {
        return {
          data: [
            {
              id: 'ward-med',
              name: 'General Medical Ward (Floor 2)',
              code: 'GEN-MED',
              floor: 'Floor 2',
              department: 'Internal Medicine',
              totalBeds: 12,
              occupiedBeds: 8,
            },
          ],
        } as any;
      }

      if (url === '/inpatient/beds') {
        return {
          data: [
            {
              id: 'bed-101',
              bedNumber: 'B-101',
              wardId: 'ward-med',
              wardName: 'General Medical Ward (Floor 2)',
              bedType: 'standard',
              status: 'available',
              dailyRate: 150,
            },
          ],
        } as any;
      }

      if (url === '/inpatient/admissions') {
        return {
          data: [],
        } as any;
      }

      return { data: [] } as any;
    });
  });

  afterEach(() => {
    // Restore window width
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: originalInnerWidth,
    });
    vi.restoreAllMocks();
  });

  it('renders mobile navigation button and opens drawer on mobile viewports (375px)', async () => {
    // Simulate iPhone viewport
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 375,
    });
    window.dispatchEvent(new Event('resize'));

    renderAppWithRoutes('/');

    // Verify Central Hospital ERP title is visible
    expect(screen.getByText('Central Hospital ERP')).toBeInTheDocument();

    // Verify navigation hamburger button exists for mobile
    const menuBtn = screen.getByRole('button', { name: /open navigation menu/i });
    expect(menuBtn).toBeInTheDocument();

    // Click to open mobile navigation drawer
    await userEvent.click(menuBtn);

    // Verify clinical modules are present inside mobile drawer
    await waitFor(() => {
      expect(screen.getAllByText('Emergency (ED)').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Inpatient (IPD)').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Outpatient (OPD)').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Appointments').length).toBeGreaterThan(0);
    });
  });

  it('renders all 4 clinical workstations on Dashboard including newly added Inpatient card', async () => {
    renderAppWithRoutes('/');

    expect(screen.getAllByText(/Clinical Workstations & Department Access/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText('Emergency (ED)').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Inpatient (IPD)').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Outpatient (OPD)').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Appointments').length).toBeGreaterThan(0);
  });

  it('adapts Inpatient Workstation and Bed map on mobile viewports', async () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 390,
    });
    window.dispatchEvent(new Event('resize'));

    renderAppWithRoutes('/inpatient');

    // Verify workstation header loads
    await waitFor(() => {
      expect(screen.getByText('Inpatient (IPD) & Ward Management')).toBeInTheDocument();
      expect(screen.getByText(/LIVE BEDS/i)).toBeInTheDocument();
    });

    // Verify Admit button and refresh buttons are rendered
    expect(screen.getByTestId('admit-patient-btn')).toBeInTheDocument();

    // Verify bed grid card is rendered
    await waitFor(() => {
      expect(screen.getByText('B-101')).toBeInTheDocument();
      expect(screen.getByText(/Admit to Bed/i)).toBeInTheDocument();
    });
  });
});
