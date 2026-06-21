import type { JSX } from "react";

import type { PurchaseOrder, PurchaseOrderPrintData } from "@/types/purchaseOrder";
import { useLanguage } from "@/hooks/useLanguage";

export interface PurchaseOrderReceiptProps {
  order: PurchaseOrder;
  printData: PurchaseOrderPrintData | null;
}

export function PurchaseOrderReceipt({
  order,
  printData,
}: PurchaseOrderReceiptProps): JSX.Element {
  const { t, language } = useLanguage();

  const headPharmacist = printData?.headPharmacist ?? null;
  const pharmacy = printData?.pharmacy ?? null;

  const sysdate = new Date().toLocaleDateString(
    language === "id" ? "id-ID" : "en-GB",
    { day: "numeric", month: "long", year: "numeric" }
  );

  const orderDate = new Date(order.orderedAt).toLocaleDateString(
    language === "id" ? "id-ID" : "en-GB",
    { day: "numeric", month: "long", year: "numeric" }
  );

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
          marginBottom: "6px",
        }}
      >
        {/* Pharmacist block */}
        <div>
          <div style={{ fontWeight: "bold" }}>{t.poReceiptPraktikApoteker}</div>
          {headPharmacist && (
            <>
              <div style={{ fontWeight: "bold" }}>{headPharmacist.name}</div>
              <div>{headPharmacist.practiceLicenseNumber}</div>
            </>
          )}
        </div>

        {/* Order reference */}
        <div style={{ textAlign: "right", fontSize: "10px", color: "#333" }}>
          <div>No. {order.orderNumber}</div>
          <div>{orderDate}</div>
        </div>
      </div>

      {/* Pharmacy block */}
      <div
        style={{
          borderBottom: "2px solid #000",
          paddingBottom: "8px",
          marginBottom: "10px",
        }}
      >
        <div
          style={{
            fontSize: "15px",
            fontWeight: "bold",
            letterSpacing: "1px",
            marginBottom: "1px",
          }}
        >
          {pharmacy?.name ?? ""}
        </div>
        {pharmacy?.businessLicenseNumber && (
          <div style={{ fontSize: "10px" }}>
            {pharmacy.businessLicenseNumber}
          </div>
        )}
        {pharmacy?.address && (
          <div style={{ fontSize: "10px", color: "#333" }}>
            {pharmacy.address}
          </div>
        )}
      </div>

      {/* Recipient */}
      <div style={{ marginBottom: "10px", fontSize: "11px" }}>
        <span>{t.poReceiptKepada} </span>
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
            <th
              style={{ textAlign: "left", padding: "4px 2px", width: "20px" }}
            >
              #
            </th>
            <th style={{ textAlign: "left", padding: "4px 6px" }}>
              {t.poItemMedicine}
            </th>
            <th
              style={{
                textAlign: "right",
                padding: "4px 6px",
                width: "50px",
              }}
            >
              {t.poItemQuantity}
            </th>
            <th
              style={{
                textAlign: "left",
                padding: "4px 6px",
                width: "60px",
              }}
            >
              {t.poItemUnit}
            </th>
            <th style={{ textAlign: "left", padding: "4px 6px" }}>
              {t.poItemDescription}
            </th>
          </tr>
        </thead>
        <tbody>
          {order.details.map((item, i) => (
            <tr key={item.uuid} style={{ borderBottom: "1px dotted #ccc" }}>
              <td
                style={{
                  padding: "4px 2px",
                  verticalAlign: "top",
                  color: "#555",
                }}
              >
                {i + 1}
              </td>
              <td
                style={{
                  padding: "4px 6px",
                  verticalAlign: "top",
                  fontWeight: "bold",
                }}
              >
                <span style={{ textTransform: "uppercase" }}>{item.medicine.name}</span>
              </td>
              <td
                style={{
                  padding: "4px 6px",
                  textAlign: "right",
                  verticalAlign: "top",
                }}
              >
                {item.quantity}
              </td>
              <td
                style={{
                  padding: "4px 6px",
                  verticalAlign: "top",
                  color: "#555",
                }}
              >
                {item.unit}
              </td>
              <td
                style={{
                  padding: "4px 6px",
                  verticalAlign: "top",
                  color: "#555",
                  fontSize: "10px",
                }}
              >
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
          {t.poReceiptTotalItems}: {order.details.length}
        </span>
      </div>

      {/* Signature — right-aligned */}
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <div
          style={{ textAlign: "center", fontSize: "11px", minWidth: "180px" }}
        >
          <div style={{ marginBottom: "2px" }}>
            {".................."}, {sysdate}
          </div>
          <div style={{ marginBottom: "48px" }}>
            {t.poReceiptPenanggungJawab}
          </div>
          {headPharmacist && (
            <>
              <div style={{ fontWeight: "bold" }}>{headPharmacist.name}</div>
              <div>{headPharmacist.practiceLicenseNumber}</div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
