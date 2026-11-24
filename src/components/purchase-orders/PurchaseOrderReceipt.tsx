import type { JSX } from "react";

import type { PurchaseOrder, PurchaseOrderPrintData } from "@/types/purchaseOrder";
import { translations } from "@/configs/i18n";
import { BiLabel, sl } from "@/utils/bilingualDoc";

const EN = translations.en;
const ID = translations.id;

export interface PurchaseOrderReceiptProps {
  order: PurchaseOrder;
  printData: PurchaseOrderPrintData | null;
}

function fmtDate(value: string | Date): string {
  return new Date(value).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function PurchaseOrderReceipt({
  order,
  printData,
}: PurchaseOrderReceiptProps): JSX.Element {
  const headPharmacist = printData?.headPharmacist ?? null;
  const pharmacy = printData?.pharmacy ?? null;

  const sysdate = fmtDate(new Date());
  const orderDate = fmtDate(order.orderedAt);

  return (
    <div
      id="po-receipt"
      style={{
        fontFamily: "'Courier New', Courier, monospace",
        width: "210mm",
        minHeight: "148mm",
        padding: "12mm 14mm",
        backgroundColor: "#ffffff",
        color: "#000000",
        fontSize: "11px",
        lineHeight: "1.6",
      }}
    >
      {/* Header row: pharmacist info (left) + order reference (right) */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "8px",
        }}
      >
        {/* Pharmacist block */}
        <div style={{ lineHeight: "1.5" }}>
          <div
            style={{
              fontSize: "12px",
              fontWeight: "bold",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              color: "#222",
            }}
          >
            <BiLabel id={ID.poReceiptPraktikApoteker} en={EN.poReceiptPraktikApoteker} />
          </div>
          {headPharmacist && (
            <>
              <div style={{ fontSize: "18px", fontWeight: "bold", lineHeight: "1.3" }}>
                {headPharmacist.name}
              </div>
              <div style={{ fontSize: "10px", color: "#444", marginTop: "1px" }}>
                SIP: {headPharmacist.practiceLicenseNumber}
              </div>
            </>
          )}
        </div>

        {/* Order reference */}
        <div style={{ textAlign: "right", fontSize: "10px", color: "#444", lineHeight: "1.6" }}>
          <div style={{ fontWeight: "bold" }}>No. {order.orderNumber}</div>
          <div>{orderDate}</div>
        </div>
      </div>

      {/* Pharmacy block */}
      <div
        style={{
          borderTop: "1px solid #000",
          borderBottom: "2px solid #000",
          paddingTop: "7px",
          paddingBottom: "8px",
          marginBottom: "12px",
        }}
      >
        <div
          style={{
            fontSize: "20px",
            fontWeight: "bold",
            letterSpacing: "1px",
            textTransform: "uppercase",
            marginBottom: "2px",
          }}
        >
          {pharmacy?.name ?? ""}
        </div>
        {pharmacy?.businessLicenseNumber && (
          <div style={{ fontSize: "10px", color: "#333" }}>
            SIA: {pharmacy.businessLicenseNumber}
          </div>
        )}
        {pharmacy?.address && (
          <div style={{ fontSize: "10px", color: "#555", marginTop: "1px" }}>
            {pharmacy.address}
          </div>
        )}
      </div>

      {/* Recipient */}
      <div style={{ marginBottom: "10px", fontSize: "11px" }}>
        <span>{sl(ID.poReceiptKepada, EN.poReceiptKepada)} </span>
        <span style={{ fontWeight: "bold", textTransform: "uppercase" }}>{order.distributor.name}</span>
      </div>

      {/* Items table */}
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          fontSize: "11px",
          marginBottom: "8px",
        }}
      >
        <thead>
          <tr
            style={{
              borderBottom: "1px solid #000",
              borderTop: "1px solid #000",
            }}
          >
            <th style={{ textAlign: "left", padding: "4px 2px", width: "20px", verticalAlign: "top" }}>
              #
            </th>
            <th style={{ textAlign: "left", padding: "4px 6px", verticalAlign: "top" }}>
              <BiLabel id={ID.poItemMedicine} en={EN.poItemMedicine} />
            </th>
            <th style={{ textAlign: "right", padding: "4px 6px", width: "50px", verticalAlign: "top" }}>
              {ID.poItemQuantity}
            </th>
            <th style={{ textAlign: "left", padding: "4px 6px", width: "60px", verticalAlign: "top" }}>
              <BiLabel id={ID.poItemUnit} en={EN.poItemUnit} />
            </th>
            <th style={{ textAlign: "left", padding: "4px 6px", verticalAlign: "top" }}>
              <BiLabel id={ID.poItemDescription} en={EN.poItemDescription} />
            </th>
          </tr>
        </thead>
        <tbody>
          {order.details.map((item, i) => (
            <tr key={item.uuid} style={{ borderBottom: "1px dotted #ccc" }}>
              <td style={{ padding: "4px 2px", verticalAlign: "top", color: "#555" }}>
                {i + 1}
              </td>
              <td style={{ padding: "4px 6px", verticalAlign: "top", fontWeight: "bold" }}>
                <span style={{ textTransform: "uppercase" }}>{item.medicine.name}</span>
              </td>
              <td style={{ padding: "4px 6px", textAlign: "right", verticalAlign: "top" }}>
                {item.quantity}
              </td>
              <td style={{ padding: "4px 6px", verticalAlign: "top", color: "#555" }}>
                {item.unit}
              </td>
              <td style={{ padding: "4px 6px", verticalAlign: "top", color: "#555", fontSize: "10px" }}>
                {item.description ?? ""}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Total items */}
      <div
        style={{
          borderTop: "1px dashed #000",
          paddingTop: "6px",
          marginBottom: "24px",
          fontSize: "11px",
        }}
      >
        <span style={{ fontWeight: "bold" }}>
          {sl(ID.poReceiptTotalItems, EN.poReceiptTotalItems)}: {order.details.length}
        </span>
      </div>

      {/* Signature — right-aligned */}
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <div style={{ textAlign: "center", fontSize: "11px", minWidth: "180px" }}>
          <div style={{ marginBottom: "2px" }}>
            {pharmacy?.location ?? ".................."}, {sysdate}
          </div>
          <div style={{ marginBottom: "48px" }}>
            <BiLabel id={ID.poReceiptPenanggungJawab} en={EN.poReceiptPenanggungJawab} />
          </div>
          {headPharmacist && (
            <>
              <div style={{ fontWeight: "bold" }}>{headPharmacist.name}</div>
              <div style={{ fontSize: "10px", color: "#444" }}>SIP: {headPharmacist.practiceLicenseNumber}</div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
