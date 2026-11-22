import type { Examination, QueueDoctor } from "@/types/examination";

/** One doctor's line: who they are seeing now and who waits for them, in order. */
export interface DoctorLane {
  doctor: QueueDoctor;
  /** Patient(s) this doctor is examining now (normally one). */
  current: Examination[];
  /**
   * Patients this doctor would see next: those who chose this doctor plus
   * those who chose no one ("any doctor"), in arrival order.
   */
  waiting: Examination[];
}

const byArrival = (a: Examination, b: Examination): number =>
  new Date(a.checkedInAt ?? a.visitDate).getTime() - new Date(b.checkedInAt ?? b.visitDate).getTime() ||
  (a.queueNumber ?? 0) - (b.queueNumber ?? 0);

/** Splits today's queue per doctor. The signed-in doctor's line comes first. */
export function buildDoctorLanes(items: Examination[], doctors: QueueDoctor[]): DoctorLane[] {
  const waiting = items.filter((e) => e.status === "WAITING").sort(byArrival);
  const inProgress = items.filter((e) => e.status === "IN_PROGRESS");

  const lanes = doctors.map((doctor) => ({
    doctor,
    current: inProgress.filter((e) => e.doctor?.uuid === doctor.uuid),
    waiting: waiting.filter((e) => e.doctor === null || e.doctor.uuid === doctor.uuid),
  }));
  return lanes.sort((a, b) => Number(b.doctor.isMe) - Number(a.doctor.isMe));
}

/** Waiting patients nobody has been chosen for. */
export function unassignedWaiting(items: Examination[]): Examination[] {
  return items.filter((e) => e.status === "WAITING" && e.doctor === null).sort(byArrival);
}
