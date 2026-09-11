import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { outpatientApi } from '../api/outpatient.api';
import type { OpdFilters } from '../types';
import type { CheckInInput, ConsultationInput, VitalsInput } from '../outpatient.validation';

export const OPD_QUERY_KEY = ['outpatient', 'visits'] as const;

export function useOpdQueue(filters?: OpdFilters) {
  return useQuery({
    queryKey: [...OPD_QUERY_KEY, filters],
    queryFn: () => outpatientApi.getQueue(filters),
  });
}

export function useOpdVisit(id: string) {
  return useQuery({
    queryKey: ['outpatient', 'visit', id],
    queryFn: () => outpatientApi.getVisitById(id),
    enabled: Boolean(id),
  });
}

export function useCheckInPatient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CheckInInput) => outpatientApi.checkIn(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: OPD_QUERY_KEY });
    },
  });
}

export function useRecordVitals() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ visitId, vitals }: { visitId: string; vitals: VitalsInput }) =>
      outpatientApi.recordVitals(visitId, vitals),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: OPD_QUERY_KEY });
    },
  });
}

export function useSaveConsultation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      visitId,
      consultation,
    }: {
      visitId: string;
      consultation: ConsultationInput;
    }) => outpatientApi.saveConsultation(visitId, consultation),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: OPD_QUERY_KEY });
    },
  });
}

export function useCompleteVisit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (visitId: string) => outpatientApi.completeVisit(visitId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: OPD_QUERY_KEY });
    },
  });
}
