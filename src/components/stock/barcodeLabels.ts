import { barcodeSvg } from "@/utils/barcode";
import { needsLockedCabinet } from "@/utils/orderLetter";
import type { BatchLabel, MedicineStockCard } from "@/types/stock";

/**
 * Every label is a batch label (the batch's own barcode). It is printed either
 * once per pack, to stick on each pack, or once per batch, to keep where the
 * batch is stored.
 */
export type PrintMode = "per-pack" | "per-batch";

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
  /** "Locked cabinet": printed on narcotics and psychotropics. */
  lockedCabinet: string;
  packaging: string;
  location: string;
  minStock: string;
  date: string;
  notes: string;
  period: string;
  salesCount: string;
  adjustmentsCount: string;
  batchesInStock: string;
  in: string;
  out: string;
  balance: string;
  initials: string;
  openingBalance: string;
  printedOn: string;
  page: string;
}

/** Which lines a label shows. */
export interface LabelFields {
  showStock: boolean;
  showExpiry: boolean;
  showPrice: boolean;
}

/** Settings shared by every label in one print. */
export interface SheetOptions {
  size: LabelSize;
  /** "id-ID" or "en-GB": dates and money. */
  locale: string;
  /** Applies the pharmacy's name display setting (upper / title / as typed). */
  formatName: (name: string) => string;
}

export type LabelOptions = LabelFields & SheetOptions;

/** One line of a print: `copies` labels of one batch. */
export interface LabelJob {
  data: BatchLabel;
  copies: number;
  fields: LabelFields;
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

/** Packs (boxes) in a batch: the default number of labels when printing one per pack. */
export const boxCount = (pieces: number, perBox: number): number => Math.max(1, Math.ceil(pieces / Math.max(perBox, 1)));

/** "isi 1 box = 10 strip" for a box, or the unit itself when a batch is not boxed. */
function contentsText(unit: string, perBox: number, text: LabelText): string {
  const u = unit.toLowerCase();
  return perBox > 1 ? `${text.contents} 1 ${text.box} = ${perBox} ${u}` : `${text.contents} 1 ${u}`;
}

/** "44 strip": an amount in the selling unit. */
export function stockText(pieces: number, unit: string): string {
  return `${pieces.toLocaleString("id-ID")} ${unit.toLowerCase()}`;
}

/** "44 strip (4 box + 4 strip)": the same, broken into full boxes and loose units. */
export function stockBreakdownText(pieces: number, unit: string, perBox: number): string {
  if (perBox <= 1) return stockText(pieces, unit);
  const boxes = Math.floor(pieces / perBox);
  const rest = pieces % perBox;
  const parts = [boxes > 0 ? `${boxes} box` : "", rest > 0 ? stockText(rest, unit) : ""].filter(Boolean).join(" + ");
  return `${stockText(pieces, unit)}${parts ? ` (${parts})` : ""}`;
}

/** One batch label's inner HTML. */
export function labelHtml(card: BatchLabel, text: LabelText, opts: LabelOptions): string {
  const m = card.medicine;
  const small = opts.size === "38x25";
  const code = card.batch.barcode;
  const svg = barcodeSvg(code, { height: small ? 34 : 40, width: 1.4, fontSize: small ? 9 : 10 });
  const mark = drugClassMark(m.type, m.isControlled, small ? 3.4 : 4.4);
  const name = esc(opts.formatName(m.name));
  const locked = needsLockedCabinet(m.orderLetterKind);

  const rows: string[] = [];
  const batch = `<span>${text.batch} <b class="mono">${esc(card.batch.batchNumber.toUpperCase())}</b></span>`;
  const expiry = opts.showExpiry ? `<span>${text.expiry} <b>${monthYear(card.batch.expiryDate)}</b></span>` : "";
  rows.push(`<div class="row">${batch}${expiry}</div>`);
  // The stock line ends with the price, so nothing gets cut off.
  const stock = opts.showStock ? `${text.stock} <b>${esc(stockText(card.batch.quantityPieces, m.unit))}</b>` : "";
  const price = opts.showPrice ? `<b class="price">${rupiah(card.sellingPrice)}</b>` : "";
  if (stock || price) rows.push(`<div class="row"><span class="left">${stock}</span>${price}</div>`);

  return `
    <div class="top">
      <div class="id">
        ${small ? "" : `<div class="shop">${esc(card.pharmacy.name)}</div>`}
        <div class="name">${name}</div>
        ${small ? "" : `<div class="sub">${esc(m.shape)} · ${esc(m.unit)}${locked ? ` · <b>${esc(text.lockedCabinet.toUpperCase())}</b>` : ""}</div>`}
      </div>
      ${mark}
    </div>
    ${rows.join("")}
    <div class="bc">${svg ?? `<span class="mono">${esc(code)}</span>`}</div>`;
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

export const MAX_LABELS = 1000;
export const clampCopies = (n: number): number => Math.max(1, Math.min(500, Math.floor(n) || 1));

/** How many labels the jobs print in total. */
export const countLabels = (jobs: LabelJob[]): number => jobs.reduce((sum, j) => sum + clampCopies(j.copies), 0);

/** A printable document of every job's labels in order. `limit` cuts it short, for previews. */
export function labelsDocument(jobs: LabelJob[], text: LabelText, sheet: SheetOptions, limit = MAX_LABELS): string {
  const labels: string[] = [];
  for (const job of jobs) {
    const label = `<div class="label">${labelHtml(job.data, text, { ...job.fields, ...sheet })}</div>`;
    for (let i = 0; i < clampCopies(job.copies) && labels.length < limit; i++) labels.push(label);
  }
  let body: string;
  if (sheet.size === "a4-64x34") {
    const sheets: string[] = [];
    for (let i = 0; i < labels.length; i += 24) sheets.push(`<div class="sheet">${labels.slice(i, i + 24).join("")}</div>`);
    body = sheets.join("");
  } else {
    body = labels.join("");
  }
  return `<style>${LABEL_CSS}${SIZE_CSS[sheet.size]}</style>${body}`;
}

// ── Stock card (A5, one medicine, one row per day) ────────────────────────────

/** Day rows per A5 page; the header repeats on each page. */
const ROWS_PER_PAGE = 18;
/** Batches listed in the header; the rest are summed up as "+N". */
const BATCHES_SHOWN = 4;

export function stockCardDocument(card: MedicineStockCard, text: LabelText, opts: Pick<SheetOptions, "locale" | "formatName">): string {
  const m = card.medicine;
  const unit = m.unit.toLowerCase();
  const svg = m.barcode ? barcodeSvg(m.barcode, { height: 40, width: 1.5, fontSize: 11 }) ?? "" : "";
  const mark = drugClassMark(m.type, m.isControlled, 5);
  const today = fullDate(new Date().toISOString(), opts.locale);
  const day = (iso: string): string => fullDate(`${iso}T00:00:00`, opts.locale);
  const locations = [...new Set(card.batches.map((b) => b.location).filter((l): l is string => !!l))];

  type Row = { date: string; notes: string; inn: string; out: string; bal: string };
  const rows: Row[] = [{ date: day(card.period.from), notes: text.openingBalance, inn: "", out: "", bal: String(card.openingBalance) }];
  for (const d of card.days) {
    const notes = [
      ...d.documents,
      d.sales > 0 ? text.salesCount.replace("{n}", String(d.sales)) : "",
      d.adjustments > 0 ? text.adjustmentsCount.replace("{n}", String(d.adjustments)) : "",
    ].filter(Boolean);
    rows.push({
      date: day(d.date),
      notes: notes.join(", "),
      inn: d.in ? String(d.in) : "",
      out: d.out ? String(d.out) : "",
      bal: String(d.balance),
    });
  }
  const pages: Row[][] = [];
  for (let i = 0; i < rows.length; i += ROWS_PER_PAGE) pages.push(rows.slice(i, i + ROWS_PER_PAGE));
  // Leave the last page's empty rows for handwritten entries.
  const last = pages[pages.length - 1];
  while (last.length < ROWS_PER_PAGE) last.push({ date: "", notes: "", inn: "", out: "", bal: "" });

  const shown = card.batches.slice(0, BATCHES_SHOWN);
  const more = card.batches.length - shown.length;
  const batches = card.batches.length
    ? `<div class="batches"><span class="muted">${text.batchesInStock}</span>${shown
        .map(
          (b) =>
            `<span class="chip"><b class="mono">${esc(b.batchNumber.toUpperCase())}</b> · ${text.expiry} ${monthYear(b.expiryDate)} · ${esc(stockText(b.quantityPieces, unit))}</span>`
        )
        .join("")}${more > 0 ? `<span class="chip">+${more}</span>` : ""}</div>`
    : "";

  const header = `
    <div class="head">
      <div>
        <div class="title">${text.stockCard.toUpperCase()}</div>
        <div class="muted">${esc(card.pharmacy.name)} · ${esc(card.pharmacy.code)}</div>
        <div class="med">${mark}<div><div class="mname">${esc(opts.formatName(m.name))}</div><div class="muted">${esc(m.type)} · ${esc(m.therapeuticClass)}${needsLockedCabinet(m.orderLetterKind) ? ` · <b style="color:#b91c1c">${esc(text.lockedCabinet.toUpperCase())}</b>` : ""}</div></div></div>
      </div>
      ${svg ? `<div class="bcbox">${svg}</div>` : ""}
    </div>
    <dl>
      <dt>${text.packaging}</dt><dd>${esc(m.shape)} · ${esc(m.unit)}${card.quantityPerBox > 1 ? ` (${esc(contentsText(m.unit, card.quantityPerBox, text).replace(`${text.contents} `, ""))})` : ""}</dd>
      <dt>${text.period}</dt><dd>${day(card.period.from)} – ${day(card.period.to)}</dd>
      <dt>${text.totalStock}</dt><dd>${esc(stockBreakdownText(card.totalPieces, m.unit, card.quantityPerBox))}</dd>
      <dt>${text.minStock}</dt><dd>${esc(stockText(card.reorderLevel, unit))}</dd>
      <dt>${text.location}</dt><dd class="wide">${esc(locations.join(", ") || "—")}</dd>
    </dl>
    ${batches}`;

  const table = (page: Row[]): string => `
    <table>
      <thead><tr><th class="c-date">${text.date}</th><th>${text.notes}</th><th class="n">${text.in}</th><th class="n">${text.out}</th><th class="n">${text.balance}</th><th class="c-sign">${text.initials}</th></tr></thead>
      <tbody>${page
        .map(
          (r) => `<tr><td>${r.date}</td><td class="notes">${esc(r.notes)}</td><td class="n">${r.inn}</td><td class="n">${r.out}</td><td class="n"><b>${r.bal}</b></td><td></td></tr>`
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
    /* A5 minus the page margins, so the preview matches the paper. */
    .card { width: 132mm; break-after: page; }
    .head { display: flex; justify-content: space-between; gap: 4mm; border-bottom: .5mm solid #000; padding-bottom: 2.5mm; }
    .title { font-size: 12pt; font-weight: 700; letter-spacing: .08em; }
    .muted { color: #555; font-size: 6.8pt; }
    .med { display: flex; gap: 2mm; align-items: center; margin-top: 2mm; }
    .mname { font-size: 10pt; font-weight: 700; text-transform: uppercase; }
    .bcbox { width: 52mm; height: 15mm; flex: none; }
    .bcbox svg { width: 100%; height: 100%; }
    dl { display: grid; grid-template-columns: 22mm 1fr 16mm 1fr; gap: 1mm 2mm; margin: 2.5mm 0 1.5mm; }
    dt { color: #555; } dd { margin: 0; font-weight: 600; }
    dd.wide { grid-column: span 3; }
    .batches { display: flex; flex-wrap: wrap; gap: 1mm 1.5mm; align-items: center; margin-bottom: 2.5mm; font-size: 6.4pt; }
    .chip { border: .25mm solid #999; border-radius: 1mm; padding: .4mm 1.2mm; white-space: nowrap; }
    table { width: 100%; border-collapse: collapse; table-layout: fixed; font-size: 6.8pt; font-variant-numeric: tabular-nums; }
    th, td { border: .25mm solid #333; padding: 1mm 1.2mm; text-align: left; height: 6.4mm; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    th { background: #f1f1f1; font-size: 6pt; text-transform: uppercase; letter-spacing: .03em; }
    td.notes { font-size: 6.2pt; }
    .n { text-align: right; width: 14mm; }
    .c-date { width: 19mm; } .c-sign { width: 14mm; }
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
