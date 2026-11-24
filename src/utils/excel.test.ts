import { describe, expect, it } from "vitest";

import { addList, addListValidation, addSheet, findSheet, loadWorkbook, newWorkbook, sheetToGrid } from "./excel";

async function roundTrip(build: (wb: Awaited<ReturnType<typeof newWorkbook>>) => void): Promise<Awaited<ReturnType<typeof loadWorkbook>>> {
  const wb = await newWorkbook();
  build(wb);
  const buf = await wb.xlsx.writeBuffer();
  return loadWorkbook(new Uint8Array(buf));
}

describe("excel helper", () => {
  it("writes rows and reads them back as a grid, dropping blank rows", async () => {
    const wb = await roundTrip((w) => {
      addSheet(w, "Obat", [["Nama", "Stok"], ["Paracetamol", 120], [], ["Amoxicillin", 0]]);
    });
    expect(sheetToGrid(wb.worksheets[0])).toEqual([
      ["Nama", "Stok"],
      ["Paracetamol", 120],
      ["Amoxicillin", 0],
    ]);
  });

  it("fills missing cells with empty strings so every row has the sheet's width", async () => {
    const wb = await roundTrip((w) => addSheet(w, "S", [["A", "B", "C"], ["x"]]));
    expect(sheetToGrid(wb.worksheets[0])[1]).toEqual(["x", "", ""]);
  });

  it("keeps dates as Date values", async () => {
    const d = new Date(Date.UTC(2027, 2, 31));
    const wb = await roundTrip((w) => addSheet(w, "S", [["ED"], [d]]));
    const v = sheetToGrid(wb.worksheets[0])[1][0];
    expect(v).toBeInstanceOf(Date);
    expect((v as Date).toISOString().slice(0, 10)).toBe("2027-03-31");
  });

  it("finds sheets case-insensitively and truncates names to Excel's 31-char limit", async () => {
    const wb = await roundTrip((w) => {
      addSheet(w, "Obat", [["x"]]);
      addSheet(w, "A very long sheet name that Excel would reject", [["y"]]);
    });
    expect(findSheet(wb, ["OBAT"])?.name).toBe("Obat");
    expect(wb.worksheets[1].name.length).toBeLessThanOrEqual(31);
  });

  it("adds a drop-down that points at a list range", async () => {
    const wb = await roundTrip((w) => {
      const ws = addSheet(w, "Obat", [["Golongan"]]);
      const lists = w.addWorksheet("Daftar", { state: "veryHidden" });
      const range = addList(lists, 1, "Golongan", ["Obat Bebas", "Obat Keras"]);
      expect(range).toBe("'Daftar'!$A$2:$A$3");
      addListValidation(ws, 1, range, { toRow: 5 });
    });
    const dv = wb.getWorksheet("Obat")?.getCell("A2").dataValidation;
    expect(dv?.type).toBe("list");
    expect(dv?.formulae?.[0]).toContain("Daftar");
    expect(sheetToGrid(wb.getWorksheet("Daftar")).map((r) => r[0])).toEqual(["Golongan", "Obat Bebas", "Obat Keras"]);
  });
});
