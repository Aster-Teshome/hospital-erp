import { apiClient } from '../../../lib/apiClient';
import type { Appointment, AppointmentFilters, AppointmentStatus, DoctorSchedule } from '../types';
import type { BookAppointmentInput, DoctorScheduleInput } from '../appointments.validation';

/**
 * Data-access layer for appointments: pure async functions that call the backend
 * via `apiClient`. Contains no component state or hooks.
 */
export const appointmentsApi = {
  async getAll(filters?: AppointmentFilters): Promise<Appointment[]> {
    const { data } = await apiClient.get<{ appointments: Appointment[] } | Appointment[]>(
      '/appointments',
      { params: filters },
    );
    // Handles both { appointments: [...] } or direct array [...] from API
    return Array.isArray(data) ? data : data.appointments;
  },

  async getById(id: string): Promise<Appointment> {
    const { data } = await apiClient.get<{ appointment: Appointment } | Appointment>(
      `/appointments/${id}`,
    );
    return 'appointment' in data ? data.appointment : data;
  },

  async book(input: BookAppointmentInput): Promise<Appointment> {
    const { data } = await apiClient.post<{ appointment: Appointment } | Appointment>(
      '/appointments',
      input,
    );
    return 'appointment' in data ? data.appointment : data;
  },

  async updateStatus(id: string, status: AppointmentStatus): Promise<Appointment> {
    const { data } = await apiClient.patch<{ appointment: Appointment } | Appointment>(
      `/appointments/${id}/status`,
      { status },
    );
    return 'appointment' in data ? data.appointment : data;
  },

  async cancel(id: string, reason?: string): Promise<Appointment> {
    const { data } = await apiClient.post<{ appointment: Appointment } | Appointment>(
      `/appointments/${id}/cancel`,
      { reason },
    );
    return 'appointment' in data ? data.appointment : data;
  },

  async getDoctorSchedules(doctorId?: string): Promise<DoctorSchedule[]> {
    const { data } = await apiClient.get<{ schedules: DoctorSchedule[] } | DoctorSchedule[]>(
      '/appointments/schedules',
      { params: doctorId ? { doctorId } : undefined },
    );
    return Array.isArray(data) ? data : data.schedules;
  },

  async saveDoctorSchedule(input: DoctorScheduleInput): Promise<DoctorSchedule> {
    const { data } = await apiClient.post<{ schedule: DoctorSchedule } | DoctorSchedule>(
      '/appointments/schedules',
      input,
    );
    return 'schedule' in data ? data.schedule : data;
  },
};
