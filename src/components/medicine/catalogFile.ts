import * as XLSX from "xlsx";
import type { CatalogExport, CatalogImportMedicine, CatalogImportPayload } from "@/types/catalog";

// The medicine-catalog spreadsheet. Sheet and column names are Indonesian (the
// app's main language) but the parser also accepts the English ones, and only
// the "Obat" sheet is required — a hand-made file with just medicines works.

const SHEETS = {
  medicines: ["obat", "medicines"],
  shapes: ["bentuk", "shapes"],
  types: ["golongan", "types"],
  classes: ["kelas", "classes"],
};

const COLS = {
  name: ["nama", "name", "nama obat"],
  variant: ["varian", "variant"],
  customName: ["nama sendiri", "custom name"],
  unit: ["satuan", "unit"],
  shape: ["bentuk", "shape"],
  type: ["golongan", "type", "jenis"],
  class: ["kelas", "class", "kelas terapi"],
  ingredients: ["komposisi", "ingredients", "zat aktif"],
  rx: ["wajib resep", "prescription required", "resep"],
  controlled: ["terkendali", "controlled", "obat terkendali"],
};

const norm = (v: unknown): string => String(v ?? "").trim().toLowerCase();

export function downloadCatalog(catalog: CatalogExport): void {
  const wb = XLSX.utils.book_new();
  const add = (name: string, rows: (string | number)[][]) =>
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(rows), name);

  // A structured name is written as its parts ("Nama" is then the name part only);
  // "Komposisi" carries each ingredient's strength: "Paracetamol 500 mg, Kafein 50 mg".
  add("Obat", [
    ["Nama", "Varian", "Nama Sendiri", "Satuan", "Bentuk", "Golongan", "Kelas", "Komposisi"],
    ...catalog.medicines.map((m) => [
      m.isCustomName ? m.name : (m.baseName ?? m.name),
      m.variant ?? "",
      m.isCustomName ? "Ya" : "Tidak",
      m.unit,
      m.shape,
      m.type,
      m.class,
      m.ingredients.map((i) => (i.strength ? `${i.name} ${i.strength}` : i.name)).join(", "),
    ]),
  ]);
  add("Bentuk", [["Nama"], ...catalog.shapes.map((s) => [s.name])]);
  add("Golongan", [
    ["Nama", "Wajib Resep", "Terkendali"],
    ...catalog.types.map((t) => [t.name, t.requiredPrescription ? "Ya" : "Tidak", t.isControlled ? "Ya" : "Tidak"]),
  ]);
  add("Kelas", [["Nama"], ...catalog.classes.map((c) => [c.name])]);

  const date = new Date().toISOString().slice(0, 10);
  XLSX.writeFile(wb, `daftar-obat-${catalog.pharmacy.code}-${date}.xlsx`);
}

function findSheet(wb: XLSX.WorkBook, names: string[]): XLSX.WorkSheet | undefined {
  const hit = wb.SheetNames.find((n) => names.includes(norm(n)));
  return hit ? wb.Sheets[hit] : undefined;
}

/** Rows as objects keyed by our column ids; unknown columns are ignored. */
function readRows(ws: XLSX.WorkSheet | undefined): Record<keyof typeof COLS, string>[] {
  if (!ws) return [];
  const grid = XLSX.utils.sheet_to_json<unknown[]>(ws, { header: 1, blankrows: false, defval: "" });
  if (grid.length === 0) return [];
  const header = grid[0].map(norm);
  const index = Object.fromEntries(
    (Object.keys(COLS) as (keyof typeof COLS)[]).map((k) => [k, header.findIndex((h) => COLS[k].includes(h))])
  ) as Record<keyof typeof COLS, number>;
  return grid
    .slice(1)
    .map((row) =>
      Object.fromEntries(
        (Object.keys(COLS) as (keyof typeof COLS)[]).map((k) => [k, index[k] >= 0 ? String(row[index[k]] ?? "").trim() : ""])
      ) as Record<keyof typeof COLS, string>
    )
    .filter((r) => Object.values(r).some(Boolean));
}

export class CatalogFileError extends Error {}

export async function parseCatalogFile(file: File): Promise<CatalogImportPayload> {
  const wb = XLSX.read(await file.arrayBuffer(), { type: "array" });
  const medicineSheet = findSheet(wb, SHEETS.medicines) ?? wb.Sheets[wb.SheetNames[0]];
  const medicineRows = readRows(medicineSheet);
  if (medicineRows.length === 0 || !medicineRows.some((r) => r.name)) {
    throw new CatalogFileError("NO_MEDICINES");
  }

  const isYes = (v: string) => ["ya", "yes", "y", "true", "1"].includes(norm(v));
  // "Nama Sendiri" = Tidak: "Nama" is the name part, and the name follows the
  // pharmacy's format. Without that column, names are kept exactly as written.
  const medicines: CatalogImportMedicine[] = medicineRows.map((r) => {
    const structured = r.customName !== "" && !isYes(r.customName);
    return {
      name: structured ? "" : r.name,
      ...(structured ? { baseName: r.name, variant: r.variant || null, isCustomName: false } : { isCustomName: true }),
      unit: r.unit,
      shape: r.shape,
      type: r.type,
      class: r.class,
      ingredients: r.ingredients
        .split(/[;]|,(?!\d)/)
        .map((s) => s.trim())
        .filter(Boolean),
    };
  });

  return {
    shapes: readRows(findSheet(wb, SHEETS.shapes)).filter((r) => r.name).map((r) => ({ name: r.name })),
    types: readRows(findSheet(wb, SHEETS.types))
      .filter((r) => r.name)
      .map((r) => ({
        name: r.name,
        requiredPrescription: r.rx ? isYes(r.rx) : undefined,
        isControlled: r.controlled ? isYes(r.controlled) : undefined,
      })),
    classes: readRows(findSheet(wb, SHEETS.classes)).filter((r) => r.name).map((r) => ({ name: r.name })),
    medicines,
  };
}
