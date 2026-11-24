import type { CSSProperties, JSX } from "react";

import { currentNameCase } from "@/hooks/useNameFormat";
import { formatName } from "@/utils/nameFormat";
import { ORDER_LETTER_TITLE, type OrderLetterKind } from "@/utils/orderLetter";
import { terbilang } from "@/utils/terbilang";
import type { PurchaseOrder, PurchaseOrderPrintData } from "@/types/purchaseOrder";

// The special surat pesanan (narcotics, psychotropics, precursors, obat-obat
// tertentu). A regulatory document, so it is always in Indonesian, and styled
// inline because it is printed from its outerHTML.

const nm = (name: string): string => formatName(name, currentNameCase());

export type SpecialOrderLetterKind = Exclude<OrderLetterKind, "REGULAR">;

/** What the letter calls the goods, e.g. "narkotika" in "pesanan narkotika". */
const GOODS: Record<SpecialOrderLetterKind, string> = {
  NARCOTIC: "narkotika",
  PSYCHOTROPIC: "psikotropika",
  PRECURSOR: "obat mengandung prekursor farmasi",
  CERTAIN_DRUG: "obat-obat tertentu",
};

const fmtDate = (value: string | Date): string =>
  new Date(value).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });

const cell: CSSProperties = { border: "1px solid #000", padding: "4px 5px", verticalAlign: "top" };
const head: CSSProperties = { ...cell, fontWeight: "bold", textAlign: "center", backgroundColor: "#f2f2f2" };
const row: CSSProperties = { display: "grid", gridTemplateColumns: "34mm 4mm 1fr" };

function Fields({ rows }: { rows: [string, string][] }): JSX.Element {
  return (
    <div style={{ margin: "4px 0 10px 8mm" }}>
      {rows.map(([label, value]) => (
        <div key={label} style={row}>
          <span>{label}</span>
          <span>:</span>
          <span style={{ fontWeight: "bold" }}>{value || "-"}</span>
        </div>
      ))}
    </div>
  );
}

export interface SpecialOrderLetterProps {
  kind: SpecialOrderLetterKind;
  order: PurchaseOrder;
  printData: PurchaseOrderPrintData | null;
  /** Which copy this sheet is, e.g. "Lembar 1 · Asli untuk PBF". */
  copyLabel?: string;
}

export function SpecialOrderLetter({ kind, order, printData, copyLabel }: SpecialOrderLetterProps): JSX.Element {
  const goods = GOODS[kind];
  const pharmacy = printData?.pharmacy;
  const apj = printData?.headPharmacist;
  const distributor = printData?.distributor;

  return (
    <div
      style={{
        fontFamily: "'Times New Roman', Times, serif",
        width: "210mm",
        minHeight: "296mm", // a hair under A4 so a sheet never spills onto a second page
        padding: "14mm 16mm",
        backgroundColor: "#ffffff",
        color: "#000000",
        fontSize: "12px",
        lineHeight: "1.5",
        boxSizing: "border-box",
      }}
    >
      {copyLabel && (
        <div style={{ textAlign: "right", marginBottom: "4px" }}>
          <span style={{ border: "1px solid #000", padding: "1px 6px", fontSize: "10px", fontWeight: "bold" }}>{copyLabel}</span>
        </div>
      )}
      {/* Letterhead */}
      <div style={{ textAlign: "center", borderBottom: "3px double #000", paddingBottom: "6px", marginBottom: "12px" }}>
        <div style={{ fontSize: "18px", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "1px" }}>
          {pharmacy?.name ?? ""}
        </div>
        <div style={{ fontSize: "11px" }}>
          {pharmacy?.address}
          {pharmacy?.phone ? ` · Telp. ${pharmacy.phone}` : ""}
        </div>
        {pharmacy?.businessLicenseNumber && <div style={{ fontSize: "11px" }}>SIA: {pharmacy.businessLicenseNumber}</div>}
      </div>

      {/* Title */}
      <div style={{ textAlign: "center", marginBottom: "12px" }}>
        <div style={{ fontSize: "15px", fontWeight: "bold", textDecoration: "underline" }}>{ORDER_LETTER_TITLE[kind]}</div>
        <div>Nomor: {order.orderNumber}</div>
      </div>

      <div>Yang bertanda tangan di bawah ini:</div>
      <Fields
        rows={[
          ["Nama", apj?.name ?? ""],
          ["Jabatan", "Apoteker Penanggung Jawab"],
          ["Nomor SIPA", apj?.practiceLicenseNumber ?? ""],
        ]}
      />

      <div>Mengajukan pesanan {goods} kepada:</div>
      <Fields
        rows={[
          ["Nama PBF", distributor ? nm(distributor.name) : nm(order.distributor.name)],
          ["Alamat", distributor?.address ?? ""],
          ["Telepon", distributor?.phone ?? ""],
          ...(distributor?.permitNumber ? ([["Nomor izin", distributor.permitNumber]] as [string, string][]) : []),
        ]}
      />

      <div style={{ marginBottom: "6px" }}>Dengan {goods} yang dipesan sebagai berikut:</div>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "11px", marginBottom: "12px" }}>
        <thead>
          <tr>
            <th style={{ ...head, width: "7mm" }}>No</th>
            <th style={head}>Nama obat</th>
            <th style={head}>Zat aktif &amp; kekuatan</th>
            <th style={head}>Bentuk sediaan</th>
            <th style={{ ...head, width: "16mm" }}>Satuan</th>
            <th style={{ ...head, width: "14mm" }}>Jumlah</th>
            <th style={head}>Jumlah (terbilang)</th>
            <th style={head}>Ket.</th>
          </tr>
        </thead>
        <tbody>
          {order.details.map((d, i) => (
            <tr key={d.uuid}>
              <td style={{ ...cell, textAlign: "center" }}>{i + 1}</td>
              <td style={{ ...cell, fontWeight: "bold" }}>{nm(d.medicine.name)}</td>
              <td style={cell}>
                {d.medicine.ingredients.map((ing) => (ing.strength ? `${ing.name} ${ing.strength}` : ing.name)).join(", ") || "-"}
              </td>
              <td style={cell}>{d.medicine.shape?.name ?? "-"}</td>
              <td style={cell}>{d.unit}</td>
              <td style={{ ...cell, textAlign: "right" }}>{d.quantity}</td>
              <td style={cell}>{`${terbilang(d.quantity)} ${d.unit}`.toLowerCase()}</td>
              <td style={cell}>{d.description ?? ""}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div>{goods.charAt(0).toUpperCase() + goods.slice(1)} tersebut akan dipergunakan untuk keperluan apotek:</div>
      <Fields
        rows={[
          ["Nama apotek", pharmacy?.name ?? ""],
          ["Alamat", pharmacy?.address ?? ""],
          ["Nomor SIA", pharmacy?.businessLicenseNumber ?? ""],
        ]}
      />

      {/* Signature */}
      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "16px" }}>
        <div style={{ textAlign: "center", minWidth: "70mm" }}>
          <div>
            {pharmacy?.location || ".................."}, {fmtDate(order.orderedAt)}
          </div>
          <div>Apoteker Penanggung Jawab,</div>
          <div style={{ height: "24mm", fontSize: "10px", color: "#777", paddingTop: "8mm" }}>(tanda tangan &amp; stempel apotek)</div>
          <div style={{ fontWeight: "bold", textDecoration: "underline" }}>{apj?.name ?? "...................................."}</div>
          <div>SIPA: {apj?.practiceLicenseNumber ?? ".................."}</div>
        </div>
      </div>
    </div>
  );
}
