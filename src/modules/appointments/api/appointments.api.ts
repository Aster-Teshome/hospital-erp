import axios from 'axios';
import { apiClient } from '../../../lib/apiClient';
import type { Appointment, AppointmentFilters, AppointmentStatus, DoctorSchedule } from '../types';
import type { BookAppointmentInput, DoctorScheduleInput } from '../appointments.validation';

// In-memory demo store for when backend is offline
const demoAppointments: Appointment[] = [
  {
    id: 'apt-001',
    hospitalId: 'hosp-1',
    patientId: 'PAT-2026-001',
    patientName: 'Almaz Bekele',
    patientMrn: 'MRN-88421',
    doctorId: 'doc-1',
    doctorName: 'Dr. Abebe Kebede',
    doctorSpecialty: 'Internal Medicine',
    appointmentDate: new Date().toISOString().split('T')[0],
    startTime: '09:00',
    endTime: '09:30',
    type: 'consultation',
    status: 'confirmed',
    reason: 'Recurring headaches and occasional dizziness for 2 weeks.',
    notes: 'Patient requested morning slot.',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'apt-002',
    hospitalId: 'hosp-1',
    patientId: 'PAT-2026-002',
    patientName: 'Dawit Kebede',
    patientMrn: 'MRN-77319',
    doctorId: 'doc-2',
    doctorName: 'Dr. Sara Tesfaye',
    doctorSpecialty: 'Pediatrics',
    appointmentDate: new Date().toISOString().split('T')[0],
    startTime: '10:30',
    endTime: '11:00',
    type: 'follow_up',
    status: 'scheduled',
    reason: 'Post-treatment pediatric checkup for mild bronchitis.',
    createdAt: new Date(Date.now() - 43200000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'apt-003',
    hospitalId: 'hosp-1',
    patientId: 'PAT-2026-003',
    patientName: 'Meron Hailu',
    patientMrn: 'MRN-99120',
    doctorId: 'doc-3',
    doctorName: 'Dr. Daniel Haile',
    doctorSpecialty: 'General Surgery',
    appointmentDate: new Date().toISOString().split('T')[0],
    startTime: '14:00',
    endTime: '14:30',
    type: 'routine_checkup',
    status: 'checked_in',
    reason: 'Routine abdominal consultation and ultrasound review.',
    createdAt: new Date(Date.now() - 21600000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const demoSchedules: DoctorSchedule[] = [
  {
    id: 'sch-1',
    hospitalId: 'hosp-1',
    doctorId: 'doc-1',
    doctorName: 'Dr. Abebe Kebede',
    dayOfWeek: 1, // Monday
    startTime: '08:30',
    endTime: '16:30',
    slotDurationMinutes: 30,
    isAvailable: true,
  },
  {
    id: 'sch-2',
    hospitalId: 'hosp-1',
    doctorId: 'doc-1',
    doctorName: 'Dr. Abebe Kebede',
    dayOfWeek: 3, // Wednesday
    startTime: '08:30',
    endTime: '16:30',
    slotDurationMinutes: 30,
    isAvailable: true,
  },
  {
    id: 'sch-3',
    hospitalId: 'hosp-1',
    doctorId: 'doc-2',
    doctorName: 'Dr. Sara Tesfaye',
    dayOfWeek: 2, // Tuesday
    startTime: '09:00',
    endTime: '15:00',
    slotDurationMinutes: 20,
    isAvailable: true,
  },
];

export const appointmentsApi = {
  async getAll(filters?: AppointmentFilters): Promise<Appointment[]> {
    try {
      const { data } = await apiClient.get<{ appointments: Appointment[] } | Appointment[]>(
        '/appointments',
        { params: filters },
      );
      return Array.isArray(data) ? data : data.appointments;
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && !err.response) {
        let result = [...demoAppointments];
        if (filters?.status) result = result.filter((a) => a.status === filters.status);
        if (filters?.doctorId) result = result.filter((a) => a.doctorId === filters.doctorId);
        if (filters?.date) result = result.filter((a) => a.appointmentDate === filters.date);
        return result;
      }
      throw err;
    }
  },

  async getById(id: string): Promise<Appointment> {
    try {
      const { data } = await apiClient.get<{ appointment: Appointment } | Appointment>(
        `/appointments/${id}`,
      );
      return 'appointment' in data ? data.appointment : data;
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && !err.response) {
        const found = demoAppointments.find((a) => a.id === id);
        if (found) return found;
      }
      throw err;
    }
  },

  async book(input: BookAppointmentInput): Promise<Appointment> {
    try {
      const { data } = await apiClient.post<{ appointment: Appointment } | Appointment>(
        '/appointments',
        input,
      );
      return 'appointment' in data ? data.appointment : data;
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && !err.response) {
        const doctorNames: Record<string, string> = {
          'doc-1': 'Dr. Abebe Kebede',
          'doc-2': 'Dr. Sara Tesfaye',
          'doc-3': 'Dr. Daniel Haile',
          'doc-4': 'Dr. Tigist Mengistu',
        };
        const newApt: Appointment = {
          id: `apt-${Date.now()}`,
          hospitalId: 'hosp-1',
          patientId: input.patientId,
          patientName: input.patientId.startsWith('PAT-') ? 'Registered Patient' : input.patientId,
          patientMrn: `MRN-${Math.floor(10000 + Math.random() * 90000)}`,
          doctorId: input.doctorId,
          doctorName: doctorNames[input.doctorId] ?? 'Attending Doctor',
          appointmentDate: input.appointmentDate,
          startTime: input.startTime,
          endTime: input.endTime ?? '10:00',
          type: input.type,
          status: 'scheduled',
          reason: input.reason,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        demoAppointments.unshift(newApt);
        return newApt;
      }
      throw err;
    }
  },

  async updateStatus(id: string, status: AppointmentStatus): Promise<Appointment> {
    try {
      const { data } = await apiClient.patch<{ appointment: Appointment } | Appointment>(
        `/appointments/${id}/status`,
        { status },
      );
      return 'appointment' in data ? data.appointment : data;
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && !err.response) {
        const found = demoAppointments.find((a) => a.id === id);
        if (found) {
          found.status = status;
          found.updatedAt = new Date().toISOString();
          return { ...found };
        }
      }
      throw err;
    }
  },

  async cancel(id: string, reason?: string): Promise<Appointment> {
    try {
      const { data } = await apiClient.post<{ appointment: Appointment } | Appointment>(
        `/appointments/${id}/cancel`,
        { reason },
      );
      return 'appointment' in data ? data.appointment : data;
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && !err.response) {
        const found = demoAppointments.find((a) => a.id === id);
        if (found) {
          found.status = 'cancelled';
          found.notes = reason ? `Cancelled: ${reason}` : 'Cancelled';
          found.updatedAt = new Date().toISOString();
          return { ...found };
        }
      }
      throw err;
    }
  },

  async getDoctorSchedules(doctorId?: string): Promise<DoctorSchedule[]> {
    try {
      const { data } = await apiClient.get<{ schedules: DoctorSchedule[] } | DoctorSchedule[]>(
        '/appointments/schedules',
        { params: doctorId ? { doctorId } : undefined },
      );
      return Array.isArray(data) ? data : data.schedules;
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && !err.response) {
        return doctorId
          ? demoSchedules.filter((s) => s.doctorId === doctorId)
          : demoSchedules;
      }
      throw err;
    }
  },

  async saveDoctorSchedule(input: DoctorScheduleInput): Promise<DoctorSchedule> {
    try {
      const { data } = await apiClient.post<{ schedule: DoctorSchedule } | DoctorSchedule>(
        '/appointments/schedules',
        input,
      );
      return 'schedule' in data ? data.schedule : data;
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && !err.response) {
        const newSched: DoctorSchedule = {
          id: `sch-${Date.now()}`,
          hospitalId: 'hosp-1',
          ...input,
        };
        demoSchedules.push(newSched);
        return newSched;
      }
      throw err;
    }
  },
};
