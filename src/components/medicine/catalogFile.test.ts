import { describe, expect, it } from "vitest";

import { addSheet, newWorkbook } from "@/utils/excel";
import { CatalogFileError, parseCatalogFile } from "./catalogFile";

async function catalogFile(sheets: Record<string, (string | number)[][]>): Promise<File> {
  const wb = await newWorkbook();
  for (const [name, rows] of Object.entries(sheets)) addSheet(wb, name, rows);
  return new File([await wb.xlsx.writeBuffer()], "catalog.xlsx");
}

const HEADER = ["Nama", "Varian", "Nama Sendiri", "Satuan", "Bentuk", "Golongan", "Kelas", "Komposisi"];

describe("parseCatalogFile", () => {
  it("reads structured and custom-named medicines plus classification sheets", async () => {
    const file = await catalogFile({
      Obat: [
        HEADER,
        ["Paracetamol", "Forte", "Tidak", "Strip", "Tablet", "Obat Bebas", "Analgesik", "Paracetamol 500 mg, Kafein 50 mg"],
        ["Bodrex Migra", "", "Ya", "Strip", "Tablet", "Obat Bebas", "Analgesik", "Paracetamol 350 mg"],
      ],
      Golongan: [["Nama", "Wajib Resep", "Terkendali"], ["Obat Keras", "Ya", "Tidak"]],
      Bentuk: [["Nama"], ["Tablet"]],
    });
    const parsed = await parseCatalogFile(file);

    expect(parsed.medicines[0]).toMatchObject({ name: "", baseName: "Paracetamol", variant: "Forte", isCustomName: false });
    expect(parsed.medicines[0].ingredients).toEqual(["Paracetamol 500 mg", "Kafein 50 mg"]);
    expect(parsed.medicines[1]).toMatchObject({ name: "Bodrex Migra", isCustomName: true });
    expect(parsed.types).toEqual([{ name: "Obat Keras", requiredPrescription: true, isControlled: false }]);
    expect(parsed.shapes).toEqual([{ name: "Tablet" }]);
    expect(parsed.classes).toEqual([]);
  });

  it("keeps decimal strengths with a comma intact", async () => {
    const file = await catalogFile({ Obat: [HEADER, ["Salep", "", "Ya", "Tube", "Salep", "Obat Keras", "Kulit", "Hidrokortison 2,5 %"]] });
    expect((await parseCatalogFile(file)).medicines[0].ingredients).toEqual(["Hidrokortison 2,5 %"]);
  });

  it("rejects a file without medicines", async () => {
    await expect(parseCatalogFile(await catalogFile({ Obat: [HEADER] }))).rejects.toBeInstanceOf(CatalogFileError);
  });
});

describe("parseCatalogFile with the separate-strength template", () => {
  const HEAD = ["Nama", "Kekuatan", "Varian", "Satuan", "Bentuk", "Golongan", "Kelas", "Zat Aktif", "Pratinjau Nama"];

  it("treats rows as structured names and pairs ingredients with strengths", async () => {
    const file = await catalogFile({
      Obat: [
        HEAD,
        ["Amoxicillin", "500 mg", "", "Strip", "Kapsul", "Obat Keras", "Antibiotik", "", ""],
        ["Panadol Extra", "500 mg; 65 mg", "", "Strip", "Tablet", "Obat Bebas", "Analgesik", "Paracetamol; Kafein", ""],
        ["Salep Kulit", "2,5 %", "", "Tube", "Salep", "Obat Keras", "Kulit", "Hidrokortison", ""],
      ],
    });
    const { medicines } = await parseCatalogFile(file);
    expect(medicines[0]).toMatchObject({ baseName: "Amoxicillin", isCustomName: false, ingredients: ["Amoxicillin 500 mg"] });
    expect(medicines[1].ingredients).toEqual(["Paracetamol 500 mg", "Kafein 65 mg"]);
    expect(medicines[2].ingredients).toEqual(["Hidrokortison 2,5 %"]);
  });
});
