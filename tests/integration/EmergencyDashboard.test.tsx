import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { EmergencyDashboardPage } from '../../src/modules/emergency/pages/EmergencyDashboardPage';
import { apiClient } from '../../src/lib/apiClient';

function renderEmergencyDashboard() {
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
        <EmergencyDashboardPage />
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe('EmergencyDashboardPage', () => {
  beforeEach(() => {
    vi.spyOn(apiClient, 'get').mockImplementation(async (url: string) => {
      if (url === '/emergency/stats') {
        return {
          data: {
            activeCases: 1,
            resuscitationCount: 1,
            veryUrgentCount: 0,
            urgentCount: 0,
            inTreatmentCount: 1,
            totalToday: 5,
            occupancyRate: 50,
          },
        } as any;
      }
      return {
        data: {
          cases: [
            {
              id: 'emg-101',
              patientId: 'PAT-2026-901',
              patientName: 'Alemayehu Tadesse',
              patientMrn: 'MRN-77312',
              isUnidentified: false,
              age: 52,
              gender: 'male',
              arrivalTime: '10:15 AM',
              arrivalMode: 'ambulance',
              chiefComplaint: 'Acute crushing substernal chest pain',
              triageCategory: 'immediate',
              status: 'in_treatment',
              assignedBay: 'Resus Bay 1',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
          ],
        },
      } as any;
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders emergency department dashboard header and KPI statistics', async () => {
    renderEmergencyDashboard();

    expect(screen.getByText(/Emergency Department \(ED\)/i)).toBeInTheDocument();
    expect(screen.getByText(/P1 RESUSCITATION/i)).toBeInTheDocument();
    expect(screen.getByText(/P2 VERY URGENT/i)).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /Register Emergency Patient/i })[0]).toBeInTheDocument();
  });



  it('renders live emergency cases in the data table', async () => {
    renderEmergencyDashboard();

    await waitFor(() => {
      expect(screen.getAllByText('Alemayehu Tadesse')[0]).toBeInTheDocument();
    });

    expect(screen.getAllByText('MRN-77312')[0]).toBeInTheDocument();
  });


  it('opens emergency registration modal on button click', async () => {
    const user = userEvent.setup();
    renderEmergencyDashboard();

    const registerBtns = screen.getAllByRole('button', { name: /Register Emergency Patient/i });
    await user.click(registerBtns[0]);


    expect(await screen.findByText('Emergency Patient Registration')).toBeInTheDocument();
    expect(
      screen.getByText(/Unidentified \/ Unconscious Casualty \(John\/Jane Doe\)/i),
    ).toBeInTheDocument();
  });
});
