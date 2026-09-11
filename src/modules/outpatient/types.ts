export type OpdVisitStatus =
  | 'waiting'
  | 'vitals_done'
  | 'in_consultation'
  | 'completed'
  | 'cancelled';

export interface VitalSigns {
  id?: string;
  patientId: string;
  visitId?: string;
  temperature?: number; // Celsius e.g. 36.5
  bloodPressureSystolic?: number; // mmHg e.g. 120
  bloodPressureDiastolic?: number; // mmHg e.g. 80
  heartRate?: number; // bpm e.g. 72
  respiratoryRate?: number; // breaths/min e.g. 16
  spO2?: number; // oxygen saturation % e.g. 98
  weight?: number; // kg
  height?: number; // cm
  recordedAt: string;
  recordedBy?: string;
}

export interface PrescriptionItem {
  medicationName: string;
  dosage: string; // e.g. "500mg"
  frequency: string; // e.g. "TID (Three times a day)"
  duration: string; // e.g. "5 days"
  route: string; // e.g. "Oral", "IV", "Topical"
  instructions?: string;
}

export interface LabOrderItem {
  testName: string;
  category?: string; // "Hematology", "Biochemistry", "Microbiology"
  urgency: 'routine' | 'urgent' | 'stat';
  clinicalNotes?: string;
}

export interface ReferralDetails {
  departmentOrFacility: string;
  reason: string;
  urgency: 'routine' | 'urgent';
}

export interface ConsultationRecord {
  id: string;
  visitId: string;
  patientId: string;
  doctorId: string;
  chiefComplaint: string;
  historyOfPresentIllness?: string;
  physicalExamination?: string;
  primaryDiagnosis: string;
  secondaryDiagnosis?: string;
  treatmentPlan: string;
  prescriptions: PrescriptionItem[];
  labOrders: LabOrderItem[];
  referral?: ReferralDetails;
  createdAt: string;
}

export interface OpdVisit {
  id: string;
  patientId: string;
  patientName: string;
  patientMrn: string;
  patientAge?: number;
  patientGender?: 'male' | 'female' | 'other';
  doctorId?: string;
  doctorName?: string;
  appointmentId?: string;
  checkInTime: string;
  status: OpdVisitStatus;
  vitals?: VitalSigns;
  consultation?: ConsultationRecord;
}

export interface OpdFilters {
  status?: OpdVisitStatus;
  doctorId?: string;
  search?: string;
  date?: string;
}
