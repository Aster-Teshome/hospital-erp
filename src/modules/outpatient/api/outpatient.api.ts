import { apiClient } from '../../../lib/apiClient';
import type { OpdFilters, OpdVisit, VitalSigns, ConsultationRecord } from '../types';
import type { CheckInInput, ConsultationInput, VitalsInput } from '../outpatient.validation';

export const outpatientApi = {
  async getQueue(filters?: OpdFilters): Promise<OpdVisit[]> {
    const { data } = await apiClient.get<{ visits: OpdVisit[] } | OpdVisit[]>('/outpatient/visits', {
      params: filters,
    });
    return Array.isArray(data) ? data : data.visits;
  },

  async getVisitById(id: string): Promise<OpdVisit> {
    const { data } = await apiClient.get<{ visit: OpdVisit } | OpdVisit>(`/outpatient/visits/${id}`);
    return 'visit' in data ? data.visit : data;
  },

  async checkIn(input: CheckInInput): Promise<OpdVisit> {
    const { data } = await apiClient.post<{ visit: OpdVisit } | OpdVisit>(
      '/outpatient/check-in',
      input,
    );
    return 'visit' in data ? data.visit : data;
  },

  async recordVitals(visitId: string, vitals: VitalsInput): Promise<VitalSigns> {
    const { data } = await apiClient.post<{ vitals: VitalSigns } | VitalSigns>(
      `/outpatient/visits/${visitId}/vitals`,
      vitals,
    );
    return 'vitals' in data ? data.vitals : data;
  },

  async saveConsultation(visitId: string, consultation: ConsultationInput): Promise<ConsultationRecord> {
    const { data } = await apiClient.post<{ consultation: ConsultationRecord } | ConsultationRecord>(
      `/outpatient/visits/${visitId}/consultation`,
      consultation,
    );
    return 'consultation' in data ? data.consultation : data;
  },

  async completeVisit(visitId: string): Promise<OpdVisit> {
    const { data } = await apiClient.post<{ visit: OpdVisit } | OpdVisit>(
      `/outpatient/visits/${visitId}/complete`,
    );
    return 'visit' in data ? data.visit : data;
  },
};
