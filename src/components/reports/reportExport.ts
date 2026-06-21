import * as XLSX from "xlsx";

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

export function exportToXlsx(filename: string, sheets: ExportSheet[]): void {
  const wb = XLSX.utils.book_new();
  for (const sheet of sheets) {
    const ws = XLSX.utils.aoa_to_sheet([sheet.headers, ...sheet.rows]);
    XLSX.utils.book_append_sheet(wb, ws, sheet.name.slice(0, 31));
  }
  XLSX.writeFile(wb, filename);
}
