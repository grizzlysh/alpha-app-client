import type { LabelKind } from "@/components/stock/barcodeLabels";

/** One line of the print queue: `copies` labels of one kind for one batch. */
export interface QueueItem {
  id: string;
  kind: LabelKind;
  /** The batch the label is for; a medicine label uses the medicine's first batch for its data. */
  stockDetailUuid: string;
  medicineUuid: string;
  medicineName: string;
  /** Null for a medicine label (one code for every batch). */
  batchNumber: string | null;
  copies: number;
  /** Item labels: number of the first item. */
  startNumber: number;
}

export type NewQueueItem = Omit<QueueItem, "id" | "startNumber">;

/**
 * Adds a line, or merges it into the same label already queued: a batch or
 * medicine label gets more copies, item labels keep their numbering.
 */
export function addToQueue(queue: QueueItem[], item: NewQueueItem): QueueItem[] {
  const same = queue.find(
    (q) => q.kind === item.kind && (item.kind === "medicine-label" ? q.medicineUuid === item.medicineUuid : q.stockDetailUuid === item.stockDetailUuid)
  );
  if (!same) return [...queue, { ...item, id: crypto.randomUUID(), startNumber: 1 }];
  if (item.kind === "item-label") return queue;
  return queue.map((q) => (q === same ? { ...q, copies: Math.min(500, q.copies + item.copies) } : q));
}
