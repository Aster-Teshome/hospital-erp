import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { appointmentsApi } from '../api/appointments.api';
import type { AppointmentFilters, AppointmentStatus } from '../types';
import type { BookAppointmentInput, DoctorScheduleInput } from '../appointments.validation';

export const APPOINTMENTS_QUERY_KEY = ['appointments'] as const;
export const DOCTOR_SCHEDULES_QUERY_KEY = ['doctorSchedules'] as const;

/**
 * Fetch appointments list with optional filters (status, doctor, patient, date)
 */
export function useAppointments(filters?: AppointmentFilters) {
  return useQuery({
    queryKey: [...APPOINTMENTS_QUERY_KEY, filters],
    queryFn: () => appointmentsApi.getAll(filters),
  });
}

/**
 * Fetch single appointment details
 */
export function useAppointment(id: string) {
  return useQuery({
    queryKey: [...APPOINTMENTS_QUERY_KEY, id],
    queryFn: () => appointmentsApi.getById(id),
    enabled: Boolean(id),
  });
}

/**
 * Mutation to book a new appointment
 */
export function useBookAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: BookAppointmentInput) => appointmentsApi.book(input),
    onSuccess: () => {
      // Invalidate appointments cache so the table refreshes automatically
      queryClient.invalidateQueries({ queryKey: APPOINTMENTS_QUERY_KEY });
    },
  });
}

/**
 * Mutation to change an appointment status (e.g. check-in, complete)
 */
export function useUpdateAppointmentStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: AppointmentStatus }) =>
      appointmentsApi.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: APPOINTMENTS_QUERY_KEY });
    },
  });
}

/**
 * Mutation to cancel an appointment with an optional reason
 */
export function useCancelAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) =>
      appointmentsApi.cancel(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: APPOINTMENTS_QUERY_KEY });
    },
  });
}

/**
 * Fetch doctor working schedules
 */
export function useDoctorSchedules(doctorId?: string) {
  return useQuery({
    queryKey: [...DOCTOR_SCHEDULES_QUERY_KEY, doctorId],
    queryFn: () => appointmentsApi.getDoctorSchedules(doctorId),
  });
}

/**
 * Save or update doctor working schedule
 */
export function useSaveDoctorSchedule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: DoctorScheduleInput) => appointmentsApi.saveDoctorSchedule(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DOCTOR_SCHEDULES_QUERY_KEY });
    },
  });
}
