import axios from 'axios';
import { apiClient } from '../../../lib/apiClient';
import type {
  EmergencyCase,
  EmergencyFilters,
  EmergencyStats,
  EmergencyVitals,
} from '../types';
import type {
  EmergencyDispositionInput,
  EmergencyRegistrationInput,
  TriageAssessmentInput,
} from '../emergency.validation';

// Seed demo emergency cases for offline/presentation resilience
const demoEmergencyCases: EmergencyCase[] = [
  {
    id: 'emg-101',
    patientId: 'PAT-2026-901',
    patientName: 'Alemayehu Tadesse',
    patientMrn: 'MRN-77312',
    isUnidentified: false,
    age: 52,
    gender: 'male',
    arrivalTime: '10:15 AM',
    arrivalMode: 'ambulance',
    chiefComplaint: 'Acute crushing substernal chest pain radiating to left jaw, diaphoresis',
    accompaniedBy: 'EMS Paramedic Team Alpha',
    contactPhone: '+251 911 234567',
    triageCategory: 'immediate',
    triageNurse: 'Sr. Bethlehem Zewde',
    triageTime: '10:18 AM',
    status: 'in_treatment',
    assignedDoctor: 'doc-1',
    assignedDoctorName: 'Dr. Daniel Haile (ED Physician)',
    assignedBay: 'Resus Bay 1',
    vitals: {
      temperature: 37.1,
      bloodPressureSystolic: 88,
      bloodPressureDiastolic: 54,
      heartRate: 118,
      respiratoryRate: 26,
      spO2: 91,
      gcs: 14,
      painScore: 9,
      bloodGlucose: 142,
      recordedAt: new Date(Date.now() - 35 * 60000).toISOString(),
      recordedBy: 'Sr. Bethlehem Zewde',
    },
    triageNotes: 'Immediate STEMI alert triggered. IV access x2 secured, O2 via NRB at 10L/min, 12-lead ECG dispatched.',
    immediateInterventions: 'High-flow Oxygen, Aspirin 300mg chewed, Nitroglycerin sublingual withheld due to hypotension.',
    createdAt: new Date(Date.now() - 45 * 60000).toISOString(),
    updatedAt: new Date(Date.now() - 20 * 60000).toISOString(),
  },
  {
    id: 'emg-102',
    patientId: 'PAT-2026-902',
    patientName: 'John Doe (Trauma Unknown)',
    patientMrn: 'MRN-TEMP-902',
    isUnidentified: true,
    age: 28,
    gender: 'male',
    arrivalTime: '10:40 AM',
    arrivalMode: 'ambulance',
    chiefComplaint: 'High-speed motor vehicle collision victim, blunt polytrauma, altered mental status',
    accompaniedBy: 'Federal Police & Red Cross',
    triageCategory: 'immediate',
    triageNurse: 'Sr. Bethlehem Zewde',
    triageTime: '10:43 AM',
    status: 'in_treatment',
    assignedDoctor: 'doc-2',
    assignedDoctorName: 'Dr. Sara Tesfaye (Trauma Lead)',
    assignedBay: 'Trauma Bay 2',
    vitals: {
      temperature: 36.2,
      bloodPressureSystolic: 95,
      bloodPressureDiastolic: 60,
      heartRate: 124,
      respiratoryRate: 24,
      spO2: 93,
      gcs: 9,
      painScore: 8,
      bloodGlucose: 110,
      recordedAt: new Date(Date.now() - 15 * 60000).toISOString(),
      recordedBy: 'Sr. Bethlehem Zewde',
    },
    triageNotes: 'C-spine collar immobilized. Unresponsive to verbal stimuli, active scalp laceration with controlled bleeding.',
    immediateInterventions: 'C-collar, Pelvic binder placed, 2L warm Ringer Lactate initiated, urgent CT Trauma protocol called.',
    createdAt: new Date(Date.now() - 20 * 60000).toISOString(),
    updatedAt: new Date(Date.now() - 10 * 60000).toISOString(),
  },
  {
    id: 'emg-103',
    patientId: 'PAT-2026-903',
    patientName: 'Hanna Mekonnen',
    patientMrn: 'MRN-33019',
    isUnidentified: false,
    age: 24,
    gender: 'female',
    arrivalTime: '10:50 AM',
    arrivalMode: 'walk_in',
    chiefComplaint: 'Severe acute asthma exacerbation, audible wheezing, unable to speak in full sentences',
    accompaniedBy: 'Mother (Tigist Hailu)',
    contactPhone: '+251 922 789012',
    triageCategory: 'very_urgent',
    triageNurse: 'Br. Michael Assefa',
    triageTime: '10:53 AM',
    status: 'triaged',
    assignedBay: 'Acute Bay 3',
    vitals: {
      temperature: 36.9,
      bloodPressureSystolic: 132,
      bloodPressureDiastolic: 84,
      heartRate: 112,
      respiratoryRate: 28,
      spO2: 92,
      gcs: 15,
      painScore: 4,
      bloodGlucose: 98,
      recordedAt: new Date(Date.now() - 8 * 60000).toISOString(),
      recordedBy: 'Br. Michael Assefa',
    },
    triageNotes: 'Marked intercostal retractions. Nebulization urgently indicated.',
    immediateInterventions: 'Salbutamol + Ipratropium nebulization started, O2 4L via nasal cannula.',
    createdAt: new Date(Date.now() - 12 * 60000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 60000).toISOString(),
  },
  {
    id: 'emg-104',
    patientId: 'PAT-2026-904',
    patientName: 'Getachew Wolde',
    patientMrn: 'MRN-88104',
    isUnidentified: false,
    age: 63,
    gender: 'male',
    arrivalTime: '11:05 AM',
    arrivalMode: 'walk_in',
    chiefComplaint: 'Right lower quadrant abdominal pain x 18 hours, fever and vomiting',
    accompaniedBy: 'Brother',
    contactPhone: '+251 930 456789',
    status: 'registered',
    createdAt: new Date(Date.now() - 5 * 60000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 60000).toISOString(),
  },
  {
    id: 'emg-105',
    patientId: 'PAT-2026-905',
    patientName: 'Rahel Desta',
    patientMrn: 'MRN-55921',
    isUnidentified: false,
    age: 19,
    gender: 'female',
    arrivalTime: '09:30 AM',
    arrivalMode: 'walk_in',
    chiefComplaint: 'Right wrist deformity and swelling after slip and fall',
    contactPhone: '+251 911 888777',
    triageCategory: 'standard',
    triageNurse: 'Br. Michael Assefa',
    triageTime: '09:38 AM',
    status: 'discharged',
    assignedDoctor: 'doc-3',
    assignedDoctorName: 'Dr. Tigist Mengistu',
    assignedBay: 'Minor Procedure Bay 1',
    vitals: {
      temperature: 36.6,
      bloodPressureSystolic: 120,
      bloodPressureDiastolic: 76,
      heartRate: 78,
      respiratoryRate: 16,
      spO2: 99,
      gcs: 15,
      painScore: 6,
      recordedAt: new Date(Date.now() - 80 * 60000).toISOString(),
    },
    triageNotes: 'Distal pulse palpable, capillary refill < 2s. Wrist X-ray ordered.',
    dispositionOutcome: 'Distal radius fracture reduced, backslab cast applied, discharged with orthopedic OPD follow-up in 1 week.',
    createdAt: new Date(Date.now() - 90 * 60000).toISOString(),
    updatedAt: new Date(Date.now() - 30 * 60000).toISOString(),
  },
];

export const emergencyApi = {
  async getCases(filters?: EmergencyFilters): Promise<EmergencyCase[]> {
    try {
      const { data } = await apiClient.get<{ cases: EmergencyCase[] } | EmergencyCase[]>(
        '/emergency/cases',
        { params: filters },
      );
      return Array.isArray(data) ? data : data.cases;
    } catch (err: unknown) {
      if (!axios.isAxiosError(err) || !err.response) {
        let result = [...demoEmergencyCases];
        if (filters?.status) {
          result = result.filter((c) => c.status === filters.status);
        }
        if (filters?.triageCategory) {
          result = result.filter((c) => c.triageCategory === filters.triageCategory);
        }
        if (filters?.arrivalMode) {
          result = result.filter((c) => c.arrivalMode === filters.arrivalMode);
        }
        if (filters?.search) {
          const q = filters.search.toLowerCase();
          result = result.filter(
            (c) =>
              c.patientName.toLowerCase().includes(q) ||
              c.patientMrn.toLowerCase().includes(q) ||
              c.chiefComplaint.toLowerCase().includes(q) ||
              (c.assignedBay && c.assignedBay.toLowerCase().includes(q)),
          );
        }
        return result;
      }
      throw err;
    }
  },

  async getStats(): Promise<EmergencyStats> {
    try {
      const { data } = await apiClient.get<EmergencyStats>('/emergency/stats');
      return data;
    } catch (err: unknown) {
      if (!axios.isAxiosError(err) || !err.response) {
        const active = demoEmergencyCases.filter(
          (c) => c.status !== 'discharged' && c.status !== 'admitted' && c.status !== 'transferred',
        );
        return {
          activeCases: active.length,
          resuscitationCount: active.filter((c) => c.triageCategory === 'immediate').length,
          veryUrgentCount: active.filter((c) => c.triageCategory === 'very_urgent').length,
          urgentCount: active.filter((c) => c.triageCategory === 'urgent').length,
          inTreatmentCount: active.filter((c) => c.status === 'in_treatment').length,
          totalToday: demoEmergencyCases.length + 18,
          occupancyRate: Math.min(100, Math.round((active.length / 15) * 100)),
        };
      }
      throw err;
    }
  },

  async getCaseById(id: string): Promise<EmergencyCase> {
    try {
      const { data } = await apiClient.get<{ case: EmergencyCase } | EmergencyCase>(
        `/emergency/cases/${id}`,
      );
      return 'case' in data ? data.case : data;
    } catch (err: unknown) {
      if (!axios.isAxiosError(err) || !err.response) {
        const found = demoEmergencyCases.find((c) => c.id === id);
        if (found) return found;
      }
      throw err;
    }
  },

  async registerPatient(input: EmergencyRegistrationInput): Promise<EmergencyCase> {
    try {
      const { data } = await apiClient.post<{ case: EmergencyCase } | EmergencyCase>(
        '/emergency/register',
        input,
      );
      return 'case' in data ? data.case : data;
    } catch (err: unknown) {
      if (!axios.isAxiosError(err) || !err.response) {
        const randomMrn = input.isUnidentified
          ? `MRN-TEMP-${Math.floor(100 + Math.random() * 900)}`
          : `MRN-${Math.floor(10000 + Math.random() * 90000)}`;

        const newCase: EmergencyCase = {
          id: `emg-${Date.now()}`,
          patientId: `PAT-2026-${Math.floor(100 + Math.random() * 900)}`,
          patientName: input.isUnidentified ? `Unidentified (${input.patientName})` : input.patientName,
          patientMrn: randomMrn,
          isUnidentified: input.isUnidentified,
          age: input.age,
          gender: input.gender,
          arrivalTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          arrivalMode: input.arrivalMode,
          chiefComplaint: input.chiefComplaint,
          accompaniedBy: input.accompaniedBy,
          contactPhone: input.contactPhone,
          status: 'registered',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        demoEmergencyCases.unshift(newCase);
        return newCase;
      }
      throw err;
    }
  },

  async submitTriage(caseId: string, input: TriageAssessmentInput): Promise<EmergencyCase> {
    try {
      const { data } = await apiClient.post<{ case: EmergencyCase } | EmergencyCase>(
        `/emergency/cases/${caseId}/triage`,
        input,
      );
      return 'case' in data ? data.case : data;
    } catch (err: unknown) {
      if (!axios.isAxiosError(err) || !err.response) {
        const found = demoEmergencyCases.find((c) => c.id === caseId);
        if (found) {
          const vitals: EmergencyVitals = {
            temperature: input.temperature,
            bloodPressureSystolic: input.bloodPressureSystolic,
            bloodPressureDiastolic: input.bloodPressureDiastolic,
            heartRate: input.heartRate,
            respiratoryRate: input.respiratoryRate,
            spO2: input.spO2,
            gcs: input.gcs,
            painScore: input.painScore,
            bloodGlucose: input.bloodGlucose,
            recordedAt: new Date().toISOString(),
            recordedBy: 'Sr. Triage Nurse',
          };

          const doctorNames: Record<string, string> = {
            'doc-1': 'Dr. Daniel Haile (ED Physician)',
            'doc-2': 'Dr. Sara Tesfaye (Trauma Lead)',
            'doc-3': 'Dr. Tigist Mengistu (Emergency Specialist)',
          };

          found.triageCategory = input.triageCategory;
          found.assignedBay = input.assignedBay;
          found.assignedDoctor = input.assignedDoctor;
          found.assignedDoctorName = input.assignedDoctor
            ? doctorNames[input.assignedDoctor] || 'Assigned ED Doctor'
            : undefined;
          found.vitals = vitals;
          found.triageNotes = input.triageNotes;
          found.immediateInterventions = input.immediateInterventions;
          found.triageNurse = 'Sr. Triage Nurse';
          found.triageTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          found.status = input.triageCategory === 'immediate' ? 'in_treatment' : 'triaged';
          found.updatedAt = new Date().toISOString();
          return { ...found };
        }
      }
      throw err;
    }
  },

  async updateDisposition(
    caseId: string,
    input: EmergencyDispositionInput,
  ): Promise<EmergencyCase> {
    try {
      const { data } = await apiClient.patch<{ case: EmergencyCase } | EmergencyCase>(
        `/emergency/cases/${caseId}/disposition`,
        input,
      );
      return 'case' in data ? data.case : data;
    } catch (err: unknown) {
      if (!axios.isAxiosError(err) || !err.response) {
        const found = demoEmergencyCases.find((c) => c.id === caseId);
        if (found) {
          found.status = input.status;
          found.clinicalSummary = input.clinicalSummary;
          found.dispositionOutcome = input.dispositionOutcome;
          found.updatedAt = new Date().toISOString();
          return { ...found };
        }
      }
      throw err;
    }
  },
};
