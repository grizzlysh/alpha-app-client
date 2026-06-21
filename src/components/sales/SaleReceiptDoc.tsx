import type { JSX } from "react";
import type { Sale } from "@/types/sale";
import type { Pharmacy } from "@/types/pharmacy";
import type { Translations } from "@/configs/i18n";
import { formatCurrency } from "./salesUtils";

export interface SaleReceiptDocProps {
  sale: Sale;
  pharmacy: Pharmacy | null;
  cashierName: string;
  paymentMethodLabel: string;
  amountReceived: number;
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

export function SaleReceiptDoc({
  sale,
  pharmacy,
  cashierName,
  paymentMethodLabel,
  amountReceived,
  t,
  language,
}: SaleReceiptDocProps): JSX.Element {
  const change = amountReceived - sale.grandTotal;

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
          {fmtDate(sale.soldAt, language)} · {fmtTime(sale.soldAt)}
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
          <span>{t.posSubtotal}</span>
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
            <span>{t.posDiscountLabel}</span>
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
          <span>{t.saleDocPayment} ({paymentMethodLabel})</span>
          <span>{formatCurrency(amountReceived)}</span>
        </div>
        {change > 0 && (
          <div style={{ ...row, color: "#555" }}>
            <span>{t.posChangeLabel}</span>
            <span>{formatCurrency(change)}</span>
          </div>
        )}
      </div>

      <div style={divider} />

      {/* ── Footer ───────────────────────────────── */}
      <div style={{ textAlign: "center", fontSize: "11px", color: "#777", lineHeight: 1.6 }}>
        <div>{t.posReceiptCashierLabel}: {cashierName}</div>
        <div style={{ marginTop: "4px" }}>{t.saleDocThankYouVisit}</div>
      </div>
    </div>
  );
}
