export type TriageCategory =
  | 'immediate' // Priority 1: Red (Resuscitation / immediate life threat)
  | 'very_urgent' // Priority 2: Orange (Emergent, < 10 mins)
  | 'urgent' // Priority 3: Yellow (Urgent, < 60 mins)
  | 'standard' // Priority 4: Green (Less urgent / Ambulatory)
  | 'non_urgent'; // Priority 5: Blue (Non-urgent)

export type EmergencyStatus =
  | 'registered' // Arrived, awaiting triage
  | 'triaged' // Triage complete, waiting for ED physician
  | 'in_treatment' // In emergency treatment bay / resus room
  | 'admitted' // Transferred to Inpatient ward / ICU
  | 'discharged' // Stabilized & discharged home
  | 'transferred'; // Transferred to tertiary facility

export type ArrivalMode = 'ambulance' | 'walk_in' | 'police' | 'referral';

export interface EmergencyVitals {
  temperature?: number; // °C
  bloodPressureSystolic?: number; // mmHg
  bloodPressureDiastolic?: number; // mmHg
  heartRate?: number; // bpm
  respiratoryRate?: number; // breaths/min
  spO2?: number; // %
  gcs?: number; // Glasgow Coma Scale (3 - 15)
  painScore?: number; // 0 - 10
  bloodGlucose?: number; // mg/dL
  recordedAt: string;
  recordedBy?: string;
}

export interface EmergencyCase {
  id: string;
  patientId: string;
  patientName: string;
  patientMrn: string;
  isUnidentified: boolean;
  age?: number;
  gender: 'male' | 'female' | 'other';
  arrivalTime: string;
  arrivalMode: ArrivalMode;
  chiefComplaint: string;
  accompaniedBy?: string;
  contactPhone?: string;
  triageCategory?: TriageCategory;
  triageNurse?: string;
  triageTime?: string;
  status: EmergencyStatus;
  assignedDoctor?: string;
  assignedDoctorName?: string;
  assignedBay?: string; // e.g., 'Resus Bay 1', 'Trauma Bay 2', 'Acute Bed 4'
  vitals?: EmergencyVitals;
  triageNotes?: string;
  immediateInterventions?: string;
  clinicalSummary?: string;
  dispositionOutcome?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EmergencyFilters {
  triageCategory?: TriageCategory;
  status?: EmergencyStatus;
  arrivalMode?: ArrivalMode;
  search?: string;
}

export interface EmergencyStats {
  activeCases: number;
  resuscitationCount: number; // Priority 1 Red
  veryUrgentCount: number; // Priority 2 Orange
  urgentCount: number; // Priority 3 Yellow
  inTreatmentCount: number;
  totalToday: number;
  occupancyRate: number; // %
}
