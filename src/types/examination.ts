import type { Allergy, AllergySeverity } from "./medicalRecord";
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
  allergies: Allergy[];
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
  triagedAt: string | null;
  triagedBy: { uuid: string; name: string } | null;
  startedAt: string | null;
  completedAt: string | null;
  chiefComplaint: string | null;
  findings: string | null;
  diagnosis: string | null;
  advice: string | null;
  notes: string | null;
  weightKg: number | null;
  heightCm: number | null;
  bloodPressure: string | null;
  temperatureCelsius: number | null;
  pulsePerMinute: number | null;
  oxygenSaturation: number | null;
  doctor: { uuid: string; name: string } | null;
  prescription: {
    uuid: string;
    prescriptionNumber: string | null;
    status: PrescriptionStatus;
    details: ExaminationPrescriptionLine[];
  } | null;
  patient: ExaminationPatient;
}

/** A doctor the queue can be split by (in-house doctors and anyone assigned today). */
export interface QueueDoctor {
  uuid: string;
  name: string;
  /** The signed-in user is this doctor. */
  isMe: boolean;
}

export interface ExaminationQueue {
  date: string;
  counts: Record<VisitStatus, number>;
  /** Waiting patients whose vitals are already recorded. */
  triaged: number;
  doctors: QueueDoctor[];
  items: Examination[];
}

export interface VitalsPayload {
  chiefComplaint?: string;
  weightKg?: number | null;
  heightCm?: number | null;
  bloodPressure?: string;
  temperatureCelsius?: number | null;
  pulsePerMinute?: number | null;
  oxygenSaturation?: number | null;
}

export interface ExamFieldsPayload extends VitalsPayload {
  findings?: string;
  diagnosis?: string;
  advice?: string;
  notes?: string;
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
