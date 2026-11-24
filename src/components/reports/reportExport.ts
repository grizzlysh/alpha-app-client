import { addSheet, downloadWorkbook, newWorkbook } from "@/utils/excel";

export interface ExportSheet {
  name: string;
  headers: string[];
  rows: (string | number | null)[][];
}

function triggerDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function exportToCsv(filename: string, headers: string[], rows: (string | number | null)[][]): void {
  const lines = [
    headers.join(","),
    ...rows.map((row) =>
      row
        .map((cell) => {
          const val = cell === null || cell === undefined ? "" : String(cell);
          return val.includes(",") || val.includes('"') || val.includes("\n")
            ? `"${val.replace(/"/g, '""')}"`
            : val;
        })
        .join(",")
    ),
  ];
  const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8;" });
  triggerDownload(blob, filename);
}

export async function exportToXlsx(filename: string, sheets: ExportSheet[]): Promise<void> {
  const wb = await newWorkbook();
  for (const sheet of sheets) addSheet(wb, sheet.name, [sheet.headers, ...sheet.rows]);
  await downloadWorkbook(wb, filename);
}
