import axios from 'axios';
import { apiClient } from '../../../lib/apiClient';
import type {
  AdmissionInput,
  BedTransferInput,
  DischargeInput,
} from '../inpatient.validation';
import type {
  Bed,
  BedStatus,
  InpatientAdmission,
  InpatientFilters,
  InpatientStats,
  Ward,
} from '../types';

// Seed demo wards
const demoWards: Ward[] = [
  {
    id: 'ward-med',
    name: 'General Medical Ward (Floor 2)',
    code: 'GEN-MED',
    floor: 'Floor 2 - East Wing',
    department: 'Internal Medicine',
    totalBeds: 12,
    occupiedBeds: 9,
    nurseInCharge: 'Sr. Bethlehem Zewde',
  },
  {
    id: 'ward-surg',
    name: 'Surgical Inpatient Ward (Floor 3)',
    code: 'SURG-A',
    floor: 'Floor 3 - North Wing',
    department: 'General Surgery',
    totalBeds: 10,
    occupiedBeds: 7,
    nurseInCharge: 'Sr. Rahel Desta',
  },
  {
    id: 'ward-icu',
    name: 'Intensive Care Unit (ICU)',
    code: 'ICU-1',
    floor: 'Floor 1 - Critical Care',
    department: 'Critical Care Medicine',
    totalBeds: 6,
    occupiedBeds: 4,
    nurseInCharge: 'Br. Michael Assefa',
  },
  {
    id: 'ward-ped',
    name: 'Pediatric Inpatient Unit',
    code: 'PED-1',
    floor: 'Floor 2 - West Wing',
    department: 'Pediatrics',
    totalBeds: 8,
    occupiedBeds: 5,
    nurseInCharge: 'Sr. Senait Alemu',
  },
  {
    id: 'ward-mat',
    name: 'Maternity & Post-Natal Ward',
    code: 'MAT-1',
    floor: 'Floor 4 - South Wing',
    department: 'Obstetrics & Gynecology',
    totalBeds: 8,
    occupiedBeds: 4,
    nurseInCharge: 'Sr. Tigist Bekele',
  },
];

// Seed demo beds
let demoBeds: Bed[] = [
  // Medical Ward Beds
  {
    id: 'bed-med-101',
    bedNumber: 'MED-101',
    wardId: 'ward-med',
    wardName: 'General Medical Ward',
    bedType: 'standard',
    status: 'occupied',
    dailyRate: 450,
    currentPatient: {
      admissionId: 'adm-101',
      patientId: 'PAT-2026-901',
      patientName: 'Alemayehu Tadesse',
      patientMrn: 'MRN-77312',
      admissionDate: '2026-09-15 11:30 AM',
      attendingDoctor: 'Dr. Daniel Haile',
      severity: 'serious',
      admittingDiagnosis: 'Decompensated Heart Failure & Acute Pulmonary Edema',
    },
  },
  {
    id: 'bed-med-102',
    bedNumber: 'MED-102',
    wardId: 'ward-med',
    wardName: 'General Medical Ward',
    bedType: 'standard',
    status: 'occupied',
    dailyRate: 450,
    currentPatient: {
      admissionId: 'adm-102',
      patientId: 'PAT-2026-881',
      patientName: 'Almaz Kebede',
      patientMrn: 'MRN-44102',
      admissionDate: '2026-09-16 02:15 PM',
      attendingDoctor: 'Dr. Daniel Haile',
      severity: 'stable',
      admittingDiagnosis: 'Community-Acquired Pneumonia with Hypoxia',
    },
  },
  {
    id: 'bed-med-103',
    bedNumber: 'MED-103',
    wardId: 'ward-med',
    wardName: 'General Medical Ward',
    bedType: 'standard',
    status: 'available',
    dailyRate: 450,
  },
  {
    id: 'bed-med-104',
    bedNumber: 'MED-104',
    wardId: 'ward-med',
    wardName: 'General Medical Ward',
    bedType: 'standard',
    status: 'cleaning',
    dailyRate: 450,
  },
  {
    id: 'bed-med-105',
    bedNumber: 'MED-105',
    wardId: 'ward-med',
    wardName: 'General Medical Ward',
    bedType: 'isolation',
    status: 'available',
    dailyRate: 650,
  },
  {
    id: 'bed-med-106',
    bedNumber: 'MED-106',
    wardId: 'ward-med',
    wardName: 'General Medical Ward',
    bedType: 'standard',
    status: 'reserved',
    dailyRate: 450,
  },

  // ICU Beds
  {
    id: 'bed-icu-01',
    bedNumber: 'ICU-B1',
    wardId: 'ward-icu',
    wardName: 'Intensive Care Unit (ICU)',
    bedType: 'icu',
    status: 'occupied',
    dailyRate: 1800,
    currentPatient: {
      admissionId: 'adm-103',
      patientId: 'PAT-2026-902',
      patientName: 'John Doe (Trauma Unknown)',
      patientMrn: 'MRN-TEMP-902',
      admissionDate: '2026-09-18 10:45 AM',
      attendingDoctor: 'Dr. Sara Tesfaye',
      severity: 'critical',
      admittingDiagnosis: 'Severe Traumatic Brain Injury, Post-MVC, Intubated',
    },
  },
  {
    id: 'bed-icu-02',
    bedNumber: 'ICU-B2',
    wardId: 'ward-icu',
    wardName: 'Intensive Care Unit (ICU)',
    bedType: 'icu',
    status: 'occupied',
    dailyRate: 1800,
    currentPatient: {
      admissionId: 'adm-104',
      patientId: 'PAT-2026-914',
      patientName: 'Tesfaye Belay',
      patientMrn: 'MRN-55230',
      admissionDate: '2026-09-17 08:20 PM',
      attendingDoctor: 'Dr. Sara Tesfaye',
      severity: 'critical',
      admittingDiagnosis: 'Septic Shock secondary to perforated appendicitis',
    },
  },
  {
    id: 'bed-icu-03',
    bedNumber: 'ICU-B3',
    wardId: 'ward-icu',
    wardName: 'Intensive Care Unit (ICU)',
    bedType: 'icu',
    status: 'available',
    dailyRate: 1800,
  },
  {
    id: 'bed-icu-04',
    bedNumber: 'ICU-B4',
    wardId: 'ward-icu',
    wardName: 'Intensive Care Unit (ICU)',
    bedType: 'icu',
    status: 'maintenance',
    dailyRate: 1800,
  },

  // Surgical Ward Beds
  {
    id: 'bed-surg-201',
    bedNumber: 'SURG-201',
    wardId: 'ward-surg',
    wardName: 'Surgical Inpatient Ward',
    bedType: 'standard',
    status: 'occupied',
    dailyRate: 500,
    currentPatient: {
      admissionId: 'adm-105',
      patientId: 'PAT-2026-890',
      patientName: 'Kassahun Legesse',
      patientMrn: 'MRN-33019',
      admissionDate: '2026-09-17 03:00 PM',
      attendingDoctor: 'Dr. Samuel Kassa',
      severity: 'stable',
      admittingDiagnosis: 'Post-Op Open Cholecystectomy (Day 1 Recovery)',
    },
  },
  {
    id: 'bed-surg-202',
    bedNumber: 'SURG-202',
    wardId: 'ward-surg',
    wardName: 'Surgical Inpatient Ward',
    bedType: 'standard',
    status: 'available',
    dailyRate: 500,
  },
  {
    id: 'bed-surg-203',
    bedNumber: 'SURG-203',
    wardId: 'ward-surg',
    wardName: 'Surgical Inpatient Ward',
    bedType: 'standard',
    status: 'available',
    dailyRate: 500,
  },

  // Pediatric Beds
  {
    id: 'bed-ped-301',
    bedNumber: 'PED-301',
    wardId: 'ward-ped',
    wardName: 'Pediatric Inpatient Unit',
    bedType: 'pediatric',
    status: 'occupied',
    dailyRate: 400,
    currentPatient: {
      admissionId: 'adm-106',
      patientId: 'PAT-2026-772',
      patientName: 'Natnael Yohannes',
      patientMrn: 'MRN-99120',
      admissionDate: '2026-09-18 09:00 AM',
      attendingDoctor: 'Dr. Bethlehem Worku',
      severity: 'serious',
      admittingDiagnosis: 'Severe Acute Bronchiolitis with Respiratory Distress',
    },
  },
  {
    id: 'bed-ped-302',
    bedNumber: 'PED-302',
    wardId: 'ward-ped',
    wardName: 'Pediatric Inpatient Unit',
    bedType: 'pediatric',
    status: 'available',
    dailyRate: 400,
  },
];

// Seed demo admissions
let demoAdmissions: InpatientAdmission[] = [
  {
    id: 'adm-101',
    patientId: 'PAT-2026-901',
    patientName: 'Alemayehu Tadesse',
    patientMrn: 'MRN-77312',
    gender: 'male',
    age: 52,
    wardId: 'ward-med',
    wardName: 'General Medical Ward',
    bedId: 'bed-med-101',
    bedNumber: 'MED-101',
    attendingDoctor: 'Dr. Daniel Haile',
    admittingDiagnosis: 'Decompensated Heart Failure & Acute Pulmonary Edema',
    severity: 'serious',
    admissionDate: '2026-09-15 11:30 AM',
    status: 'admitted',
    admissionNotes: 'Transferred from Emergency Resus Bay 1. IV Furosemide continuous infusion, telemetry monitoring.',
    emergencyContactName: 'Marta Tadesse (Wife)',
    emergencyContactPhone: '+251 911 234567',
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'adm-102',
    patientId: 'PAT-2026-881',
    patientName: 'Almaz Kebede',
    patientMrn: 'MRN-44102',
    gender: 'female',
    age: 64,
    wardId: 'ward-med',
    wardName: 'General Medical Ward',
    bedId: 'bed-med-102',
    bedNumber: 'MED-102',
    attendingDoctor: 'Dr. Daniel Haile',
    admittingDiagnosis: 'Community-Acquired Pneumonia with Hypoxia',
    severity: 'stable',
    admissionDate: '2026-09-16 02:15 PM',
    status: 'admitted',
    admissionNotes: 'Supplemental O2 via nasal cannula at 2L/min. IV Ceftriaxone + Azithromycin.',
    emergencyContactName: 'Dawit Kebede (Son)',
    emergencyContactPhone: '+251 922 789123',
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'adm-103',
    patientId: 'PAT-2026-902',
    patientName: 'John Doe (Trauma Unknown)',
    patientMrn: 'MRN-TEMP-902',
    gender: 'male',
    age: 28,
    wardId: 'ward-icu',
    wardName: 'Intensive Care Unit (ICU)',
    bedId: 'bed-icu-01',
    bedNumber: 'ICU-B1',
    attendingDoctor: 'Dr. Sara Tesfaye',
    admittingDiagnosis: 'Severe Traumatic Brain Injury, Post-MVC, Intubated',
    severity: 'critical',
    admissionDate: '2026-09-18 10:45 AM',
    status: 'admitted',
    admissionNotes: 'Direct emergency trauma admission. ICP monitor inserted, arterial line in place.',
    createdAt: new Date(Date.now() - 4 * 3600000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'adm-104',
    patientId: 'PAT-2026-914',
    patientName: 'Tesfaye Belay',
    patientMrn: 'MRN-55230',
    gender: 'male',
    age: 41,
    wardId: 'ward-icu',
    wardName: 'Intensive Care Unit (ICU)',
    bedId: 'bed-icu-02',
    bedNumber: 'ICU-B2',
    attendingDoctor: 'Dr. Sara Tesfaye',
    admittingDiagnosis: 'Septic Shock secondary to perforated appendicitis',
    severity: 'critical',
    admissionDate: '2026-09-17 08:20 PM',
    status: 'admitted',
    admissionNotes: 'Emergency laparotomy completed. Vasopressor support weaning, broad-spectrum antibiotics.',
    createdAt: new Date(Date.now() - 16 * 3600000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'adm-105',
    patientId: 'PAT-2026-890',
    patientName: 'Kassahun Legesse',
    patientMrn: 'MRN-33019',
    gender: 'male',
    age: 38,
    wardId: 'ward-surg',
    wardName: 'Surgical Inpatient Ward',
    bedId: 'bed-surg-201',
    bedNumber: 'SURG-201',
    attendingDoctor: 'Dr. Samuel Kassa',
    admittingDiagnosis: 'Post-Op Open Cholecystectomy (Day 1 Recovery)',
    severity: 'stable',
    admissionDate: '2026-09-17 03:00 PM',
    status: 'admitted',
    admissionNotes: 'Tolerating clear fluids. Surgical wound clean and dry. Pain managed with oral analgesia.',
    emergencyContactName: 'Genet Kassa (Sister)',
    emergencyContactPhone: '+251 912 345678',
    createdAt: new Date(Date.now() - 20 * 3600000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'adm-106',
    patientId: 'PAT-2026-772',
    patientName: 'Natnael Yohannes',
    patientMrn: 'MRN-99120',
    gender: 'male',
    age: 4,
    wardId: 'ward-ped',
    wardName: 'Pediatric Inpatient Unit',
    bedId: 'bed-ped-301',
    bedNumber: 'PED-301',
    attendingDoctor: 'Dr. Bethlehem Worku',
    admittingDiagnosis: 'Severe Acute Bronchiolitis with Respiratory Distress',
    severity: 'serious',
    admissionDate: '2026-09-18 09:00 AM',
    status: 'admitted',
    admissionNotes: 'High-flow nasal cannula support (6 L/min). Salbutamol nebulization q4h.',
    emergencyContactName: 'Hanna Yohannes (Mother)',
    emergencyContactPhone: '+251 933 654321',
    createdAt: new Date(Date.now() - 5 * 3600000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const inpatientApi = {
  async getWards(): Promise<Ward[]> {
    try {
      const { data } = await apiClient.get<Ward[]>('/inpatient/wards');
      return data;
    } catch (err: unknown) {
      if (!axios.isAxiosError(err) || !err.response) {
        return demoWards;
      }
      throw err;
    }
  },

  async getBeds(wardId?: string): Promise<Bed[]> {
    try {
      const { data } = await apiClient.get<Bed[]>('/inpatient/beds', {
        params: wardId ? { wardId } : undefined,
      });
      return data;
    } catch (err: unknown) {
      if (!axios.isAxiosError(err) || !err.response) {
        if (wardId) {
          return demoBeds.filter((b) => b.wardId === wardId);
        }
        return demoBeds;
      }
      throw err;
    }
  },

  async getAdmissions(filters?: InpatientFilters): Promise<InpatientAdmission[]> {
    try {
      const { data } = await apiClient.get<InpatientAdmission[]>('/inpatient/admissions', {
        params: filters,
      });
      return data;
    } catch (err: unknown) {
      if (!axios.isAxiosError(err) || !err.response) {
        let list = [...demoAdmissions];
        if (filters?.wardId) {
          list = list.filter((a) => a.wardId === filters.wardId);
        }
        if (filters?.admissionStatus) {
          list = list.filter((a) => a.status === filters.admissionStatus);
        }
        if (filters?.search) {
          const q = filters.search.toLowerCase();
          list = list.filter(
            (a) =>
              a.patientName.toLowerCase().includes(q) ||
              a.patientMrn.toLowerCase().includes(q) ||
              a.bedNumber.toLowerCase().includes(q) ||
              a.admittingDiagnosis.toLowerCase().includes(q),
          );
        }
        return list;
      }
      throw err;
    }
  },

  async getStats(): Promise<InpatientStats> {
    try {
      const { data } = await apiClient.get<InpatientStats>('/inpatient/stats');
      return data;
    } catch (err: unknown) {
      if (!axios.isAxiosError(err) || !err.response) {
        const total = demoBeds.length;
        const occupied = demoBeds.filter((b) => b.status === 'occupied').length;
        const available = demoBeds.filter((b) => b.status === 'available').length;
        const maintenance = demoBeds.filter(
          (b) => b.status === 'maintenance' || b.status === 'cleaning',
        ).length;
        const critical = demoAdmissions.filter(
          (a) => a.status === 'admitted' && a.severity === 'critical',
        ).length;

        return {
          totalBeds: total,
          occupiedBeds: occupied,
          availableBeds: available,
          maintenanceBeds: maintenance,
          occupancyRate: total > 0 ? Math.round((occupied / total) * 100) : 0,
          todayAdmissions: 3,
          todayDischarges: 1,
          criticalCases: critical,
        };
      }
      throw err;
    }
  },

  async admitPatient(input: AdmissionInput): Promise<InpatientAdmission> {
    try {
      const { data } = await apiClient.post<InpatientAdmission>('/inpatient/admissions', input);
      return data;
    } catch (err: unknown) {
      if (!axios.isAxiosError(err) || !err.response) {
        const selectedWard = demoWards.find((w) => w.id === input.wardId);
        const selectedBed = demoBeds.find((b) => b.id === input.bedId);

        const newAdmission: InpatientAdmission = {
          id: `adm-${Date.now()}`,
          patientId: `PAT-${Math.floor(1000 + Math.random() * 9000)}`,
          patientName: input.patientName,
          patientMrn: input.patientMrn,
          gender: input.gender,
          age: input.age,
          wardId: input.wardId,
          wardName: selectedWard?.name || 'Inpatient Ward',
          bedId: input.bedId,
          bedNumber: selectedBed?.bedNumber || 'BED-TEMP',
          attendingDoctor: input.attendingDoctor,
          admittingDiagnosis: input.admittingDiagnosis,
          severity: input.severity,
          admissionDate: new Date().toLocaleString(),
          status: 'admitted',
          admissionNotes: input.admissionNotes,
          emergencyContactName: input.emergencyContactName,
          emergencyContactPhone: input.emergencyContactPhone,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        demoAdmissions.unshift(newAdmission);

        // Update bed status to occupied
        demoBeds = demoBeds.map((b) =>
          b.id === input.bedId
            ? {
                ...b,
                status: 'occupied',
                currentPatient: {
                  admissionId: newAdmission.id,
                  patientId: newAdmission.patientId,
                  patientName: newAdmission.patientName,
                  patientMrn: newAdmission.patientMrn,
                  admissionDate: newAdmission.admissionDate,
                  attendingDoctor: newAdmission.attendingDoctor,
                  severity: newAdmission.severity,
                  admittingDiagnosis: newAdmission.admittingDiagnosis,
                },
              }
            : b,
        );

        return newAdmission;
      }
      throw err;
    }
  },

  async dischargePatient(admissionId: string, input: DischargeInput): Promise<InpatientAdmission> {
    try {
      const { data } = await apiClient.post<InpatientAdmission>(
        `/inpatient/admissions/${admissionId}/discharge`,
        input,
      );
      return data;
    } catch (err: unknown) {
      if (!axios.isAxiosError(err) || !err.response) {
        const admission = demoAdmissions.find((a) => a.id === admissionId);
        if (!admission) throw new Error('Admission not found');

        admission.status = 'discharged';
        admission.dischargeDate = new Date().toLocaleString();
        admission.dischargeCondition = input.dischargeCondition;
        admission.dischargeSummary = input.dischargeSummary;
        admission.followUpInstructions = input.followUpInstructions;
        admission.dischargeMedications = input.dischargeMedications;
        admission.updatedAt = new Date().toISOString();

        // Release the bed to cleaning
        demoBeds = demoBeds.map((b) =>
          b.id === admission.bedId
            ? {
                ...b,
                status: 'cleaning',
                currentPatient: undefined,
              }
            : b,
        );

        return admission;
      }
      throw err;
    }
  },

  async transferBed(admissionId: string, input: BedTransferInput): Promise<InpatientAdmission> {
    try {
      const { data } = await apiClient.post<InpatientAdmission>(
        `/inpatient/admissions/${admissionId}/transfer`,
        input,
      );
      return data;
    } catch (err: unknown) {
      if (!axios.isAxiosError(err) || !err.response) {
        const admission = demoAdmissions.find((a) => a.id === admissionId);
        if (!admission) throw new Error('Admission not found');

        const oldBedId = admission.bedId;
        const targetWard = demoWards.find((w) => w.id === input.targetWardId);
        const targetBed = demoBeds.find((b) => b.id === input.targetBedId);

        // Update admission
        admission.wardId = input.targetWardId;
        admission.wardName = targetWard?.name || admission.wardName;
        admission.bedId = input.targetBedId;
        admission.bedNumber = targetBed?.bedNumber || admission.bedNumber;
        admission.updatedAt = new Date().toISOString();

        // Release old bed to cleaning
        demoBeds = demoBeds.map((b) => {
          if (b.id === oldBedId) {
            return { ...b, status: 'cleaning', currentPatient: undefined };
          }
          if (b.id === input.targetBedId) {
            return {
              ...b,
              status: 'occupied',
              currentPatient: {
                admissionId: admission.id,
                patientId: admission.patientId,
                patientName: admission.patientName,
                patientMrn: admission.patientMrn,
                admissionDate: admission.admissionDate,
                attendingDoctor: admission.attendingDoctor,
                severity: admission.severity,
                admittingDiagnosis: admission.admittingDiagnosis,
              },
            };
          }
          return b;
        });

        return admission;
      }
      throw err;
    }
  },

  async updateBedStatus(bedId: string, status: BedStatus): Promise<Bed> {
    try {
      const { data } = await apiClient.patch<Bed>(`/inpatient/beds/${bedId}/status`, { status });
      return data;
    } catch (err: unknown) {
      if (!axios.isAxiosError(err) || !err.response) {
        const bed = demoBeds.find((b) => b.id === bedId);
        if (!bed) throw new Error('Bed not found');
        bed.status = status;
        if (status === 'available') {
          bed.currentPatient = undefined;
        }
        return bed;
      }
      throw err;
    }
  },
};
