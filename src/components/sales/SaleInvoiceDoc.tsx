import type { JSX } from "react";
import type React from "react";
import type { Sale, PaymentMethod, PaymentStatus } from "@/types/sale";
import type { Pharmacy } from "@/types/pharmacy";
import type { Customer } from "@/types/customer";
import { translations } from "@/configs/i18n";
import { BiLabel, sl } from "@/utils/bilingualDoc";
import { formatCurrency } from "./salesUtils";
import { formatName } from "@/utils/nameFormat";
import { currentNameCase } from "@/hooks/useNameFormat";

/** Names follow the pharmacy's display setting; read at render (this may print outside the app tree). */
const nm = (name: string): string => formatName(name, currentNameCase());

const EN = translations.en;
const ID = translations.id;

function idPaymentMethod(method: PaymentMethod): string {
  const map: Record<PaymentMethod, string> = {
    CASH: ID.salePaymentMethodCash,
    TRANSFER: ID.salePaymentMethodTransfer,
    CREDIT: ID.salePaymentMethodCredit,
  };
  return map[method] ?? method;
}

function idPaymentStatus(status: PaymentStatus): string {
  const map: Record<PaymentStatus, string> = {
    UNPAID: ID.salePaymentStatusUnpaid,
    PARTIAL: ID.salePaymentStatusPartial,
    PAID: ID.salePaymentStatusPaid,
  };
  return map[status] ?? status;
}

export interface SaleInvoiceDocProps {
  sale: Sale;
  pharmacy: Pharmacy | null;
  customer: Customer | null;
}

function fmtDate(value: string): string {
  return new Date(value).toLocaleDateString("id-ID", {
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
}: SaleInvoiceDocProps): JSX.Element {
  const pharmacyName = pharmacy?.name ?? "";
  const lastHistory = sale.payment?.history[sale.payment.history.length - 1];
  const lastPaymentDate = lastHistory?.paymentDate ?? sale.soldAt;
  const isPaid = sale.payment?.paymentStatus === "PAID";
  const paymentMethodLabel = idPaymentMethod(lastHistory?.paymentMethod ?? "CASH");
  const paymentStatusLabel = idPaymentStatus(sale.payment?.paymentStatus ?? "UNPAID");
  const customerDisplayName = sale.customer.isWalkIn ? ID.posWalkInPatient : sale.customer.name;

  const sectionLabel: React.CSSProperties = {
    fontSize: "10px",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: COLOR.faint,
    marginBottom: "6px",
    fontWeight: 600,
  };

  const colHeaders: { id: string; label: React.ReactNode; align: "left" | "right"; w?: string }[] = [
    { id: "no",    label: "#",                                               align: "left",  w: "32px" },
    { id: "desc",  label: <BiLabel id={ID.saleDocItemDescription} en={EN.saleDocItemDescription} />, align: "left"  },
    { id: "qty",   label: ID.saleDocItemQty,                                  align: "right", w: "48px" },
    { id: "price", label: <BiLabel id={ID.saleDocItemPrice} en={EN.saleDocItemPrice} />,      align: "right", w: "110px" },
    { id: "amt",   label: <BiLabel id={ID.saleDocItemAmount} en={EN.saleDocItemAmount} />,    align: "right", w: "110px" },
  ];

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
                lineHeight: 1,
                marginBottom: "16px",
              }}
            >
              <div style={{ fontSize: "38px", fontWeight: 400, color: COLOR.ink }}>
                {ID.saleDocInvoiceTitle}
              </div>
              <div style={{ fontSize: "18px", fontWeight: 300, color: COLOR.muted, marginTop: "6px" }}>
                {EN.saleDocInvoiceTitle}
              </div>
            </div>
            <div style={{ fontSize: "12px", color: COLOR.muted, fontFamily: "'Courier New', monospace", lineHeight: 1.7 }}>
              <div>No. {sale.saleNumber}</div>
              <div>{fmtDate(sale.soldAt)} · {fmtTime(sale.soldAt)}</div>
            </div>
          </div>

          {/* Right: pharmacy info */}
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: "17px", fontWeight: 700, color: COLOR.ink, marginBottom: "6px" }}>
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
            <div style={sectionLabel}>
              <BiLabel id={ID.saleDocBilledTo} en={EN.saleDocBilledTo} />
            </div>
            <div style={{ fontSize: "14px", fontWeight: 700, marginBottom: "4px" }}>
              {nm(customerDisplayName)}
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
            <div style={sectionLabel}>
              <BiLabel id={ID.saleDocPaymentMethod} en={EN.saleDocPaymentMethod} />
            </div>
            <div style={{ fontSize: "14px", fontWeight: 700, marginBottom: "4px" }}>
              {paymentMethodLabel}
            </div>
            <div style={{ fontSize: "12px", color: COLOR.muted }}>
              {paymentStatusLabel}
              {isPaid ? ` · ${fmtDate(lastPaymentDate)} ${fmtTime(lastPaymentDate)}` : ""}
            </div>
          </div>
        </div>

        {/* ── Items table ────────────────────────────────── */}
        <div style={{ padding: "0 40px" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {colHeaders.map(({ id, label, align, w }) => (
                  <th
                    key={id}
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
                      verticalAlign: "top",
                    }}
                  >
                    {label}
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
                    <div style={{ fontSize: "13px", fontWeight: 600 }}>
                      {nm(item.medicine.name)}
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
              { key: "subtotal", label: ID.posSubtotal, value: formatCurrency(sale.totalAmount) },
              ...(sale.ppnPercentage > 0 ? [{ key: "ppn", label: `PPN ${sale.ppnPercentage}%`, value: formatCurrency(sale.ppnAmount) }] : []),
              ...(sale.discountAmount > 0 ? [{ key: "disc", label: sl(ID.posDiscountLabel, EN.posDiscountLabel), value: `-${formatCurrency(sale.discountAmount)}` }] : []),
            ].map(({ key, label, value }) => (
              <div
                key={key}
                style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: COLOR.muted, padding: "3px 0" }}
              >
                <span>{label}</span>
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
            alignItems: "flex-start",
            fontSize: "12px",
            color: COLOR.faint,
            background: COLOR.bg,
          }}
        >
          <span style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
            <span>{ID.saleDocThankYouTrust} {pharmacyName}.</span>
            <span style={{ fontStyle: "italic", fontSize: "0.9em", opacity: 0.7 }}>
              {EN.saleDocThankYouTrust} {pharmacyName}.
            </span>
          </span>
          {pharmacy?.email && (
            <span style={{ display: "flex", flexDirection: "column", gap: "2px", textAlign: "right" }}>
              <span>{ID.saleDocQuestions} {pharmacy.email}</span>
              <span style={{ fontStyle: "italic", fontSize: "0.9em", opacity: 0.7 }}>
                {EN.saleDocQuestions} {pharmacy.email}
              </span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
