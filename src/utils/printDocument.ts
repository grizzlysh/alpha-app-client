import type { Sale } from "@/types/sale";
import type { Pharmacy } from "@/types/pharmacy";
import type { Customer } from "@/types/customer";
import { formatCurrency } from "@/components/sales/salesUtils";

interface PrintMetadata {
  sale: Sale;
  pharmacy: Pharmacy | null;
  customer: Customer | null;
  cashierName: string;
  paymentMethodLabel: string;
  paymentStatusLabel: string;
  amountReceived: number;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatPrintDate(value: string): string {
  return new Date(value).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatPrintTime(value: string): string {
  return new Date(value).toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function openPrintWindow(title: string, head: string, body: string): void {
  const win = window.open("", "_blank", "width=900,height=900");
  if (!win) return;

  win.document.write(`<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>${escapeHtml(title)}</title>
    ${head}
  </head>
  <body>
    ${body}
    <script>window.onload = function () { window.focus(); window.print(); };</script>
  </body>
</html>`);
  win.document.close();
}

export function printReceipt({
  sale,
  pharmacy,
  cashierName,
  paymentMethodLabel,
  amountReceived,
}: PrintMetadata): void {
  const change = amountReceived - sale.totalAmount;
  const pharmacyName = pharmacy?.name ?? "";
  const rows = sale.details
    .map(
      (item) => `<tr>
        <td colspan="2" style="text-transform:uppercase">${escapeHtml(item.medicine.name)}</td>
      </tr>
      <tr>
        <td class="muted">${item.quantityPieces} x ${formatCurrency(item.sellingPrice)}</td>
        <td class="right">${formatCurrency(item.totalAmount)}</td>
      </tr>`
    )
    .join("");

  const head = `<style>
      * { box-sizing: border-box; }
      body { font-family: "Courier New", monospace; color: #111; margin: 0; padding: 24px; }
      table { width: 100%; border-collapse: collapse; }
      td { padding: 2px 0; vertical-align: top; }
      .right { text-align: right; }
      .center { text-align: center; }
      .bold { font-weight: 700; }
      .muted { color: #555; }
      .divider { border-top: 1px dashed #999; margin: 10px 0; }
      h1 { font-size: 16px; margin: 0 0 2px; }
      h2 { font-size: 13px; margin: 0 0 12px; font-weight: 400; }
    </style>`;

  const body = `
    <div class="center">
      <h1>${escapeHtml(pharmacyName)}</h1>
      <h2 class="muted">${escapeHtml(sale.saleNumber)} · ${formatPrintDate(sale.soldAt)} ${formatPrintTime(sale.soldAt)}</h2>
    </div>
    <div class="divider"></div>
    <table>${rows}</table>
    <div class="divider"></div>
    <table>
      <tr><td>Subtotal</td><td class="right">${formatCurrency(sale.totalAmount)}</td></tr>
      <tr><td>PPN (${sale.ppnPercentage}%)</td><td class="right">${formatCurrency(sale.ppnAmount)}</td></tr>
      ${sale.discountAmount > 0 ? `<tr><td>Diskon</td><td class="right">-${formatCurrency(sale.discountAmount)}</td></tr>` : ""}
      <tr class="bold"><td>Total</td><td class="right">${formatCurrency(sale.grandTotal)}</td></tr>
    </table>
    <div class="divider"></div>
    <table>
      <tr><td>Bayar (${escapeHtml(paymentMethodLabel)})</td><td class="right">${formatCurrency(amountReceived)}</td></tr>
      ${change > 0 ? `<tr><td>Kembalian</td><td class="right">${formatCurrency(change)}</td></tr>` : ""}
    </table>
    <div class="divider"></div>
    <p class="center muted">Pelanggan: <span style="text-transform:uppercase">${escapeHtml(sale.customer.name)}</span></p>
    <p class="center muted">Kasir: ${escapeHtml(cashierName)}</p>
    <p class="center muted">Terima kasih atas kunjungan Anda</p>
  `;

  openPrintWindow(sale.saleNumber, head, body);
}

export function printInvoice({
  sale,
  pharmacy,
  customer,
  paymentMethodLabel,
  paymentStatusLabel,
}: PrintMetadata): void {
  const pharmacyName = pharmacy?.name ?? "";
  const pharmacyInitial = pharmacyName ? pharmacyName.charAt(0).toUpperCase() : "?";
  const lastPaymentDate = sale.payment?.history[sale.payment.history.length - 1]?.paymentDate ?? sale.soldAt;
  const isPaid = sale.payment?.paymentStatus === "PAID";

  const rows = sale.details
    .map(
      (item, index) => `<tr>
        <td class="muted">${index + 1}</td>
        <td>
          <div class="item-name" style="text-transform:uppercase">${escapeHtml(item.medicine.name)}</div>
          <div class="item-meta"><span style="text-transform:uppercase">${escapeHtml(item.stockDetail.batchNumber)}</span> · ${item.quantityPieces} ${escapeHtml(item.medicine.unit)}</div>
        </td>
        <td class="right">${item.quantityPieces}</td>
        <td class="right">${formatCurrency(item.sellingPrice)}</td>
        <td class="right">${formatCurrency(item.totalAmount)}</td>
      </tr>`
    )
    .join("");

  const head = `<style>
      * { box-sizing: border-box; }
      body {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        background: #f3efe6;
        color: #19181a;
        margin: 0;
        padding: 40px 24px;
      }
      .card {
        max-width: 760px;
        margin: 0 auto;
        background: #fdfcf9;
        border: 1px solid #e6e1d6;
        border-radius: 16px;
        padding: 48px;
      }
      .row { display: flex; justify-content: space-between; align-items: flex-start; gap: 24px; }
      .right { text-align: right; }
      .muted { color: #767066; }
      .mono { font-family: "Courier New", monospace; }
      .title { font-family: Georgia, "Times New Roman", serif; font-style: italic; font-size: 34px; margin: 0 0 8px; }
      .badge {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 28px;
        height: 28px;
        background: #19181a;
        color: #fdfcf9;
        font-family: Georgia, serif;
        font-style: italic;
        border-radius: 6px;
        margin-right: 8px;
      }
      .pharmacy-name { font-size: 17px; font-weight: 700; }
      .divider { border-top: 1px solid #e6e1d6; margin: 28px 0; }
      .label { font-size: 11px; letter-spacing: 0.06em; text-transform: uppercase; color: #9b958a; margin-bottom: 8px; }
      .customer-name { font-weight: 700; font-size: 15px; margin-bottom: 2px; }
      table { width: 100%; border-collapse: collapse; }
      thead td { font-size: 11px; letter-spacing: 0.04em; text-transform: uppercase; color: #9b958a; padding-bottom: 10px; border-bottom: 1px solid #e6e1d6; }
      tbody td { padding: 14px 0; border-bottom: 1px solid #f0ece2; vertical-align: top; }
      .item-name { font-weight: 600; }
      .item-meta { font-family: "Courier New", monospace; font-size: 12px; color: #9b958a; margin-top: 2px; }
      .summary { width: 280px; margin-left: auto; margin-top: 20px; }
      .summary-row { display: flex; justify-content: space-between; padding: 4px 0; font-size: 14px; }
      .summary-total { display: flex; justify-content: space-between; padding-top: 14px; margin-top: 10px; border-top: 1px solid #e6e1d6; font-size: 20px; font-weight: 700; }
      .footer { display: flex; justify-content: space-between; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e6e1d6; font-size: 13px; color: #767066; }
    </style>`;

  const body = `
    <div class="card">
      <div class="row">
        <div>
          <p class="title">Faktur</p>
          <p class="muted mono">No. ${escapeHtml(sale.saleNumber)} · ${formatPrintDate(sale.soldAt)}</p>
        </div>
        <div class="right">
          <div><span class="badge">${escapeHtml(pharmacyInitial)}</span><span class="pharmacy-name">${escapeHtml(pharmacyName)}</span></div>
          ${pharmacy?.address ? `<p class="muted">${escapeHtml(pharmacy.address)}</p>` : ""}
          ${pharmacy?.phone ? `<p class="muted">${escapeHtml(pharmacy.phone)}</p>` : ""}
        </div>
      </div>

      <div class="divider"></div>

      <div class="row">
        <div>
          <p class="label">Ditagihkan kepada</p>
          <p class="customer-name" style="text-transform:uppercase">${escapeHtml(sale.customer.name)}</p>
          ${customer?.phone ? `<p class="mono">${escapeHtml(customer.phone)}</p>` : ""}
          ${customer?.address ? `<p class="muted">${escapeHtml(customer.address)}</p>` : ""}
        </div>
        <div class="right">
          <p class="label">Metode Pembayaran</p>
          <p class="customer-name">${escapeHtml(paymentMethodLabel)}</p>
          <p class="muted">${escapeHtml(paymentStatusLabel)}${isPaid ? ` · ${formatPrintTime(lastPaymentDate)}` : ""}</p>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <td>#</td>
            <td>Deskripsi</td>
            <td class="right">Qty</td>
            <td class="right">Harga</td>
            <td class="right">Jumlah</td>
          </tr>
        </thead>
        <tbody>
          ${rows}
        </tbody>
      </table>

      <div class="summary">
        <div class="summary-row"><span>Subtotal</span><span>${formatCurrency(sale.totalAmount)}</span></div>
        <div class="summary-row"><span>PPN ${sale.ppnPercentage}%</span><span>${formatCurrency(sale.ppnAmount)}</span></div>
        ${sale.discountAmount > 0 ? `<div class="summary-row"><span>Diskon</span><span>-${formatCurrency(sale.discountAmount)}</span></div>` : ""}
        <div class="summary-total"><span>Total</span><span>${formatCurrency(sale.grandTotal)}</span></div>
      </div>

      <div class="footer">
        <span>Terima kasih atas kepercayaan Anda kepada ${escapeHtml(pharmacyName)}.</span>
        ${pharmacy?.email ? `<span>Pertanyaan? ${escapeHtml(pharmacy.email)}</span>` : ""}
      </div>
    </div>
  `;

  openPrintWindow(`Faktur-${sale.saleNumber}`, head, body);
}
