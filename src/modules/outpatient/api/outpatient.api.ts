import axios from 'axios';
import { apiClient } from '../../../lib/apiClient';
import type { OpdFilters, OpdVisit, VitalSigns, ConsultationRecord } from '../types';
import type { CheckInInput, ConsultationInput, VitalsInput } from '../outpatient.validation';

// In-memory demo store for when backend is offline
const demoVisits: OpdVisit[] = [
  {
    id: 'opd-101',
    patientId: 'PAT-2026-001',
    patientName: 'Almaz Bekele',
    patientMrn: 'MRN-88421',
    patientAge: 34,
    patientGender: 'female',
    doctorId: 'doc-1',
    doctorName: 'Dr. Abebe Kebede',
    checkInTime: '08:45 AM',
    status: 'vitals_done',
    vitals: {
      patientId: 'PAT-2026-001',
      visitId: 'opd-101',
      temperature: 37.2,
      bloodPressureSystolic: 125,
      bloodPressureDiastolic: 82,
      heartRate: 76,
      respiratoryRate: 16,
      spO2: 98,
      weight: 64,
      height: 165,
      recordedAt: new Date().toISOString(),
    },
  },
  {
    id: 'opd-102',
    patientId: 'PAT-2026-004',
    patientName: 'Kassahun Tadesse',
    patientMrn: 'MRN-44102',
    patientAge: 48,
    patientGender: 'male',
    doctorId: 'doc-1',
    doctorName: 'Dr. Abebe Kebede',
    checkInTime: '09:15 AM',
    status: 'waiting',
  },
  {
    id: 'opd-103',
    patientId: 'PAT-2026-005',
    patientName: 'Selamawit Girma',
    patientMrn: 'MRN-55230',
    patientAge: 29,
    patientGender: 'female',
    doctorId: 'doc-2',
    doctorName: 'Dr. Sara Tesfaye',
    checkInTime: '09:30 AM',
    status: 'in_consultation',
    vitals: {
      patientId: 'PAT-2026-005',
      visitId: 'opd-103',
      temperature: 36.8,
      bloodPressureSystolic: 118,
      bloodPressureDiastolic: 78,
      heartRate: 70,
      respiratoryRate: 14,
      spO2: 99,
      weight: 58,
      height: 160,
      recordedAt: new Date().toISOString(),
    },
  },
];

export const outpatientApi = {
  async getQueue(filters?: OpdFilters): Promise<OpdVisit[]> {
    try {
      const { data } = await apiClient.get<{ visits: OpdVisit[] } | OpdVisit[]>('/outpatient/visits', {
        params: filters,
      });
      return Array.isArray(data) ? data : data.visits;
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && !err.response) {
        let result = [...demoVisits];
        if (filters?.status) result = result.filter((v) => v.status === filters.status);
        if (filters?.doctorId) result = result.filter((v) => v.doctorId === filters.doctorId);
        return result;
      }
      throw err;
    }
  },

  async getVisitById(id: string): Promise<OpdVisit> {
    try {
      const { data } = await apiClient.get<{ visit: OpdVisit } | OpdVisit>(`/outpatient/visits/${id}`);
      return 'visit' in data ? data.visit : data;
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && !err.response) {
        const found = demoVisits.find((v) => v.id === id);
        if (found) return found;
      }
      throw err;
    }
  },

  async checkIn(input: CheckInInput): Promise<OpdVisit> {
    try {
      const { data } = await apiClient.post<{ visit: OpdVisit } | OpdVisit>(
        '/outpatient/check-in',
        input,
      );
      return 'visit' in data ? data.visit : data;
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && !err.response) {
        const doctorNames: Record<string, string> = {
          'doc-1': 'Dr. Abebe Kebede',
          'doc-2': 'Dr. Sara Tesfaye',
          'doc-3': 'Dr. Daniel Haile',
          'doc-4': 'Dr. Tigist Mengistu',
        };
        const newVisit: OpdVisit = {
          id: `opd-${Date.now()}`,
          patientId: input.patientId,
          patientName: input.patientName,
          patientMrn: `MRN-${Math.floor(10000 + Math.random() * 90000)}`,
          doctorId: input.doctorId ?? 'doc-1',
          doctorName: doctorNames[input.doctorId ?? 'doc-1'],
          checkInTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: 'waiting',
        };
        demoVisits.unshift(newVisit);
        return newVisit;
      }
      throw err;
    }
  },

  async recordVitals(visitId: string, vitals: VitalsInput): Promise<VitalSigns> {
    try {
      const { data } = await apiClient.post<{ vitals: VitalSigns } | VitalSigns>(
        `/outpatient/visits/${visitId}/vitals`,
        vitals,
      );
      return 'vitals' in data ? data.vitals : data;
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && !err.response) {
        const found = demoVisits.find((v) => v.id === visitId);
        const recordedVitals: VitalSigns = {
          visitId,
          patientId: found?.patientId ?? 'PAT-UNKNOWN',
          temperature: typeof vitals.temperature === 'number' ? vitals.temperature : undefined,
          bloodPressureSystolic: typeof vitals.bloodPressureSystolic === 'number' ? vitals.bloodPressureSystolic : undefined,
          bloodPressureDiastolic: typeof vitals.bloodPressureDiastolic === 'number' ? vitals.bloodPressureDiastolic : undefined,
          heartRate: typeof vitals.heartRate === 'number' ? vitals.heartRate : undefined,
          respiratoryRate: typeof vitals.respiratoryRate === 'number' ? vitals.respiratoryRate : undefined,
          spO2: typeof vitals.spO2 === 'number' ? vitals.spO2 : undefined,
          weight: typeof vitals.weight === 'number' ? vitals.weight : undefined,
          height: typeof vitals.height === 'number' ? vitals.height : undefined,
          recordedAt: new Date().toISOString(),
        };
        if (found) {
          found.vitals = recordedVitals;
          found.status = 'vitals_done';
        }
        return recordedVitals;
      }
      throw err;
    }
  },

  async saveConsultation(visitId: string, consultation: ConsultationInput): Promise<ConsultationRecord> {
    try {
      const { data } = await apiClient.post<{ consultation: ConsultationRecord } | ConsultationRecord>(
        `/outpatient/visits/${visitId}/consultation`,
        consultation,
      );
      return 'consultation' in data ? data.consultation : data;
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && !err.response) {
        const found = demoVisits.find((v) => v.id === visitId);
        const savedConsultation: ConsultationRecord = {
          id: `cons-${Date.now()}`,
          visitId,
          patientId: found?.patientId ?? 'PAT-UNKNOWN',
          doctorId: found?.doctorId ?? 'doc-1',
          chiefComplaint: consultation.chiefComplaint,
          historyOfPresentIllness: consultation.historyOfPresentIllness,
          physicalExamination: consultation.physicalExamination,
          primaryDiagnosis: consultation.primaryDiagnosis,
          secondaryDiagnosis: consultation.secondaryDiagnosis,
          treatmentPlan: consultation.treatmentPlan,
          prescriptions: consultation.prescriptions ?? [],
          labOrders: consultation.labOrders ?? [],
          referral: consultation.referral,
          createdAt: new Date().toISOString(),
        };
        if (found) {
          found.consultation = savedConsultation;
          found.status = 'completed';
        }
        return savedConsultation;
      }
      throw err;
    }
  },

  async completeVisit(visitId: string): Promise<OpdVisit> {
    try {
      const { data } = await apiClient.post<{ visit: OpdVisit } | OpdVisit>(
        `/outpatient/visits/${visitId}/complete`,
      );
      return 'visit' in data ? data.visit : data;
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && !err.response) {
        const found = demoVisits.find((v) => v.id === visitId);
        if (found) {
          found.status = 'completed';
          return { ...found };
        }
      }
      throw err;
    }
  },
};
