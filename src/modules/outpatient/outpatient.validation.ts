import { z } from 'zod';

export const checkInSchema = z.object({
  patientId: z.string().min(1, 'Patient ID or MRN is required'),
  patientName: z.string().min(1, 'Patient Name is required'),
  doctorId: z.string().optional(),
  appointmentId: z.string().optional(),
});

export type CheckInInput = z.infer<typeof checkInSchema>;

export const vitalsSchema = z.object({
  temperature: z.coerce.number().min(30).max(45).optional().or(z.literal('')),
  bloodPressureSystolic: z.coerce.number().min(50).max(250).optional().or(z.literal('')),
  bloodPressureDiastolic: z.coerce.number().min(30).max(150).optional().or(z.literal('')),
  heartRate: z.coerce.number().min(30).max(220).optional().or(z.literal('')),
  respiratoryRate: z.coerce.number().min(5).max(60).optional().or(z.literal('')),
  spO2: z.coerce.number().min(50).max(100).optional().or(z.literal('')),
  weight: z.coerce.number().min(1).max(300).optional().or(z.literal('')),
  height: z.coerce.number().min(30).max(250).optional().or(z.literal('')),
});

export type VitalsInput = z.infer<typeof vitalsSchema>;

export const prescriptionItemSchema = z.object({
  medicationName: z.string().min(1, 'Medication name is required'),
  dosage: z.string().min(1, 'Dosage is required (e.g. 500mg)'),
  frequency: z.string().min(1, 'Frequency is required (e.g. TID)'),
  duration: z.string().min(1, 'Duration is required (e.g. 5 days)'),
  route: z.string(),
  instructions: z.string().optional(),
});

export const labOrderItemSchema = z.object({
  testName: z.string().min(1, 'Test name is required'),
  category: z.string().optional(),
  urgency: z.enum(['routine', 'urgent', 'stat']),
  clinicalNotes: z.string().optional(),
});

export const referralSchema = z.object({
  departmentOrFacility: z.string().min(1, 'Department or Hospital name is required'),
  reason: z.string().min(1, 'Reason for referral is required'),
  urgency: z.enum(['routine', 'urgent']),
});

export const consultationSchema = z.object({
  chiefComplaint: z.string().min(1, 'Chief complaint is required'),
  historyOfPresentIllness: z.string().optional(),
  physicalExamination: z.string().optional(),
  primaryDiagnosis: z.string().min(1, 'Primary diagnosis is required'),
  secondaryDiagnosis: z.string().optional(),
  treatmentPlan: z.string().min(1, 'Treatment plan is required'),
  prescriptions: z.array(prescriptionItemSchema),
  labOrders: z.array(labOrderItemSchema),
  referral: referralSchema.optional(),
});

export type ConsultationInput = z.infer<typeof consultationSchema>;
