// Sale arithmetic shared by the POS cart and payment modal. It mirrors the
// server (sales.service computeSaleTotals) exactly so the total the cashier
// sees is the total that gets saved:
//   line total = price × qty − round(price × qty × line discount %)
//   DPP        = Σ line totals − header discount
//   PPN        = round(DPP × PPN %)
//   grand      = DPP + PPN
// All math is done in integer cents to avoid floating-point drift.

const toCents = (n: number): number => Math.round(n * 100);
const fromCents = (c: number): number => c / 100;

export interface SaleLine {
  unitPrice: number;
  quantityPieces: number;
  discount: number; // percent
}

export function lineTotal(line: SaleLine): number {
  const gross = toCents(line.unitPrice) * line.quantityPieces;
  const disc = Math.round((gross * line.discount) / 100);
  return fromCents(gross - disc);
}

export interface SaleTotals {
  subtotal: number;
  discount: number;
  dpp: number;
  ppnAmount: number;
  grandTotal: number;
}

export function computeTotals(lines: SaleLine[], headerDiscount: number, ppnPercentage: number): SaleTotals {
  const subtotalC = lines.reduce((sum, l) => sum + toCents(lineTotal(l)), 0);
  const discountC = Math.min(Math.max(toCents(headerDiscount), 0), subtotalC);
  const dppC = subtotalC - discountC;
  const ppnC = Math.round((dppC * ppnPercentage) / 100);
  return {
    subtotal: fromCents(subtotalC),
    discount: fromCents(discountC),
    dpp: fromCents(dppC),
    ppnAmount: fromCents(ppnC),
    grandTotal: fromCents(dppC + ppnC),
  };
}

/** "25 pcs" → "2 box + 5 pcs" when a box holds 10. */
export function splitBoxes(pieces: number, perBox: number): { boxes: number; pieces: number } {
  if (!perBox || perBox <= 1) return { boxes: 0, pieces };
  return { boxes: Math.floor(pieces / perBox), pieces: pieces % perBox };
}
