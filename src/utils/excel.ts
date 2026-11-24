// Thin wrapper over exceljs. The library is ~1 MB, so it is loaded on first use
// rather than with the page that offers an export or import button.
import type { Workbook, Worksheet, CellValue } from "exceljs";

export type { Workbook, Worksheet };
export type Cell = string | number | boolean | Date | null | undefined;

export async function newWorkbook(): Promise<Workbook> {
  const { default: ExcelJS } = await import("exceljs");
  const wb = new ExcelJS.Workbook();
  wb.creator = "PharmaCare";
  wb.created = new Date();
  return wb;
}

export async function loadWorkbook(source: Blob | ArrayBuffer | Uint8Array): Promise<Workbook> {
  const wb = await newWorkbook();
  const data = source instanceof Blob ? await source.arrayBuffer() : source;
  await wb.xlsx.load(data as ArrayBuffer);
  return wb;
}

/** Adds a sheet from rows; the first row is styled as a bold header and frozen. */
export function addSheet(wb: Workbook, name: string, rows: Cell[][], opts: { header?: boolean } = {}): Worksheet {
  const ws = wb.addWorksheet(name.replace(/[\\/?*[\]:]/g, " ").slice(0, 31));
  for (const r of rows) ws.addRow(r.map((v) => (v === undefined ? null : v)));
  if (opts.header !== false && rows.length > 0) {
    ws.getRow(1).font = { bold: true };
    ws.views = [{ state: "frozen", ySplit: 1 }];
  }
  autoWidth(ws);
  return ws;
}

export function autoWidth(ws: Worksheet, min = 8, max = 48): void {
  ws.columns.forEach((col) => {
    let w = min;
    col.eachCell?.({ includeEmpty: false }, (c) => {
      w = Math.max(w, String(plain(c.value) ?? "").length + 2);
    });
    col.width = Math.min(w, max);
  });
}

/** Excel's own value shapes (rich text, formulas, links) flattened to what a user sees. */
export function plain(v: CellValue): Cell {
  if (v === null || v === undefined) return "";
  if (v instanceof Date || typeof v !== "object") return v as Cell;
  if ("richText" in v) return v.richText.map((t) => t.text).join("");
  if ("text" in v && typeof v.text === "string") return v.text;
  if ("result" in v) return plain(v.result as CellValue);
  if ("error" in v) return "";
  return String(v);
}

/** The sheet as a grid of values (row 1 first). Blank rows are dropped; missing cells are "". */
export function sheetToGrid(ws: Worksheet | undefined): Cell[][] {
  if (!ws) return [];
  const width = ws.columnCount;
  const grid: Cell[][] = [];
  ws.eachRow({ includeEmpty: false }, (row) => {
    const out: Cell[] = [];
    for (let c = 1; c <= width; c++) out.push(plain(row.getCell(c).value));
    if (out.some((v) => v !== "" && v !== null)) grid.push(out);
  });
  return grid;
}

/** Finds a sheet by any of its accepted names (case-insensitive). */
export function findSheet(wb: Workbook, names: string[]): Worksheet | undefined {
  const wanted = names.map((n) => n.trim().toLowerCase());
  return wb.worksheets.find((ws) => wanted.includes(ws.name.trim().toLowerCase()));
}

/**
 * A drop-down on a column, fed from a range (usually a hidden list sheet).
 * Excel caps an inline list at 255 characters, so lists always go through a range.
 */
export function addListValidation(
  ws: Worksheet,
  column: number,
  sourceRange: string,
  opts: { fromRow?: number; toRow?: number; strict?: boolean; prompt?: string } = {}
): void {
  const from = opts.fromRow ?? 2;
  const to = opts.toRow ?? 1000;
  const strict = opts.strict ?? true;
  for (let r = from; r <= to; r++) {
    ws.getCell(r, column).dataValidation = {
      type: "list",
      allowBlank: true,
      formulae: [sourceRange],
      showErrorMessage: strict,
      errorStyle: strict ? "stop" : "warning",
      errorTitle: "Pilihan tidak valid",
      error: "Pilih salah satu nilai dari daftar.",
      ...(opts.prompt ? { showInputMessage: true, prompt: opts.prompt } : {}),
    };
  }
}

/**
 * Writes `values` to a column of a (hidden) list sheet and returns the absolute
 * range for a list validation, e.g. `'Daftar'!$A$2:$A$48`.
 */
export function addList(listSheet: Worksheet, column: number, title: string, values: string[]): string {
  listSheet.getCell(1, column).value = title;
  listSheet.getCell(1, column).font = { bold: true };
  values.forEach((v, i) => (listSheet.getCell(i + 2, column).value = v));
  const letter = listSheet.getColumn(column).letter;
  const last = Math.max(values.length + 1, 2);
  return `'${listSheet.name.replace(/'/g, "''")}'!$${letter}$2:$${letter}$${last}`;
}

export async function downloadWorkbook(wb: Workbook, filename: string): Promise<void> {
  const buf = await wb.xlsx.writeBuffer();
  const blob = new Blob([buf], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
