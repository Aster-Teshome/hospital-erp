import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { inpatientApi } from '../api/inpatient.api';
import type {
  AdmissionInput,
  BedTransferInput,
  DischargeInput,
} from '../inpatient.validation';
import type { BedStatus, InpatientFilters } from '../types';

export function useWards() {
  return useQuery({
    queryKey: ['inpatient', 'wards'],
    queryFn: () => inpatientApi.getWards(),
  });
}

export function useBeds(wardId?: string) {
  return useQuery({
    queryKey: ['inpatient', 'beds', wardId],
    queryFn: () => inpatientApi.getBeds(wardId),
  });
}

export function useInpatientAdmissions(filters?: InpatientFilters) {
  return useQuery({
    queryKey: ['inpatient', 'admissions', filters],
    queryFn: () => inpatientApi.getAdmissions(filters),
  });
}

export function useInpatientStats() {
  return useQuery({
    queryKey: ['inpatient', 'stats'],
    queryFn: () => inpatientApi.getStats(),
  });
}

export function useAdmitPatient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: AdmissionInput) => inpatientApi.admitPatient(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inpatient'] });
    },
  });
}

export function useDischargePatient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      admissionId,
      input,
    }: {
      admissionId: string;
      input: DischargeInput;
    }) => inpatientApi.dischargePatient(admissionId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inpatient'] });
    },
  });
}

export function useTransferBed() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      admissionId,
      input,
    }: {
      admissionId: string;
      input: BedTransferInput;
    }) => inpatientApi.transferBed(admissionId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inpatient'] });
    },
  });
}

export function useUpdateBedStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ bedId, status }: { bedId: string; status: BedStatus }) =>
      inpatientApi.updateBedStatus(bedId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inpatient'] });
    },
  });
}
