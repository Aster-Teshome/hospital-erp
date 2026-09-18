export type BedStatus = 'available' | 'occupied' | 'cleaning' | 'maintenance' | 'reserved';

export type BedType = 'standard' | 'icu' | 'isolation' | 'pediatric' | 'maternity' | 'deluxe';

export type InpatientStatus = 'admitted' | 'discharged' | 'transferred';

export type PatientSeverity = 'stable' | 'serious' | 'critical';

export type DischargeCondition = 'recovered' | 'improved' | 'transferred' | 'against_advice';

export interface Ward {
  id: string;
  name: string;
  code: string; // e.g., 'GEN-MED', 'SURG-A', 'ICU-1', 'PED-1', 'MAT-1'
  floor: string; // e.g., 'Floor 1', 'Floor 2', 'Floor 3'
  department: string;
  totalBeds: number;
  occupiedBeds: number;
  nurseInCharge?: string;
}

export interface Bed {
  id: string;
  bedNumber: string; // e.g., 'MW-101', 'ICU-04'
  wardId: string;
  wardName: string;
  bedType: BedType;
  status: BedStatus;
  dailyRate?: number;
  currentPatient?: {
    admissionId: string;
    patientId: string;
    patientName: string;
    patientMrn: string;
    admissionDate: string;
    attendingDoctor: string;
    severity: PatientSeverity;
    admittingDiagnosis: string;
  };
}

export interface InpatientAdmission {
  id: string;
  patientId: string;
  patientName: string;
  patientMrn: string;
  gender: 'male' | 'female' | 'other';
  age: number;
  wardId: string;
  wardName: string;
  bedId: string;
  bedNumber: string;
  attendingDoctor: string;
  admittingDiagnosis: string;
  severity: PatientSeverity;
  admissionDate: string;
  status: InpatientStatus;
  admissionNotes?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  dischargeDate?: string;
  dischargeCondition?: DischargeCondition;
  dischargeSummary?: string;
  followUpInstructions?: string;
  dischargeMedications?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InpatientStats {
  totalBeds: number;
  occupiedBeds: number;
  availableBeds: number;
  maintenanceBeds: number;
  occupancyRate: number; // percentage (e.g. 78)
  todayAdmissions: number;
  todayDischarges: number;
  criticalCases: number;
}

export interface InpatientFilters {
  wardId?: string;
  bedStatus?: BedStatus;
  bedType?: BedType;
  admissionStatus?: InpatientStatus;
  search?: string;
}
