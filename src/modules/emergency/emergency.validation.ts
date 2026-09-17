import { z } from 'zod';

export const emergencyRegistrationSchema = z.object({
  patientName: z.string().min(2, 'Patient name or temporary descriptor is required'),
  isUnidentified: z.boolean(),
  age: z.coerce

    .number({ invalid_type_error: 'Age must be a number' })
    .min(0, 'Age cannot be negative')
    .max(130, 'Please enter a valid age')
    .optional(),
  gender: z.enum(['male', 'female', 'other'], {
    required_error: 'Gender is required',
  }),
  arrivalMode: z.enum(['ambulance', 'walk_in', 'police', 'referral'], {
    required_error: 'Arrival mode is required',
  }),
  chiefComplaint: z.string().min(3, 'Chief complaint must be at least 3 characters'),
  accompaniedBy: z.string().optional(),
  contactPhone: z.string().optional(),
  initialObservations: z.string().optional(),
});

export type EmergencyRegistrationInput = z.infer<typeof emergencyRegistrationSchema>;

export const triageAssessmentSchema = z.object({
  triageCategory: z.enum(['immediate', 'very_urgent', 'urgent', 'standard', 'non_urgent'], {
    required_error: 'Triage priority category is required',
  }),
  assignedBay: z.string().min(1, 'Please select an Emergency Bay or Bed'),
  assignedDoctor: z.string().optional(),
  temperature: z.coerce
    .number()
    .min(25, 'Temperature too low (<25°C)')
    .max(45, 'Temperature too high (>45°C)')
    .optional(),
  bloodPressureSystolic: z.coerce
    .number()
    .min(40, 'Systolic BP too low (<40)')
    .max(300, 'Systolic BP too high (>300)')
    .optional(),
  bloodPressureDiastolic: z.coerce
    .number()
    .min(20, 'Diastolic BP too low (<20)')
    .max(200, 'Diastolic BP too high (>200)')
    .optional(),
  heartRate: z.coerce
    .number()
    .min(20, 'Heart rate too low (<20)')
    .max(260, 'Heart rate too high (>260)')
    .optional(),
  respiratoryRate: z.coerce
    .number()
    .min(4, 'Respiratory rate too low (<4)')
    .max(80, 'Respiratory rate too high (>80)')
    .optional(),
  spO2: z.coerce
    .number()
    .min(40, 'SpO2 must be at least 40%')
    .max(100, 'SpO2 cannot exceed 100%')
    .optional(),
  gcs: z.coerce
    .number()
    .min(3, 'GCS minimum is 3 (unresponsive)')
    .max(15, 'GCS maximum is 15 (fully alert)')
    .optional(),
  painScore: z.coerce
    .number()
    .min(0, 'Pain score minimum is 0')
    .max(10, 'Pain score maximum is 10')
    .optional(),
  bloodGlucose: z.coerce
    .number()
    .min(10, 'Glucose minimum 10 mg/dL')
    .max(1000, 'Glucose maximum 1000 mg/dL')
    .optional(),
  triageNotes: z.string().min(3, 'Clinical triage notes are required'),
  immediateInterventions: z.string().optional(),
});

export type TriageAssessmentInput = z.infer<typeof triageAssessmentSchema>;

export const emergencyDispositionSchema = z.object({
  status: z.enum(['in_treatment', 'admitted', 'discharged', 'transferred'], {
    required_error: 'Status update is required',
  }),
  clinicalSummary: z.string().min(3, 'Clinical summary is required'),
  dispositionOutcome: z.string().optional(),
  transferFacility: z.string().optional(),
});

export type EmergencyDispositionInput = z.infer<typeof emergencyDispositionSchema>;
