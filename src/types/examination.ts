import type { AllergySeverity, AllergyType } from "./medicalRecord";
import type { PrescriptionStatus } from "./prescription";

export type VisitStatus = "WAITING" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";

export interface ExaminationPatient {
  uuid: string;
  name: string;
  phone: string | null;
  gender: string | null;
  dateOfBirth: string | null;
  medicalRecordNumber: string;
  bloodType: string | null;
  allergies: {
    uuid: string;
    allergenName: string;
    allergenType: AllergyType;
    severity: AllergySeverity;
    reaction: string | null;
  }[];
}

export interface ExaminationPrescriptionLine {
  uuid: string;
  medicineName: string;
  qty: number;
  frequency: string | null;
  duration: string | null;
  notes: string | null;
}

export interface Examination {
  uuid: string;
  queueNumber: number | null;
  status: VisitStatus;
  visitDate: string;
  checkedInAt: string | null;
  startedAt: string | null;
  completedAt: string | null;
  chiefComplaint: string | null;
  diagnosis: string | null;
  notes: string | null;
  weightKg: number | null;
  heightCm: number | null;
  bloodPressure: string | null;
  temperatureCelsius: number | null;
  pulsePerMinute: number | null;
  doctor: { uuid: string; name: string } | null;
  prescription: {
    uuid: string;
    prescriptionNumber: string | null;
    status: PrescriptionStatus;
    details: ExaminationPrescriptionLine[];
  } | null;
  patient: ExaminationPatient;
}

export interface ExaminationQueue {
  date: string;
  counts: Record<VisitStatus, number>;
  items: Examination[];
}

export interface ExamFieldsPayload {
  chiefComplaint?: string;
  diagnosis?: string;
  notes?: string;
  weightKg?: number | null;
  heightCm?: number | null;
  bloodPressure?: string;
  temperatureCelsius?: number | null;
  pulsePerMinute?: number | null;
}

export interface ExamPrescriptionItem {
  medicineUuid?: string;
  medicineName: string;
  qty: number;
  frequency?: string;
  duration?: string;
  notes?: string;
}

export interface CompleteExamPayload extends ExamFieldsPayload {
  prescription?: { notes?: string; items: ExamPrescriptionItem[] };
  acknowledgeAllergies?: boolean;
}

export interface AllergyConflict {
  medicineName: string;
  allergenName: string;
  severity: AllergySeverity;
  matchedOn: string;
}
