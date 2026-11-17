import * as XLSX from "xlsx";
import type { ImportRow } from "@/types/dataTransfer";

/** One column of an import/export sheet: its field, Indonesian header and accepted header spellings. */
export interface SheetColumn {
  field: string;
  header: string;
  aliases?: string[];
  numeric?: boolean;
  date?: boolean;
}

const norm = (v: unknown): string => String(v ?? "").trim().toLowerCase();

const isoDate = (d: Date): string =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

export class SheetEmptyError extends Error {}

/** Numbers typed as text: "1.000" / "1.250,50" (Indonesian), "1,000.5", "Rp 3.500". */
export function parseNumber(v: unknown): number | undefined {
  if (typeof v === "number") return v;
  let s = String(v ?? "").replace(/[^\d.,-]/g, "");
  if (!s) return undefined;
  if (/^-?\d{1,3}(\.\d{3})+(,\d+)?$/.test(s)) s = s.replace(/\./g, "").replace(",", ".");
  else if (/^-?\d{1,3}(,\d{3})+(\.\d+)?$/.test(s)) s = s.replace(/,/g, "");
  else s = s.replace(",", ".");
  const n = Number(s);
  return Number.isFinite(n) ? n : undefined;
}

/** Reads the first sheet; columns are matched by header text, unknown columns are ignored. */
export async function readSheet(file: File, columns: SheetColumn[]): Promise<ImportRow[]> {
  const wb = XLSX.read(await file.arrayBuffer(), { type: "array", cellDates: true });
  const ws = wb.Sheets[wb.SheetNames[0]];
  const grid = ws ? XLSX.utils.sheet_to_json<unknown[]>(ws, { header: 1, blankrows: false, defval: "" }) : [];
  if (grid.length < 2) throw new SheetEmptyError();
  const header = grid[0].map(norm);
  const idx = columns.map((c) => header.findIndex((h) => [c.header, c.field, ...(c.aliases ?? [])].map(norm).includes(h)));

  const rows = grid.slice(1).map((r) => {
    const row: ImportRow = {};
    columns.forEach((c, i) => {
      const v = idx[i] >= 0 ? r[idx[i]] : "";
      if (v instanceof Date) row[c.field] = isoDate(v);
      else if (c.numeric) row[c.field] = parseNumber(v);
      else row[c.field] = String(v ?? "").trim();
    });
    return row;
  }).filter((r) => Object.values(r).some((v) => v !== "" && v !== undefined));
  if (rows.length === 0) throw new SheetEmptyError();
  return rows;
}

export function writeSheet(filename: string, sheetName: string, columns: SheetColumn[], rows: (string | number | null)[][]): void {
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet([columns.map((c) => c.header), ...rows]), sheetName);
  XLSX.writeFile(wb, filename);
}
