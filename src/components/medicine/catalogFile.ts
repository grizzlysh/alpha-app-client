import { addSheet, downloadWorkbook, findSheet, loadWorkbook, newWorkbook, sheetToGrid, type Worksheet } from "@/utils/excel";
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
  strength: ["kekuatan", "strength", "dosis"],
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

export async function downloadCatalog(catalog: CatalogExport): Promise<void> {
  const wb = await newWorkbook();
  const add = (name: string, rows: (string | number)[][]): void => void addSheet(wb, name, rows);

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
  await downloadWorkbook(wb, `daftar-obat-${catalog.pharmacy.code}-${date}.xlsx`);
}

type Row = Record<keyof typeof COLS, string>;

/** The column ids present in a sheet's header row. */
function headerColumns(ws: Worksheet | undefined): Set<keyof typeof COLS> {
  const header = (sheetToGrid(ws)[0] ?? []).map(norm);
  return new Set((Object.keys(COLS) as (keyof typeof COLS)[]).filter((k) => header.some((h) => COLS[k].includes(h))));
}

/**
 * The ingredients of a structured row. "Zat Aktif" without strengths is paired
 * with "Kekuatan" by position ("Paracetamol; Kafein" + "500 mg; 50 mg");
 * with no ingredient given, the name itself is the ingredient.
 */
function structuredIngredients(r: Row): string[] {
  const names = splitList(r.ingredients);
  const strengths = r.strength.split(/[;+]/).map((s) => s.trim()).filter(Boolean);
  if (names.length === 0) return r.strength ? [`${r.name} ${r.strength}`.trim()] : [];
  return names.map((n, i) => (/\d/.test(n) || !strengths[i] ? n : `${n} ${strengths[i]}`));
}

/** "a; b" or "a, b" — but a decimal comma ("2,5 %") stays inside its item. */
const splitList = (v: string): string[] =>
  v
    .split(/[;]|,(?!\d)/)
    .map((s) => s.trim())
    .filter(Boolean);

/** Rows as objects keyed by our column ids; unknown columns are ignored. */
function readRows(ws: Worksheet | undefined): Row[] {
  const grid = sheetToGrid(ws);
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
  const wb = await loadWorkbook(file);
  const medicineSheet = findSheet(wb, SHEETS.medicines) ?? wb.worksheets[0];
  const medicineRows = readRows(medicineSheet);
  if (medicineRows.length === 0 || !medicineRows.some((r) => r.name)) {
    throw new CatalogFileError("NO_MEDICINES");
  }

  const isYes = (v: string) => ["ya", "yes", "y", "true", "1"].includes(norm(v));
  // "Nama Sendiri" = Tidak, or a "Kekuatan" column (the template with separate
  // strength): "Nama" is the name part and the name follows the pharmacy's
  // format. Otherwise names are kept exactly as written.
  const hasStrengthColumn = headerColumns(medicineSheet).has("strength");
  const medicines: CatalogImportMedicine[] = medicineRows.map((r) => {
    const structured = r.customName !== "" ? !isYes(r.customName) : hasStrengthColumn;
    return {
      name: structured ? "" : r.name,
      ...(structured ? { baseName: r.name, variant: r.variant || null, isCustomName: false } : { isCustomName: true }),
      unit: r.unit,
      shape: r.shape,
      type: r.type,
      class: r.class,
      ingredients: structured && hasStrengthColumn ? structuredIngredients(r) : splitList(r.ingredients),
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
