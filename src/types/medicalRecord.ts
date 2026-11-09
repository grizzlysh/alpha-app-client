export type AllergyType = "MEDICINE" | "FOOD" | "ENVIRONMENT" | "OTHER";
export type AllergySeverity = "MILD" | "MODERATE" | "SEVERE";

export interface Allergy {
  uuid: string;
  allergenName: string;
  allergenType: AllergyType;
  reaction: string | null;
  severity: AllergySeverity;
  notes: string | null;
  createdAt: string;
}

export interface MedicalRecord {
  uuid: string;
  number: string;
  bloodType: string | null;
  emergencyContactName: string | null;
  emergencyContactPhone: string | null;
  customer: {
    uuid: string;
    name: string;
    phone: string | null;
  };
  allergies: Allergy[];
  createdAt: string;
  updatedAt: string;
}

export interface MedicalVisitDoctor {
  uuid: string;
  name: string;
}

export interface MedicalVisitPrescription {
  uuid: string;
  prescriptionNumber: string | null;
}

export interface MedicalVisit {
  uuid: string;
  visitDate: string;
  chiefComplaint: string | null;
  diagnosis: string | null;
  notes: string | null;
  weightKg: number | null;
  heightCm: number | null;
  bloodPressure: string | null;
  temperatureCelsius: number | null;
  pulsePerMinute: number | null;
  prescription: MedicalVisitPrescription | null;
  doctor: MedicalVisitDoctor | null;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateMedicalRecordPayload {
  bloodType?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
}

export interface CreateAllergyPayload {
  allergenName: string;
  allergenType: AllergyType;
  reaction?: string;
  severity: AllergySeverity;
  notes?: string;
}

export interface CreateVisitPayload {
  visitDate: string;
  chiefComplaint?: string;
  diagnosis?: string;
  notes?: string;
  weightKg?: number;
  heightCm?: number;
  bloodPressure?: string;
  temperatureCelsius?: number;
  pulsePerMinute?: number;
  prescriptionUuid?: string;
  doctorUuid?: string;
}

export type UpdateVisitPayload = Partial<CreateVisitPayload>;

export interface VisitListParams {
  page?: number;
  limit?: number;
}
