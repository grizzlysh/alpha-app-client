import type { Examination } from "@/types/examination";

/**
 * Where a patient sits in the queue. "WAITING" splits on triage: patients whose
 * vitals are recorded are READY for the doctor.
 */
export type QueueStage = "WAITING" | "READY" | "IN_PROGRESS" | "COMPLETED";
export const QUEUE_STAGES: QueueStage[] = ["WAITING", "READY", "IN_PROGRESS", "COMPLETED"];

export function stageOf(exam: Pick<Examination, "status" | "triagedAt">): QueueStage | null {
  if (exam.status === "CANCELLED") return null;
  if (exam.status === "WAITING") return exam.triagedAt ? "READY" : "WAITING";
  return exam.status;
}
