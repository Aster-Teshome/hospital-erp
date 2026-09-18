import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { InpatientDashboardPage } from '../../src/modules/inpatient/pages/InpatientDashboardPage';
import { apiClient } from '../../src/lib/apiClient';

function renderInpatientDashboard() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <InpatientDashboardPage />
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe('InpatientDashboardPage', () => {
  beforeEach(() => {
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
              id: 'bed-med-101',
              bedNumber: 'MED-101',
              wardId: 'ward-med',
              wardName: 'General Medical Ward',
              bedType: 'standard',
              status: 'occupied',
              dailyRate: 450,
              currentPatient: {
                admissionId: 'adm-101',
                patientId: 'PAT-2026-901',
                patientName: 'Alemayehu Tadesse',
                patientMrn: 'MRN-77312',
                admissionDate: '2026-09-15 11:30 AM',
                attendingDoctor: 'Dr. Daniel Haile',
                severity: 'serious',
                admittingDiagnosis: 'Decompensated Heart Failure',
              },
            },
            {
              id: 'bed-med-102',
              bedNumber: 'MED-102',
              wardId: 'ward-med',
              wardName: 'General Medical Ward',
              bedType: 'standard',
              status: 'available',
              dailyRate: 450,
            },
          ],
        } as any;
      }

      if (url === '/inpatient/admissions') {
        return {
          data: [
            {
              id: 'adm-101',
              patientId: 'PAT-2026-901',
              patientName: 'Alemayehu Tadesse',
              patientMrn: 'MRN-77312',
              gender: 'male',
              age: 52,
              wardId: 'ward-med',
              wardName: 'General Medical Ward',
              bedId: 'bed-med-101',
              bedNumber: 'MED-101',
              attendingDoctor: 'Dr. Daniel Haile',
              admittingDiagnosis: 'Decompensated Heart Failure',
              severity: 'serious',
              admissionDate: '2026-09-15 11:30 AM',
              status: 'admitted',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
          ],
        } as any;
      }

      return { data: [] } as any;
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders inpatient workstation header and KPI statistics', async () => {
    renderInpatientDashboard();

    expect(
      screen.getByText('Inpatient (IPD) & Ward Management'),
    ).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Total Ward Beds')).toBeInTheDocument();
      expect(screen.getByText('Available Beds')).toBeInTheDocument();
      expect(screen.getAllByText('General Medical Ward')[0]).toBeInTheDocument();
    });
  });

  it('renders interactive bed management grid with bed numbers and patient info', async () => {
    renderInpatientDashboard();

    await waitFor(() => {
      expect(screen.getByText('MED-101')).toBeInTheDocument();
      expect(screen.getByText('Alemayehu Tadesse')).toBeInTheDocument();
      expect(screen.getByText('MRN-77312')).toBeInTheDocument();
      expect(screen.getByText('MED-102')).toBeInTheDocument();
      expect(screen.getByText('Bed Ready for Admission')).toBeInTheDocument();
    });
  });

  it('opens admission modal when clicking Admit Patient button', async () => {
    const user = userEvent.setup();
    renderInpatientDashboard();

    const admitBtns = screen.getAllByTestId('admit-patient-btn');
    expect(admitBtns.length).toBeGreaterThan(0);

    await user.click(admitBtns[0]);

    expect(await screen.findByText('Inpatient Patient Admission')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/e.g. Bethlehem Tesfaye/i)).toBeInTheDocument();
  });

  it('opens discharge modal when clicking Discharge on an occupied bed', async () => {
    const user = userEvent.setup();
    renderInpatientDashboard();

    await waitFor(() => {
      expect(screen.getAllByText('Alemayehu Tadesse')[0]).toBeInTheDocument();
    });

    const dischargeBtns = screen.getAllByTestId('discharge-bed-btn');
    expect(dischargeBtns.length).toBeGreaterThan(0);

    await user.click(dischargeBtns[0]);

    expect(await screen.findByText('Inpatient Clinical Discharge')).toBeInTheDocument();
    expect(screen.getByText(/Condition on Discharge/i)).toBeInTheDocument();
  });
});
