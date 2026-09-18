import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { emergencyApi } from '../api/emergency.api';
import type { EmergencyFilters } from '../types';
import type {
  EmergencyDispositionInput,
  EmergencyRegistrationInput,
  TriageAssessmentInput,
} from '../emergency.validation';

export const EMERGENCY_QUERY_KEY = ['emergency', 'cases'] as const;
export const EMERGENCY_STATS_KEY = ['emergency', 'stats'] as const;

export function useEmergencyCases(filters?: EmergencyFilters) {
  return useQuery({
    queryKey: [...EMERGENCY_QUERY_KEY, filters],
    queryFn: () => emergencyApi.getCases(filters),
    refetchInterval: 15000, // Emergency department live auto-refresh every 15s
  });
}

export function useEmergencyStats() {
  return useQuery({
    queryKey: EMERGENCY_STATS_KEY,
    queryFn: () => emergencyApi.getStats(),
    refetchInterval: 15000,
  });
}

export function useEmergencyCase(id: string) {
  return useQuery({
    queryKey: ['emergency', 'case', id],
    queryFn: () => emergencyApi.getCaseById(id),
    enabled: Boolean(id),
  });
}

export function useRegisterEmergencyPatient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: EmergencyRegistrationInput) => emergencyApi.registerPatient(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EMERGENCY_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: EMERGENCY_STATS_KEY });
    },
  });
}

export function useSubmitTriage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      caseId,
      input,
    }: {
      caseId: string;
      input: TriageAssessmentInput;
    }) => emergencyApi.submitTriage(caseId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EMERGENCY_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: EMERGENCY_STATS_KEY });
    },
  });
}

export function useUpdateEmergencyDisposition() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      caseId,
      input,
    }: {
      caseId: string;
      input: EmergencyDispositionInput;
    }) => emergencyApi.updateDisposition(caseId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EMERGENCY_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: EMERGENCY_STATS_KEY });
    },
  });
}
