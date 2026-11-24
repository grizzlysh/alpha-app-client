import { describe, expect, it } from "vitest";

import { findSheet, loadWorkbook, sheetToGrid } from "@/utils/excel";
import { parseCatalogFile } from "@/components/medicine/catalogFile";
import { OPENING_STOCK_COLUMNS } from "./columns";
import { buildMedicineTemplate, buildOpeningStockTemplate } from "./importTemplates";
import { readSheet } from "./spreadsheet";

const LISTS = { shapes: ["Tablet", "Kapsul"], types: ["Obat Bebas", "Obat Keras"], classes: ["Analgesik"], units: ["Strip", "strip"] };

const reload = async (wb: Awaited<ReturnType<typeof buildMedicineTemplate>>) => loadWorkbook(new Uint8Array(await wb.xlsx.writeBuffer()));

describe("medicine template", () => {
  it("separate-strength layout: drop-downs for classifications and a name preview in the pharmacy's format", async () => {
    const wb = await reload(await buildMedicineTemplate({ structured: true, format: "NAME_SHAPE_STRENGTH", lists: LISTS }));
    const ws = findSheet(wb, ["Obat"])!;
    expect(sheetToGrid(ws)[0]).toEqual(["Nama", "Kekuatan", "Varian", "Satuan", "Bentuk", "Golongan", "Kelas", "Zat Aktif", "Pratinjau Nama"]);
    expect(ws.getCell("E2").dataValidation.formulae?.[0]).toBe("'Daftar'!$A$2:$A$3");
    expect(ws.getCell("F500").dataValidation.type).toBe("list");
    expect(ws.getCell("D2").dataValidation.errorStyle).toBe("warning"); // units: other values allowed
    expect((ws.getCell("I2").value as { formula: string }).formula).toContain('A2&" "&E2&" "&B2&" "&C2');
    // Units are de-duplicated case-insensitively.
    const units = sheetToGrid(findSheet(wb, ["Daftar"])).map((r) => r[3]).filter((u) => u === "Strip" || u === "strip");
    expect(units).toHaveLength(1);
  });

  it("the filled template is read back as structured medicines", async () => {
    const built = await buildMedicineTemplate({ structured: true, format: "NAME_STRENGTH_SHAPE", lists: LISTS });
    const file = new File([await built.xlsx.writeBuffer()], "t.xlsx");
    const { medicines } = await parseCatalogFile(file);
    expect(medicines[0]).toMatchObject({ baseName: "Paracetamol", isCustomName: false, shape: "Tablet", ingredients: ["Paracetamol 500 mg"] });
    expect(medicines).toHaveLength(1); // preview formulas in empty rows are not medicines
  });

  it("whole-name layout keeps names as written", async () => {
    const built = await buildMedicineTemplate({ structured: false, format: "NAME_STRENGTH_SHAPE", lists: LISTS });
    const { medicines } = await parseCatalogFile(new File([await built.xlsx.writeBuffer()], "t.xlsx"));
    expect(medicines[0]).toMatchObject({ name: "Paracetamol 500 mg Tablet", isCustomName: true });
  });
});

describe("opening stock template", () => {
  it("offers the pharmacy's medicines and checks dates and numbers", async () => {
    const built = await buildOpeningStockTemplate({ medicines: ["Zinc 20 mg Tablet", "Amoxicillin 500 mg Kapsul"], distributors: ["PT Farma"] });
    const wb = await loadWorkbook(new Uint8Array(await built.xlsx.writeBuffer()));
    const ws = findSheet(wb, ["Saldo Awal"])!;
    expect(ws.getCell("A10").dataValidation.formulae?.[0]).toBe("'Daftar'!$A$2:$A$3");
    expect(ws.getCell("C2").dataValidation.type).toBe("date");
    expect(ws.getCell("D2").dataValidation).toMatchObject({ type: "whole", operator: "greaterThanOrEqual" });

    const rows = await readSheet(new File([await built.xlsx.writeBuffer()], "s.xlsx"), OPENING_STOCK_COLUMNS);
    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject({ medicine: "Amoxicillin 500 mg Kapsul", batchNumber: "B12345", quantityPieces: 100, distributor: "PT Farma" });
    expect(rows[0].expiryDate).toMatch(/^\d{4}-12-31$/);
  });
});
