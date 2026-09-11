export type AppointmentStatus =
  | 'scheduled'
  | 'confirmed'
  | 'checked_in'
  | 'completed'
  | 'cancelled'
  | 'no_show';

export type AppointmentType =
  | 'consultation'
  | 'follow_up'
  | 'routine_checkup'
  | 'emergency';

export interface Appointment {
  id: string;
  hospitalId: string;
  patientId: string;
  doctorId: string;
  patientName?: string;
  patientMrn?: string;
  doctorName?: string;
  doctorSpecialty?: string;
  appointmentDate: string; // ISO date string: 'YYYY-MM-DD'
  startTime: string; // 'HH:mm' e.g. '09:00'
  endTime: string; // 'HH:mm' e.g. '09:30'
  type: AppointmentType;
  status: AppointmentStatus;
  reason?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DoctorSchedule {
  id: string;
  hospitalId: string;
  doctorId: string;
  doctorName?: string;
  dayOfWeek: number; // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  startTime: string; // '08:00'
  endTime: string; // '17:00'
  slotDurationMinutes: number; // e.g. 30
  isAvailable: boolean;
}

export interface AppointmentFilters {
  doctorId?: string;
  patientId?: string;
  date?: string;
  status?: AppointmentStatus;
  search?: string;
  page?: number;
  limit?: number;
}
