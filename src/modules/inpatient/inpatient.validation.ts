import { z } from 'zod';

export const admissionSchema = z.object({
  patientName: z.string().min(2, 'Patient name must be at least 2 characters'),
  patientMrn: z.string().min(3, 'MRN must be at least 3 characters'),
  gender: z.enum(['male', 'female', 'other']),
  age: z.coerce.number().int().min(0, 'Age must be positive').max(130, 'Invalid age'),
  wardId: z.string().min(1, 'Please select a ward'),
  bedId: z.string().min(1, 'Please select an available bed'),
  attendingDoctor: z.string().min(2, 'Attending physician is required'),
  admittingDiagnosis: z.string().min(3, 'Admitting diagnosis is required'),
  severity: z.enum(['stable', 'serious', 'critical']),
  admissionNotes: z.string().optional(),
  emergencyContactName: z.string().optional(),
  emergencyContactPhone: z.string().optional(),
});

export type AdmissionInput = z.infer<typeof admissionSchema>;

export const dischargeSchema = z.object({
  dischargeCondition: z.enum(['recovered', 'improved', 'transferred', 'against_advice']),
  dischargeSummary: z.string().min(5, 'Discharge summary must be at least 5 characters'),
  followUpInstructions: z.string().optional(),
  dischargeMedications: z.string().optional(),
});

export type DischargeInput = z.infer<typeof dischargeSchema>;

export const bedTransferSchema = z.object({
  targetWardId: z.string().min(1, 'Please select target ward'),
  targetBedId: z.string().min(1, 'Please select target bed'),
  reason: z.string().min(3, 'Transfer reason is required'),
});

export type BedTransferInput = z.infer<typeof bedTransferSchema>;
