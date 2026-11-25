import { describe, expect, it, vi } from "vitest";

import type { BatchLabel } from "@/types/stock";
import { boxCount, labelsDocument, type LabelText } from "./barcodeLabels";

vi.mock("@/utils/barcode", () => ({ barcodeSvg: (code: string) => `<svg data-code="${code}"></svg>` }));

const TEXT = { batch: "Batch", expiry: "ED", stock: "Stok", lockedCabinet: "Lemari khusus" } as LabelText;
const SHEET = { mode: "per-pack" as const, size: "50x30" as const, locale: "id-ID", formatName: (n: string) => n };

const label = (batchNumber: string, barcode: string, quantityPieces: number, quantityPerBox: number): BatchLabel => ({
  pharmacy: { name: "Apotek Uji", code: "UJI" },
  medicine: { uuid: "m1", name: "Paracetamol 500 mg Tablet", unit: "Strip", barcode: null, shape: "Tablet", type: "Obat Bebas", isControlled: false, requiredPrescription: false, therapeuticClass: "Analgesik" },
  batch: { uuid: barcode, batchNumber, barcode, expiryDate: "2027-12-31T00:00:00.000Z", quantityPieces, quantityPerBox, distributor: "PT A", location: null },
  reorderLevel: 0,
  medicineTotalPieces: quantityPieces,
  sellingPrice: 5000,
});

const count = (html: string): number => (html.match(/class="label"/g) ?? []).length;

describe("batch labels", () => {
  it("one per pack by default: packs round up", () => {
    expect(boxCount(25, 10)).toBe(3);
    expect(boxCount(7, 1)).toBe(7);
    expect(boxCount(0, 10)).toBe(1);
  });

  it("prints each batch's own barcode, as many times as asked", () => {
    const html = labelsDocument(
      [
        { data: label("b1", "1111", 30, 10), copies: 3 },
        { data: label("b2", "2222", 5, 1), copies: 1 },
      ],
      TEXT,
      SHEET
    );
    expect(count(html)).toBe(4);
    expect(html.match(/data-code="1111"/g)).toHaveLength(3);
    expect(html.match(/data-code="2222"/g)).toHaveLength(1);
    expect(html).toContain("ED <b>12/2027</b>");
    expect(html).toContain("Rp 5.000");
    expect(html).not.toContain("Stok <b>");
  });

  it("one per batch adds the stock; ED and price are on both", () => {
    const html = labelsDocument([{ data: label("b1", "1111", 30, 10), copies: 1 }], TEXT, { ...SHEET, mode: "per-batch" });
    expect(html).toContain("Stok <b>30 strip</b>");
    expect(html).toContain("ED <b>12/2027</b>");
    expect(html).toContain("Rp 5.000");
  });

  it("a preview limit cuts the document short", () => {
    const html = labelsDocument([{ data: label("b1", "1111", 300, 1), copies: 300 }], TEXT, SHEET, 3);
    expect(count(html)).toBe(3);
  });
});
