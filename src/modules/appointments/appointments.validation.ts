import { z } from 'zod';

export const bookAppointmentSchema = z.object({
  patientId: z.string().min(1, 'Please select a patient'),
  doctorId: z.string().min(1, 'Please select a doctor'),
  appointmentDate: z.string().min(1, 'Please choose a date'),
  startTime: z.string().min(1, 'Please select a start time'),
  endTime: z.string().optional(),
  type: z.enum(['consultation', 'follow_up', 'routine_checkup', 'emergency']),
  reason: z.string().max(500, 'Reason cannot exceed 500 characters').optional(),
});

export type BookAppointmentInput = z.infer<typeof bookAppointmentSchema>;

export const doctorScheduleSchema = z.object({
  doctorId: z.string().min(1, 'Doctor ID is required'),
  dayOfWeek: z.number().min(0).max(6),
  startTime: z.string().min(1, 'Start time is required'),
  endTime: z.string().min(1, 'End time is required'),
  slotDurationMinutes: z.number().min(10).max(120).default(30),
  isAvailable: z.boolean().default(true),
});

export type DoctorScheduleInput = z.infer<typeof doctorScheduleSchema>;
