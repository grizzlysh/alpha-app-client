import type { JSX } from "react";
import type { Sale } from "@/types/sale";
import type { Pharmacy } from "@/types/pharmacy";
import type { Customer } from "@/types/customer";
import type { Translations } from "@/configs/i18n";
import { formatCurrency } from "./salesUtils";

export interface SaleInvoiceDocProps {
  sale: Sale;
  pharmacy: Pharmacy | null;
  customer: Customer | null;
  paymentMethodLabel: string;
  paymentStatusLabel: string;
  t: Translations;
  language: string;
}

function fmtDate(value: string, language: string): string {
  return new Date(value).toLocaleDateString(language === "id" ? "id-ID" : "en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function fmtTime(value: string): string {
  return new Date(value).toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

const COLOR = {
  ink: "#1a1a1a",
  muted: "#6b6b6b",
  faint: "#9a9a9a",
  border: "#e2e2e2",
  borderLight: "#ececec",
  bg: "#f7f7f5",
  card: "#ffffff",
} as const;

export function SaleInvoiceDoc({
  sale,
  pharmacy,
  customer,
  paymentMethodLabel,
  paymentStatusLabel,
  t,
  language,
}: SaleInvoiceDocProps): JSX.Element {
  const pharmacyName = pharmacy?.name ?? "";
  const lastPaymentDate =
    sale.payment?.history[sale.payment.history.length - 1]?.paymentDate ?? sale.soldAt;
  const isPaid = sale.payment?.paymentStatus === "PAID";

  const label: React.CSSProperties = {
    fontSize: "10px",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: COLOR.faint,
    marginBottom: "6px",
    fontWeight: 600,
  };

  return (
    <div
      style={{
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        background: COLOR.bg,
        color: COLOR.ink,
        margin: 0,
        padding: "32px 24px",
        minWidth: "740px",
      }}
    >
      <div
        style={{
          maxWidth: "740px",
          margin: "0 auto",
          background: COLOR.card,
          border: `1px solid ${COLOR.border}`,
          borderRadius: "12px",
          overflow: "hidden",
        }}
      >
        {/* ── Header ─────────────────────────────────────── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "24px",
            padding: "36px 40px 28px",
            borderBottom: `1px solid ${COLOR.border}`,
          }}
        >
          {/* Left: invoice title + number + date */}
          <div>
            <div
              style={{
                fontFamily: "Georgia, 'Times New Roman', serif",
                fontStyle: "italic",
                fontSize: "38px",
                fontWeight: 400,
                color: COLOR.ink,
                lineHeight: 1,
                marginBottom: "16px",
              }}
            >
              {t.saleDocInvoiceTitle}
            </div>
            <div style={{ fontSize: "12px", color: COLOR.muted, fontFamily: "'Courier New', monospace", lineHeight: 1.7 }}>
              <div>No. {sale.saleNumber}</div>
              <div>{fmtDate(sale.soldAt, language)} · {fmtTime(sale.soldAt)}</div>
            </div>
          </div>

          {/* Right: pharmacy info — all right-aligned, no badge */}
          <div style={{ textAlign: "right" }}>
            <div
              style={{
                fontSize: "17px",
                fontWeight: 700,
                color: COLOR.ink,
                marginBottom: "6px",
              }}
            >
              {pharmacyName}
            </div>
            {pharmacy?.address && (
              <div style={{ fontSize: "12px", color: COLOR.muted }}>{pharmacy.address}</div>
            )}
            {pharmacy?.phone && (
              <div style={{ fontSize: "12px", color: COLOR.muted }}>{pharmacy.phone}</div>
            )}
            {pharmacy?.email && (
              <div style={{ fontSize: "12px", color: COLOR.muted }}>{pharmacy.email}</div>
            )}
          </div>
        </div>

        {/* ── Bill to / Payment ──────────────────────────── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "24px",
            padding: "24px 40px",
            borderBottom: `1px solid ${COLOR.border}`,
          }}
        >
          <div>
            <div style={label}>{t.saleDocBilledTo}</div>
            <div style={{ fontSize: "14px", fontWeight: 700, textTransform: "uppercase", marginBottom: "4px" }}>
              {sale.customer.name}
            </div>
            {customer?.phone && (
              <div style={{ fontSize: "12px", color: COLOR.muted, fontFamily: "'Courier New', monospace" }}>
                {customer.phone}
              </div>
            )}
            {customer?.address && (
              <div style={{ fontSize: "12px", color: COLOR.muted }}>{customer.address}</div>
            )}
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={label}>{t.saleDocPaymentMethod}</div>
            <div style={{ fontSize: "14px", fontWeight: 700, marginBottom: "4px" }}>
              {paymentMethodLabel}
            </div>
            <div style={{ fontSize: "12px", color: COLOR.muted }}>
              {paymentStatusLabel}
              {isPaid ? ` · ${fmtDate(lastPaymentDate, language)} ${fmtTime(lastPaymentDate)}` : ""}
            </div>
          </div>
        </div>

        {/* ── Items table ────────────────────────────────── */}
        <div style={{ padding: "0 40px" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {[
                  { text: "#", align: "left" as const, w: "32px" },
                  { text: t.saleDocItemDescription, align: "left" as const },
                  { text: t.saleDocItemQty, align: "right" as const, w: "48px" },
                  { text: t.saleDocItemPrice, align: "right" as const, w: "110px" },
                  { text: t.saleDocItemAmount, align: "right" as const, w: "110px" },
                ].map(({ text, align, w }) => (
                  <th
                    key={text}
                    style={{
                      textAlign: align,
                      fontSize: "10px",
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      color: COLOR.faint,
                      fontWeight: 600,
                      padding: "16px 0 10px",
                      borderBottom: `1px solid ${COLOR.border}`,
                      width: w,
                    }}
                  >
                    {text}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sale.details.map((item, index) => (
                <tr key={item.uuid} style={{ borderBottom: `1px solid ${COLOR.borderLight}` }}>
                  <td style={{ padding: "12px 0", color: COLOR.faint, fontSize: "12px", verticalAlign: "top" }}>
                    {index + 1}
                  </td>
                  <td style={{ padding: "12px 8px 12px 0", verticalAlign: "top" }}>
                    <div style={{ fontSize: "13px", fontWeight: 600, textTransform: "uppercase" }}>
                      {item.medicine.name}
                    </div>
                    <div style={{ fontSize: "11px", color: COLOR.faint, fontFamily: "'Courier New', monospace", marginTop: "2px" }}>
                      {item.stockDetail.batchNumber} · {item.quantityPieces} {item.medicine.unit}
                    </div>
                  </td>
                  <td style={{ padding: "12px 0", textAlign: "right", fontSize: "13px", verticalAlign: "top" }}>
                    {item.quantityPieces}
                  </td>
                  <td style={{ padding: "12px 0", textAlign: "right", fontSize: "13px", verticalAlign: "top" }}>
                    {formatCurrency(item.sellingPrice)}
                  </td>
                  <td style={{ padding: "12px 0", textAlign: "right", fontSize: "13px", verticalAlign: "top", fontWeight: 500 }}>
                    {formatCurrency(item.totalAmount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ── Summary ────────────────────────────────────── */}
        <div style={{ padding: "16px 40px 28px", display: "flex", justifyContent: "flex-end" }}>
          <div style={{ width: "260px" }}>
            {[
              { label: t.posSubtotal, value: formatCurrency(sale.totalAmount) },
              ...(sale.ppnPercentage > 0 ? [{ label: `PPN ${sale.ppnPercentage}%`, value: formatCurrency(sale.ppnAmount) }] : []),
              ...(sale.discountAmount > 0 ? [{ label: t.posDiscountLabel, value: `-${formatCurrency(sale.discountAmount)}` }] : []),
            ].map(({ label: l, value }) => (
              <div
                key={l}
                style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: COLOR.muted, padding: "3px 0" }}
              >
                <span>{l}</span>
                <span>{value}</span>
              </div>
            ))}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "16px",
                fontWeight: 700,
                color: COLOR.ink,
                borderTop: `1px solid ${COLOR.border}`,
                marginTop: "10px",
                paddingTop: "10px",
              }}
            >
              <span>Total</span>
              <span>{formatCurrency(sale.grandTotal)}</span>
            </div>
          </div>
        </div>

        {/* ── Footer ─────────────────────────────────────── */}
        <div
          style={{
            borderTop: `1px solid ${COLOR.border}`,
            padding: "16px 40px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: "12px",
            color: COLOR.faint,
            background: COLOR.bg,
          }}
        >
          <span>{t.saleDocThankYouTrust} {pharmacyName}.</span>
          {pharmacy?.email && <span>{t.saleDocQuestions} {pharmacy.email}</span>}
        </div>
      </div>
    </div>
  );
}
