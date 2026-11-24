import type { JSX } from "react";
import type React from "react";
import type { Sale, PaymentMethod } from "@/types/sale";
import type { Pharmacy } from "@/types/pharmacy";
import { translations } from "@/configs/i18n";
import { sl } from "@/utils/bilingualDoc";
import { formatCurrency } from "./salesUtils";

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

export interface SaleReceiptDocProps {
  sale: Sale;
  pharmacy: Pharmacy | null;
  cashierName: string;
  amountReceived: number;
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

export function SaleReceiptDoc({
  sale,
  pharmacy,
  cashierName,
  amountReceived,
}: SaleReceiptDocProps): JSX.Element {
  const change = amountReceived - sale.grandTotal;
  const lastPaymentMethod = sale.payment?.history[sale.payment.history.length - 1]?.paymentMethod ?? "CASH";
  const paymentMethodLabel = idPaymentMethod(lastPaymentMethod);

  const row: React.CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "baseline",
    padding: "3px 0",
    fontSize: "13px",
  };
  const divider: React.CSSProperties = {
    borderTop: "1px dashed #c0c0c0",
    margin: "12px 0",
  };

  return (
    <div
      style={{
        fontFamily: "'Courier New', Courier, monospace",
        color: "#1a1a1a",
        backgroundColor: "#ffffff",
        width: "320px",
        padding: "28px 24px",
        boxSizing: "border-box",
      }}
    >
      {/* ── Header ───────────────────────────────── */}
      <div style={{ textAlign: "center", marginBottom: "16px" }}>
        <div style={{ fontSize: "15px", fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase" }}>
          {pharmacy?.name ?? ""}
        </div>
        {pharmacy?.address && (
          <div style={{ fontSize: "11px", color: "#666", marginTop: "3px", lineHeight: 1.4 }}>
            {pharmacy.address}
          </div>
        )}
        {pharmacy?.phone && (
          <div style={{ fontSize: "11px", color: "#666" }}>{pharmacy.phone}</div>
        )}
      </div>

      <div style={divider} />

      {/* ── Sale info ────────────────────────────── */}
      <div style={{ textAlign: "center", marginBottom: "12px", fontSize: "11px", color: "#555" }}>
        <div style={{ fontWeight: 600, fontSize: "12px", letterSpacing: "0.03em" }}>{sale.saleNumber}</div>
        <div style={{ marginTop: "2px" }}>
          {fmtDate(sale.soldAt)} · {fmtTime(sale.soldAt)}
        </div>
      </div>

      <div style={divider} />

      {/* ── Items ────────────────────────────────── */}
      <div style={{ marginBottom: "4px" }}>
        {sale.details.map((item) => (
          <div key={item.uuid} style={{ marginBottom: "6px" }}>
            <div style={{ fontSize: "12px", fontWeight: 700, textTransform: "uppercase" }}>
              {item.medicine.name}
            </div>
            <div style={{ ...row, color: "#555", fontSize: "12px" }}>
              <span>{item.quantityPieces} x {formatCurrency(item.sellingPrice)}</span>
              <span>{formatCurrency(item.totalAmount)}</span>
            </div>
          </div>
        ))}
      </div>

      <div style={divider} />

      {/* ── Totals ───────────────────────────────── */}
      <div>
        <div style={{ ...row, color: "#555" }}>
          <span>{ID.posSubtotal}</span>
          <span>{formatCurrency(sale.totalAmount)}</span>
        </div>
        {sale.ppnPercentage > 0 && (
          <div style={{ ...row, color: "#555" }}>
            <span>PPN ({sale.ppnPercentage}%)</span>
            <span>{formatCurrency(sale.ppnAmount)}</span>
          </div>
        )}
        {sale.discountAmount > 0 && (
          <div style={{ ...row, color: "#555" }}>
            <span>{sl(ID.posDiscountLabel, EN.posDiscountLabel)}</span>
            <span>-{formatCurrency(sale.discountAmount)}</span>
          </div>
        )}
        <div style={{ ...row, fontWeight: 700, fontSize: "14px", marginTop: "4px", borderTop: "1px solid #1a1a1a", paddingTop: "6px" }}>
          <span>Total</span>
          <span>{formatCurrency(sale.grandTotal)}</span>
        </div>
      </div>

      <div style={divider} />

      {/* ── Payment ──────────────────────────────── */}
      <div>
        <div style={{ ...row, color: "#555" }}>
          <span>{sl(ID.saleDocPayment, EN.saleDocPayment)} ({paymentMethodLabel})</span>
          <span>{formatCurrency(amountReceived)}</span>
        </div>
        {change > 0 && (
          <div style={{ ...row, color: "#555" }}>
            <span>{sl(ID.posChangeLabel, EN.posChangeLabel)}</span>
            <span>{formatCurrency(change)}</span>
          </div>
        )}
      </div>

      <div style={divider} />

      {/* ── Footer ───────────────────────────────── */}
      <div style={{ textAlign: "center", fontSize: "11px", color: "#777", lineHeight: 1.6 }}>
        <div>{sl(ID.posReceiptCashierLabel, EN.posReceiptCashierLabel)}: {cashierName}</div>
        <div style={{ marginTop: "6px" }}>{ID.saleDocThankYouVisit}</div>
        <div style={{ fontStyle: "italic", fontSize: "0.9em", opacity: 0.7 }}>{EN.saleDocThankYouVisit}</div>
      </div>
    </div>
  );
}
