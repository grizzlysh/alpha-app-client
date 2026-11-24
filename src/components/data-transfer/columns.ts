import type { SheetColumn } from "./spreadsheet";
import { writeSheet } from "./spreadsheet";
import { exportCustomers, exportDistributors } from "@/service/dataTransferService";

// Sheet layouts. Headers are Indonesian; the English field names are accepted too.

export const DISTRIBUTOR_COLUMNS: SheetColumn[] = [
  { field: "name", header: "Nama", aliases: ["nama distributor", "pbf"] },
  { field: "phone", header: "Telepon", aliases: ["no. telepon", "telp", "hp", "phone"] },
  { field: "email", header: "Email" },
  { field: "address", header: "Alamat", aliases: ["address"] },
  { field: "contactPerson", header: "Kontak", aliases: ["contact person", "narahubung"] },
  { field: "permitNumber", header: "No. Izin PBF", aliases: ["no izin", "izin", "permit number"] },
];

export const CUSTOMER_COLUMNS: SheetColumn[] = [
  { field: "name", header: "Nama", aliases: ["nama pasien"] },
  { field: "phone", header: "Telepon", aliases: ["no. telepon", "telp", "hp", "phone"] },
  { field: "address", header: "Alamat", aliases: ["address"] },
  { field: "gender", header: "Jenis Kelamin", aliases: ["jk", "gender", "l/p"] },
  { field: "dateOfBirth", header: "Tanggal Lahir", aliases: ["tgl lahir", "date of birth"], date: true },
  { field: "nik", header: "NIK" },
  { field: "bpjsNumber", header: "No. BPJS", aliases: ["bpjs"] },
];

export const OPENING_STOCK_COLUMNS: SheetColumn[] = [
  { field: "medicine", header: "Nama Obat", aliases: ["obat", "nama", "medicine"] },
  { field: "batchNumber", header: "No. Batch", aliases: ["batch"] },
  { field: "expiryDate", header: "Kedaluwarsa", aliases: ["expired", "ed", "tgl kedaluwarsa", "expiry date"], date: true },
  { field: "quantityPieces", header: "Jumlah (pcs)", aliases: ["jumlah", "qty", "stok"], numeric: true },
  { field: "purchasePrice", header: "Harga Beli / pcs", aliases: ["harga beli", "hpp"], numeric: true },
  { field: "sellingPrice", header: "Harga Jual / pcs", aliases: ["harga jual"], numeric: true },
  { field: "distributor", header: "Distributor", aliases: ["pbf", "supplier"] },
];

const today = (): string => new Date().toISOString().slice(0, 10);
const slug = (s: string): string => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "apotek";

export async function downloadDistributors(pharmacyName: string): Promise<void> {
  const rows = (await exportDistributors()).data ?? [];
  writeSheet(`distributor-${slug(pharmacyName)}-${today()}.xlsx`, "Distributor", DISTRIBUTOR_COLUMNS,
    rows.map((d) => [d.name, d.phone, d.email, d.address, d.contactPerson, d.permitNumber]));
}

export async function downloadCustomers(pharmacyName: string): Promise<void> {
  const rows = (await exportCustomers()).data ?? [];
  const genderLabel = (g: string | null) => (g === "MALE" || g === "L" ? "L" : g === "FEMALE" || g === "P" ? "P" : g);
  writeSheet(`pasien-${slug(pharmacyName)}-${today()}.xlsx`, "Pasien",
    [...CUSTOMER_COLUMNS, { field: "medicalRecordNumber", header: "No. Rekam Medis" }],
    rows.map((c) => [c.name, c.phone, c.address, genderLabel(c.gender), c.dateOfBirth, c.nik, c.bpjsNumber, c.medicalRecordNumber]));
}
