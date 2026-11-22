import { barcodeSvg } from "@/utils/barcode";
import type { StockCard } from "@/types/stock";

/**
 * What can be printed: one label for the whole batch, one label per item
 * (box) of the batch, the medicine's shelf label, or the batch's stock card.
 */
export type PrintKind = "batch-label" | "item-label" | "medicine-label" | "stock-card";
export type LabelKind = Exclude<PrintKind, "stock-card">;

/** Label stock: a thermal roll (one label per page) or an A4 sheet of 3 × 8. */
export type LabelSize = "50x30" | "38x25" | "a4-64x34";

export const LABEL_SIZES: { value: LabelSize; mm: [number, number] }[] = [
  { value: "50x30", mm: [50, 30] },
  { value: "38x25", mm: [38, 25] },
  { value: "a4-64x34", mm: [64, 34] },
];

/** Text on labels and cards, already in the user's language. */
export interface LabelText {
  batch: string;
  expiry: string;
  stock: string;
  totalStock: string;
  contents: string;
  item: string;
  box: string;
  allBatches: string;
  stockCard: string;
  packaging: string;
  distributor: string;
  location: string;
  minStock: string;
  date: string;
  document: string;
  fromTo: string;
  in: string;
  out: string;
  balance: string;
  initials: string;
  openingBalance: string;
  printedOn: string;
  page: string;
}

/** Which lines a label shows. Stock only applies to the batch label. */
export interface LabelFields {
  showStock: boolean;
  showExpiry: boolean;
  showContents: boolean;
  showPrice: boolean;
}

export interface LabelOptions extends LabelFields {
  size: LabelSize;
  copies: number;
  /** Item labels: number of the first item (to continue a batch printed earlier). */
  startNumber: number;
  /** "id-ID" or "en-GB": dates and money. */
  locale: string;
  /** Applies the pharmacy's name display setting (upper / title / as typed). */
  formatName: (name: string) => string;
}

const esc = (s: string): string =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

const rupiah = (n: number): string => `Rp ${Math.round(n).toLocaleString("id-ID")}`;
const monthYear = (iso: string): string => {
  const d = new Date(iso);
  return `${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
};
const fullDate = (iso: string, locale: string): string =>
  new Date(iso).toLocaleDateString(locale, { day: "2-digit", month: "short", year: "numeric" });

/**
 * The Indonesian drug-class mark, from the medicine type's name: green circle
 * (Bebas), blue (Bebas Terbatas), red with K (Keras), red cross (Narkotika /
 * Psikotropika). Types with another name get no mark.
 */
export function drugClassMark(typeName: string, isControlled: boolean, sizeMm = 4.4): string {
  const n = typeName.toLowerCase();
  const box = `width="${sizeMm}mm" height="${sizeMm}mm" viewBox="0 0 20 20"`;
  if (isControlled || n.includes("narkotika") || n.includes("psikotropika")) {
    return `<svg ${box}><circle cx="10" cy="10" r="9" fill="#fff" stroke="#d92020" stroke-width="1.8"/><path d="M10 3.5v13M3.5 10h13" stroke="#d92020" stroke-width="3.2"/></svg>`;
  }
  if (n.includes("terbatas")) return `<svg ${box}><circle cx="10" cy="10" r="9" fill="#1d5fd1" stroke="#000" stroke-width="1.4"/></svg>`;
  if (n.includes("keras")) {
    return `<svg ${box}><circle cx="10" cy="10" r="9" fill="#d92020" stroke="#000" stroke-width="1.4"/><path d="M7 4.5v11M7 10l5.2-5.5M8.6 8.4 13 15.5" stroke="#000" stroke-width="1.9" fill="none"/></svg>`;
  }
  if (n.includes("bebas")) return `<svg ${box}><circle cx="10" cy="10" r="9" fill="#1f9d3a" stroke="#000" stroke-width="1.4"/></svg>`;
  return "";
}

// ── Labels ────────────────────────────────────────────────────────────────────

/** The code printed on item n of a batch: the batch code, "-" and a 3-digit number. */
export const itemCode = (batchBarcode: string, n: number): string => `${batchBarcode}-${String(n).padStart(3, "0")}`;

/** "isi 10 strip" for a box, or the unit itself when a batch is not boxed. */
function contentsText(card: StockCard, text: LabelText): string {
  const unit = card.medicine.unit.toLowerCase();
  return card.batch.quantityPerBox > 1
    ? `${text.contents} 1 ${text.box} = ${card.batch.quantityPerBox} ${unit}`
    : `${text.contents} 1 ${unit}`;
}

/** "44 strip": the batch's stock, or with `pieces` another amount, in the selling unit. */
export function stockText(card: StockCard, pieces: number = card.batch.quantityPieces): string {
  return `${pieces.toLocaleString("id-ID")} ${card.medicine.unit.toLowerCase()}`;
}

/** "44 strip (4 box + 4 strip)": the same, broken into full boxes and loose units (stock card). */
export function stockBreakdownText(card: StockCard): string {
  const unit = card.medicine.unit.toLowerCase();
  const pieces = card.batch.quantityPieces;
  const per = card.batch.quantityPerBox;
  if (per <= 1) return stockText(card);
  const boxes = Math.floor(pieces / per);
  const rest = pieces % per;
  const parts = [boxes > 0 ? `${boxes} box` : "", rest > 0 ? `${rest} ${unit}` : ""].filter(Boolean).join(" + ");
  return `${stockText(card)}${parts ? ` (${parts})` : ""}`;
}

/** One label's inner HTML. `itemNumber` is set for item labels. */
export function labelHtml(kind: LabelKind, card: StockCard, text: LabelText, opts: LabelOptions, itemNumber?: number): string {
  const m = card.medicine;
  const small = opts.size === "38x25";
  const code =
    kind === "medicine-label" ? m.barcode : kind === "item-label" ? itemCode(card.batch.barcode, itemNumber ?? 1) : card.batch.barcode;
  const svg = code ? barcodeSvg(code, { height: small ? 34 : 40, width: 1.4, fontSize: small ? 9 : 10 }) : null;
  const mark = drugClassMark(m.type, m.isControlled, small ? 3.4 : 4.4);
  const name = esc(opts.formatName(m.name));

  const rows: string[] = [];
  if (kind !== "medicine-label") {
    const batch = `<span>${text.batch} <b class="mono">${esc(card.batch.batchNumber.toUpperCase())}</b></span>`;
    const expiry = opts.showExpiry ? `<span>${text.expiry} <b>${monthYear(card.batch.expiryDate)}</b></span>` : "";
    rows.push(`<div class="row">${batch}${expiry}</div>`);
  } else {
    rows.push(`<div class="row"><span>${text.allBatches}</span></div>`);
  }
  // One fact per line so nothing gets cut off; the price sits at the end of the last line.
  const lines: string[] = [];
  // Contents (per box) only on item labels: an item is one box.
  const contents = kind === "item-label" && opts.showContents ? esc(contentsText(card, text)) : "";
  if (kind === "item-label") lines.push(`<b>${text.item} ${itemNumber ?? 1}</b>${contents ? ` · ${contents}` : ""}`);
  else if (contents) lines.push(contents);
  // Batch label: this batch's stock. Medicine label: the total over every batch.
  if (kind === "batch-label" && opts.showStock) lines.push(`${text.stock} <b>${esc(stockText(card))}</b>`);
  if (kind === "medicine-label" && opts.showStock) {
    lines.push(`${text.totalStock} <b>${esc(stockText(card, card.medicineTotalPieces))}</b>`);
  }
  const price = opts.showPrice ? `<b class="price">${rupiah(card.sellingPrice)}</b>` : "";
  if (lines.length === 0 && price) lines.push("");
  lines.forEach((line, i) => {
    rows.push(`<div class="row"><span class="left">${line}</span>${i === lines.length - 1 ? price : ""}</div>`);
  });

  return `
    <div class="top">
      <div class="id">
        ${small ? "" : `<div class="shop">${esc(card.pharmacy.name)}</div>`}
        <div class="name">${name}</div>
        ${small ? "" : `<div class="sub">${esc(m.shape)} · ${esc(m.unit)}</div>`}
      </div>
      ${mark}
    </div>
    ${rows.join("")}
    <div class="bc">${svg ?? `<span class="mono">${esc(code ?? "")}</span>`}</div>`;
}

const LABEL_CSS = `
  * { box-sizing: border-box; }
  body { margin: 0; font-family: Inter, "Helvetica Neue", Arial, sans-serif; color: #000; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  .mono { font-family: "JetBrains Mono", Menlo, Consolas, monospace; }
  .label { display: flex; flex-direction: column; overflow: hidden; background: #fff; }
  .top { display: flex; justify-content: space-between; gap: 1mm; align-items: flex-start; }
  .id { min-width: 0; }
  .shop { font-size: 5pt; letter-spacing: .04em; text-transform: uppercase; color: #444; }
  .name { font-weight: 700; text-transform: uppercase; line-height: 1.1; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; }
  .sub { color: #444; }
  .row { display: flex; justify-content: space-between; gap: 1mm; margin-top: .3mm; white-space: nowrap; }
  .row .left { min-width: 0; overflow: hidden; text-overflow: ellipsis; }
  .bc { margin-top: auto; height: var(--bc-h); display: flex; justify-content: center; }
  .bc svg { width: 100%; height: 100%; }
`;

const SIZE_CSS: Record<LabelSize, string> = {
  "50x30": `@page { size: 50mm 30mm; margin: 0; }
    .label { width: 50mm; height: 30mm; padding: 1.5mm 2mm 1.2mm; break-after: page; --bc-h: 11mm; }
    .name { font-size: 7.8pt; } .sub, .row { font-size: 5.6pt; } .price { font-size: 6.8pt; }`,
  "38x25": `@page { size: 38mm 25mm; margin: 0; }
    .label { width: 38mm; height: 25mm; padding: 1.3mm 1.5mm 1mm; break-after: page; --bc-h: 10mm; }
    .name { font-size: 6.4pt; -webkit-line-clamp: 1; } .row { font-size: 5pt; } .price { font-size: 5.6pt; }`,
  "a4-64x34": `@page { size: A4; margin: 6mm 7mm; }
    .sheet { display: grid; grid-template-columns: repeat(3, 64mm); grid-auto-rows: 34mm; column-gap: 2.5mm; break-after: page; }
    .label { width: 64mm; height: 34mm; padding: 2mm 2.4mm 1.4mm; --bc-h: 12mm; }
    .name { font-size: 8pt; } .sub, .row { font-size: 6pt; } .shop { font-size: 5.6pt; } .price { font-size: 7.4pt; }`,
};

/** A full printable document of `copies` labels (item labels numbered from `startNumber`). */
export function labelsDocument(kind: LabelKind, card: StockCard, text: LabelText, opts: LabelOptions): string {
  const copies = Math.max(1, Math.min(500, Math.floor(opts.copies)));
  const start = Math.max(1, Math.floor(opts.startNumber));
  const same = kind === "item-label" ? null : `<div class="label">${labelHtml(kind, card, text, opts)}</div>`;
  const labels = Array.from({ length: copies }, (_, i) =>
    same ?? `<div class="label">${labelHtml(kind, card, text, opts, start + i)}</div>`
  );
  let body: string;
  if (opts.size === "a4-64x34") {
    const sheets: string[] = [];
    for (let i = 0; i < labels.length; i += 24) sheets.push(`<div class="sheet">${labels.slice(i, i + 24).join("")}</div>`);
    body = sheets.join("");
  } else {
    body = labels.join("");
  }
  return `<style>${LABEL_CSS}${SIZE_CSS[opts.size]}</style>${body}`;
}

// ── Stock card (A5) ───────────────────────────────────────────────────────────

/** Movement rows per A5 page; the header repeats on each page. */
const ROWS_PER_PAGE = 20;

export function stockCardDocument(card: StockCard, text: LabelText, opts: Pick<LabelOptions, "locale" | "formatName">): string {
  const m = card.medicine;
  const b = card.batch;
  const svg = barcodeSvg(b.barcode, { height: 40, width: 1.5, fontSize: 11 }) ?? "";
  const mark = drugClassMark(m.type, m.isControlled, 5);
  const today = fullDate(new Date().toISOString(), opts.locale);

  type Row = { date: string; doc: string; party: string; inn: string; out: string; bal: string };
  const rows: Row[] = [];
  if (card.openingBalance !== 0) {
    rows.push({ date: "", doc: "", party: text.openingBalance, inn: "", out: "", bal: String(card.openingBalance) });
  }
  for (const l of card.lines) {
    rows.push({
      date: fullDate(l.date, opts.locale),
      doc: l.documentNumber ?? "",
      party: l.party ?? "",
      inn: l.type === "IN" ? String(l.quantity) : "",
      out: l.type === "OUT" ? String(l.quantity) : "",
      bal: String(l.balance),
    });
  }
  const pages: Row[][] = [];
  for (let i = 0; i < Math.max(rows.length, 1); i += ROWS_PER_PAGE) pages.push(rows.slice(i, i + ROWS_PER_PAGE));
  // Leave the last page's empty rows for handwritten entries.
  const last = pages[pages.length - 1];
  while (last.length < ROWS_PER_PAGE) last.push({ date: "", doc: "", party: "", inn: "", out: "", bal: "" });

  const header = `
    <div class="head">
      <div>
        <div class="title">${text.stockCard.toUpperCase()}</div>
        <div class="muted">${esc(card.pharmacy.name)} · ${esc(card.pharmacy.code)}</div>
        <div class="med">${mark}<div><div class="mname">${esc(opts.formatName(m.name))}</div><div class="muted">${esc(m.type)} · ${esc(m.therapeuticClass)}</div></div></div>
      </div>
      <div class="bcbox">${svg}</div>
    </div>
    <dl>
      <dt>${text.packaging}</dt><dd>${esc(m.shape)} · ${esc(m.unit)}${b.quantityPerBox > 1 ? ` isi ${b.quantityPerBox}` : ""}</dd>
      <dt>${text.batch}</dt><dd class="mono">${esc(b.batchNumber.toUpperCase())}</dd>
      <dt>${text.distributor}</dt><dd>${esc(b.distributor)}</dd>
      <dt>${text.expiry}</dt><dd>${fullDate(b.expiryDate, opts.locale)}</dd>
      <dt>${text.location}</dt><dd>${esc(b.location ?? "—")}</dd>
      <dt>${text.minStock}</dt><dd>${card.reorderLevel} ${esc(m.unit.toLowerCase())}</dd>
      <dt>${text.totalStock}</dt><dd>${esc(stockBreakdownText(card))}</dd>
      <dt>${text.contents}</dt><dd>${esc(contentsText(card, text).replace(`${text.contents} `, ""))}</dd>
    </dl>`;

  const table = (page: Row[]): string => `
    <table>
      <thead><tr><th class="c-date">${text.date}</th><th>${text.document}</th><th>${text.fromTo}</th><th class="n">${text.in}</th><th class="n">${text.out}</th><th class="n">${text.balance}</th><th class="c-ed">${text.expiry}</th><th class="c-sign">${text.initials}</th></tr></thead>
      <tbody>${page
        .map(
          (r) => `<tr><td>${r.date}</td><td class="mono">${esc(r.doc)}</td><td class="party">${esc(r.party)}</td><td class="n">${r.inn}</td><td class="n">${r.out}</td><td class="n"><b>${r.bal}</b></td><td>${r.date ? monthYear(b.expiryDate) : ""}</td><td></td></tr>`
        )
        .join("")}</tbody>
    </table>`;

  const body = pages
    .map(
      (page, i) => `<section class="card">${header}${table(page)}
        <div class="foot"><span>${text.printedOn} ${today}</span><span>${text.page} ${i + 1}/${pages.length}</span></div></section>`
    )
    .join("");

  return `<style>
    @page { size: A5; margin: 8mm; }
    * { box-sizing: border-box; }
    body { margin: 0; font-family: Inter, "Helvetica Neue", Arial, sans-serif; color: #000; font-size: 7.4pt; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    .mono { font-family: "JetBrains Mono", Menlo, Consolas, monospace; }
    .card { break-after: page; }
    .head { display: flex; justify-content: space-between; gap: 4mm; border-bottom: .5mm solid #000; padding-bottom: 2.5mm; }
    .title { font-size: 12pt; font-weight: 700; letter-spacing: .08em; }
    .muted { color: #555; font-size: 6.8pt; }
    .med { display: flex; gap: 2mm; align-items: center; margin-top: 2mm; }
    .mname { font-size: 10pt; font-weight: 700; text-transform: uppercase; }
    .bcbox { width: 52mm; height: 15mm; flex: none; }
    .bcbox svg { width: 100%; height: 100%; }
    dl { display: grid; grid-template-columns: 22mm 1fr 16mm 1fr; gap: 1mm 2mm; margin: 2.5mm 0; }
    dt { color: #555; } dd { margin: 0; font-weight: 600; }
    table { width: 100%; border-collapse: collapse; font-size: 6.6pt; font-variant-numeric: tabular-nums; }
    th, td { border: .25mm solid #333; padding: 1mm 1.2mm; text-align: left; height: 6mm; white-space: nowrap; }
    th { background: #f1f1f1; font-size: 6pt; text-transform: uppercase; letter-spacing: .03em; }
    td.mono { font-size: 6pt; }
    td.party { max-width: 30mm; overflow: hidden; text-overflow: ellipsis; }
    .n { text-align: right; width: 10mm; }
    .c-date { width: 17mm; } .c-ed { width: 12mm; } .c-sign { width: 11mm; }
    .foot { display: flex; justify-content: space-between; color: #555; font-size: 6.2pt; margin-top: 2mm; }
  </style>${body}`;
}

/**
 * Opens the document in a new window and starts printing. Must be called from
 * a click handler so the browser allows the window.
 */
export function printDocument(title: string, html: string): boolean {
  const win = window.open("", "_blank", "width=820,height=900");
  if (!win) return false;
  win.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>${esc(title)}</title></head><body>${html}
    <script>window.onload = function () { window.focus(); window.print(); };</script></body></html>`);
  win.document.close();
  return true;
}
