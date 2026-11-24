// Excel templates with drop-downs, so a sheet filled in by hand matches the
// pharmacy's own classifications and medicine names before it is uploaded.
import type { MedicineNameFormat } from "@/utils/medicineName";
import { addList, addListValidation, addSheet, addValidation, downloadWorkbook, newWorkbook, type Workbook, type Worksheet } from "@/utils/excel";
import { OPENING_STOCK_COLUMNS } from "./columns";

/** Rows the drop-downs and number checks cover. */
export const TEMPLATE_ROWS = 1000;

/** Units suggested in the template (other units can still be typed). */
export const COMMON_UNITS = ["Tablet", "Kaplet", "Kapsul", "Strip", "Blister", "Box", "Botol", "Tube", "Pot", "Sachet", "Ampul", "Vial", "Pcs"];

export interface MedicineTemplateLists {
  shapes: string[];
  types: string[];
  classes: string[];
  /** Units already in use; merged with COMMON_UNITS. */
  units: string[];
}

export interface MedicineTemplateOptions {
  /**
   * Structured names: the name, strength and variant in their own columns and
   * the full name built in the pharmacy's format. Otherwise one free name column.
   */
  structured: boolean;
  format: MedicineNameFormat;
  lists: MedicineTemplateLists;
}

const uniqueSorted = (values: string[]): string[] =>
  [...new Map(values.filter((v) => v.trim()).map((v) => [v.trim().toLowerCase(), v.trim()])).values()].sort((a, b) =>
    a.localeCompare(b, "id")
  );

function styleHeader(ws: Worksheet, required: number[]): void {
  const row = ws.getRow(1);
  row.height = 20;
  row.eachCell((cell, col) => {
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: required.includes(col) ? "FFDCEFE4" : "FFF1F1EE" } };
    cell.alignment = { vertical: "middle" };
  });
}

function addGuide(wb: Workbook, lines: string[][]): void {
  const ws = addSheet(wb, "Petunjuk", [["Petunjuk pengisian"], [], ...lines], { header: false });
  ws.getCell("A1").font = { bold: true, size: 13 };
  ws.getColumn(1).width = 24;
  ws.getColumn(2).width = 90;
  ws.getColumn(2).alignment = { wrapText: true, vertical: "top" };
}

function newListSheet(wb: Workbook): Worksheet {
  return wb.addWorksheet("Daftar", { state: "hidden" });
}

/** The cells a structured name is put together from, in the pharmacy's order (variant last). */
function previewFormula(format: MedicineNameFormat, row: number): string {
  const name = `A${row}`;
  const strength = `B${row}`;
  const variant = `C${row}`;
  const shape = `E${row}`;
  const order: Record<MedicineNameFormat, string[]> = {
    NAME_STRENGTH_SHAPE: [name, strength, shape, variant],
    NAME_SHAPE_STRENGTH: [name, shape, strength, variant],
    NAME_STRENGTH: [name, strength, variant],
  };
  return `TRIM(${order[format].join('&" "&')})`;
}

export async function buildMedicineTemplate({ structured, format, lists }: MedicineTemplateOptions): Promise<Workbook> {
  const wb = await newWorkbook();
  const headers = structured
    ? ["Nama", "Kekuatan", "Varian", "Satuan", "Bentuk", "Golongan", "Kelas", "Zat Aktif", "Pratinjau Nama"]
    : ["Nama Obat", "Satuan", "Bentuk", "Golongan", "Kelas", "Komposisi"];
  const example = structured
    ? ["Paracetamol", "500 mg", "", "Strip", lists.shapes[0] ?? "Tablet", lists.types[0] ?? "Obat Bebas", lists.classes[0] ?? "Analgesik", "Paracetamol"]
    : ["Paracetamol 500 mg Tablet", "Strip", lists.shapes[0] ?? "Tablet", lists.types[0] ?? "Obat Bebas", lists.classes[0] ?? "Analgesik", "Paracetamol 500 mg"];
  const ws = addSheet(wb, "Obat", [headers, example]);

  // Column numbers of each field in this layout.
  const col = structured
    ? { unit: 4, shape: 5, type: 6, cls: 7, required: [1, 4, 5, 6, 7] }
    : { unit: 2, shape: 3, type: 4, cls: 5, required: [1, 2, 3, 4, 5] };
  styleHeader(ws, col.required);

  const listSheet = newListSheet(wb);
  const shapes = addList(listSheet, 1, "Bentuk", uniqueSorted(lists.shapes));
  const types = addList(listSheet, 2, "Golongan", uniqueSorted(lists.types));
  const classes = addList(listSheet, 3, "Kelas", uniqueSorted(lists.classes));
  const units = addList(listSheet, 4, "Satuan", uniqueSorted([...COMMON_UNITS, ...lists.units]));

  addListValidation(ws, col.shape, shapes, { toRow: TEMPLATE_ROWS, prompt: "Pilih bentuk sediaan" });
  addListValidation(ws, col.type, types, { toRow: TEMPLATE_ROWS, prompt: "Pilih golongan obat" });
  addListValidation(ws, col.cls, classes, { toRow: TEMPLATE_ROWS, prompt: "Pilih kelas terapi" });
  addListValidation(ws, col.unit, units, { toRow: TEMPLATE_ROWS, strict: false, prompt: "Pilih atau ketik satuan" });

  if (structured) {
    // A live preview of the name the app will build; the app ignores this column.
    for (let r = 2; r <= TEMPLATE_ROWS; r++) {
      const cell = ws.getCell(r, 9);
      cell.value = { formula: `IF(A${r}="","",${previewFormula(format, r)})` };
      cell.font = { color: { argb: "FF6B7280" }, italic: true };
    }
    ws.getColumn(9).width = 40;
    ws.getColumn(1).width = 28;
  } else {
    ws.getColumn(1).width = 36;
  }

  addGuide(wb, structured
    ? [
        ["Nama", "Nama obat tanpa kekuatan dan bentuk, mis. Paracetamol, Amoxicillin. Wajib."],
        ["Kekuatan", "Kekuatan zat aktif, mis. 500 mg, 250 mg/5 ml. Beberapa zat aktif dipisah titik koma: 500 mg; 50 mg."],
        ["Varian", "Opsional, mis. Forte, Sirup Anak. Ditaruh di akhir nama."],
        ["Satuan", "Satuan jual terkecil, pilih dari daftar atau ketik sendiri. Wajib."],
        ["Bentuk / Golongan / Kelas", "Pilih dari daftar (sesuai klasifikasi apotek). Wajib."],
        ["Zat Aktif", "Opsional. Kosongkan bila sama dengan Nama. Beberapa zat aktif dipisah titik koma, urutannya sama dengan Kekuatan."],
        ["Pratinjau Nama", "Terisi otomatis: nama lengkap sesuai format nama apotek. Tidak perlu diisi."],
        ["Baris 2", "Contoh. Hapus atau timpa sebelum mengunggah."],
      ]
    : [
        ["Nama Obat", "Nama lengkap obat persis seperti yang ingin ditampilkan. Wajib."],
        ["Satuan", "Satuan jual terkecil, pilih dari daftar atau ketik sendiri. Wajib."],
        ["Bentuk / Golongan / Kelas", "Pilih dari daftar (sesuai klasifikasi apotek). Wajib."],
        ["Komposisi", "Zat aktif beserta kekuatannya, dipisah koma, mis. Paracetamol 500 mg, Kafein 50 mg."],
        ["Baris 2", "Contoh. Hapus atau timpa sebelum mengunggah."],
      ]);
  return wb;
}

export interface OpeningStockTemplateLists {
  medicines: string[];
  distributors: string[];
}

export async function buildOpeningStockTemplate({ medicines, distributors }: OpeningStockTemplateLists): Promise<Workbook> {
  const wb = await newWorkbook();
  const firstMedicine = uniqueSorted(medicines)[0] ?? "Paracetamol 500 mg Tablet";
  const expiry = new Date(new Date().getFullYear() + 2, 11, 31);
  const ws = addSheet(wb, "Saldo Awal", [
    OPENING_STOCK_COLUMNS.map((c) => c.header),
    [firstMedicine, "B12345", expiry, 100, 350, 500, distributors[0] ?? ""],
  ]);
  styleHeader(ws, [1, 2, 3, 4]);
  ws.getColumn(1).width = 40;
  ws.getColumn(3).numFmt = "dd/mm/yyyy";

  const listSheet = newListSheet(wb);
  const medicineRange = addList(listSheet, 1, "Obat", uniqueSorted(medicines));
  const distributorRange = addList(listSheet, 2, "Distributor", uniqueSorted(distributors));

  addListValidation(ws, 1, medicineRange, { toRow: TEMPLATE_ROWS, prompt: "Pilih obat dari daftar obat apotek" });
  addListValidation(ws, 7, distributorRange, { toRow: TEMPLATE_ROWS, strict: false, prompt: "Pilih distributor (boleh dikosongkan)" });
  const numberCheck = (type: "whole" | "decimal", min: number, error: string) =>
    ({ type, operator: "greaterThanOrEqual" as const, formulae: [min], allowBlank: true, showErrorMessage: true, errorStyle: "stop", errorTitle: "Angka tidak valid", error });
  addValidation(ws, 3, { type: "date", operator: "greaterThan", formulae: [new Date(2000, 0, 1)], allowBlank: true, showErrorMessage: true, errorStyle: "stop", errorTitle: "Tanggal tidak valid", error: "Isi tanggal kedaluwarsa, mis. 31/12/2027." }, { toRow: TEMPLATE_ROWS });
  addValidation(ws, 4, numberCheck("whole", 1, "Jumlah berupa bilangan bulat minimal 1."), { toRow: TEMPLATE_ROWS });
  addValidation(ws, 5, numberCheck("decimal", 0, "Harga beli tidak boleh negatif."), { toRow: TEMPLATE_ROWS });
  addValidation(ws, 6, numberCheck("decimal", 0, "Harga jual tidak boleh negatif."), { toRow: TEMPLATE_ROWS });
  for (let r = 2; r <= TEMPLATE_ROWS; r++) ws.getCell(r, 3).numFmt = "dd/mm/yyyy";

  addGuide(wb, [
    ["Nama Obat", "Pilih dari daftar obat apotek. Obat yang belum ada, tambahkan dulu lewat menu Obat atau Import Obat. Wajib."],
    ["No. Batch", "Nomor batch pada kemasan. Wajib."],
    ["Kedaluwarsa", "Tanggal kedaluwarsa batch (dd/mm/yyyy). Wajib."],
    ["Jumlah (pcs)", "Jumlah dalam satuan terkecil. Wajib."],
    ["Harga Beli / pcs", "Harga beli per satuan terkecil. Disarankan diisi (kosong = 0) agar nilai persediaan benar."],
    ["Harga Jual / pcs", "Opsional. Kosongkan untuk memakai margin apotek."],
    ["Distributor", "Opsional. Pilih dari daftar; kosong = distributor bawaan yang dipilih saat import."],
    ["Baris 2", "Contoh. Hapus atau timpa sebelum mengunggah."],
  ]);
  return wb;
}

// ── Downloads (fetch the pharmacy's lists, build, save) ─────────────────────
// Services are imported on demand so the builders above stay free of the API
// client (and testable in Node).

const today = (): string => new Date().toISOString().slice(0, 10);

export async function downloadMedicineTemplate(structured: boolean, format: MedicineNameFormat): Promise<void> {
  const [{ getMedicineShapesDropdown }, { getMedicineTypesDropdown }, { getMedicineClassesDropdown }, { getMedicinesDropdown }] =
    await Promise.all([
      import("@/service/medicineShapeService"),
      import("@/service/medicineTypeService"),
      import("@/service/medicineClassService"),
      import("@/service/medicineService"),
    ]);
  const [shapes, types, classes, medicines] = await Promise.all([
    getMedicineShapesDropdown(),
    getMedicineTypesDropdown(),
    getMedicineClassesDropdown(),
    getMedicinesDropdown(),
  ]);
  const wb = await buildMedicineTemplate({
    structured,
    format,
    lists: {
      shapes: (shapes.data ?? []).map((s) => s.name),
      types: (types.data ?? []).map((s) => s.name),
      classes: (classes.data ?? []).map((s) => s.name),
      units: (medicines.data ?? []).map((m) => m.unit),
    },
  });
  await downloadWorkbook(wb, `template-obat-${structured ? "terpisah" : "nama-lengkap"}-${today()}.xlsx`);
}

export async function downloadOpeningStockTemplate(): Promise<void> {
  const [{ getMedicinesDropdown }, { getDistributorsDropdown }] = await Promise.all([
    import("@/service/medicineService"),
    import("@/service/distributorService"),
  ]);
  const [medicines, distributors] = await Promise.all([getMedicinesDropdown(), getDistributorsDropdown()]);
  const wb = await buildOpeningStockTemplate({
    medicines: (medicines.data ?? []).map((m) => m.name),
    distributors: (distributors.data ?? []).map((d) => d.name),
  });
  await downloadWorkbook(wb, `template-saldo-stok-awal-${today()}.xlsx`);
}
