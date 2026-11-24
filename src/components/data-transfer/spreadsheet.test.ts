import { describe, expect, it } from "vitest";

import { addSheet, newWorkbook } from "@/utils/excel";
import { parseNumber, readSheet, SheetEmptyError, type SheetColumn } from "./spreadsheet";

async function xlsxFile(rows: (string | number | Date | null)[][]): Promise<File> {
  const wb = await newWorkbook();
  addSheet(wb, "Data", rows);
  return new File([await wb.xlsx.writeBuffer()], "data.xlsx");
}

const COLUMNS: SheetColumn[] = [
  { field: "name", header: "Nama Obat", aliases: ["obat"] },
  { field: "qty", header: "Jumlah", numeric: true },
  { field: "expiry", header: "Kedaluwarsa", date: true },
];

describe("parseNumber", () => {
  it.each([
    ["1.000", 1000],
    ["1.250,50", 1250.5],
    ["1,000.5", 1000.5],
    ["Rp 3.500", 3500],
    ["12,5", 12.5],
    [42, 42],
  ])("%s → %s", (input, expected) => expect(parseNumber(input)).toBe(expected));

  it("returns undefined for text without digits", () => expect(parseNumber("abc")).toBeUndefined());
});

describe("readSheet", () => {
  it("matches columns by header or alias in any order and converts values", async () => {
    const file = await xlsxFile([
      ["Kedaluwarsa", "OBAT", "Jumlah", "Catatan"],
      [new Date(2027, 5, 30), "Paracetamol 500 mg", "1.200", "ignored"],
    ]);
    expect(await readSheet(file, COLUMNS)).toEqual([{ name: "Paracetamol 500 mg", qty: 1200, expiry: "2027-06-30" }]);
  });

  it("throws SheetEmptyError when only a header is present", async () => {
    await expect(readSheet(await xlsxFile([["Nama Obat", "Jumlah"]]), COLUMNS)).rejects.toBeInstanceOf(SheetEmptyError);
  });
});
