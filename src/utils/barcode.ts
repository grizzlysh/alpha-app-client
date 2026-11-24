import JsBarcode from "jsbarcode";

/** True for a 13-digit code whose last digit is a valid EAN-13 check digit. */
export function isValidEan13(code: string): boolean {
  if (!/^\d{13}$/.test(code)) return false;
  return eanCheckDigit(code.slice(0, 12)) === Number(code[12]);
}

function eanCheckDigit(first12: string): number {
  const sum = [...first12].reduce((acc, d, i) => acc + Number(d) * (i % 2 === 0 ? 1 : 3), 0);
  return (10 - (sum % 10)) % 10;
}

/**
 * A new in-store EAN-13. Codes starting with "2" are reserved by GS1 for use
 * inside a shop, so they never clash with a maker's barcode on a pack.
 */
export function generateInStoreEan13(): string {
  const body = "2" + Array.from({ length: 11 }, () => Math.floor(Math.random() * 10)).join("");
  return body + eanCheckDigit(body);
}

export interface BarcodeSvgOptions {
  /** Bar height in px of the SVG's own coordinate space (it is scaled to the label). */
  height?: number;
  /** Width of the thinnest bar in px. */
  width?: number;
  fontSize?: number;
  showText?: boolean;
}

/**
 * The barcode as SVG markup: EAN-13 when the value is one, otherwise Code 128
 * (letters, digits and symbols, as batch codes are). Returns null when the
 * value cannot be encoded.
 */
export function barcodeSvg(value: string, options: BarcodeSvgOptions = {}): string | null {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  try {
    JsBarcode(svg, value, {
      format: isValidEan13(value) ? "EAN13" : "CODE128",
      height: options.height ?? 40,
      width: options.width ?? 1.4,
      fontSize: options.fontSize ?? 11,
      displayValue: options.showText ?? true,
      margin: 0,
      textMargin: 1,
      font: "monospace",
      background: "#ffffff",
      lineColor: "#000000",
    });
  } catch {
    return null;
  }
  // Let the SVG scale to its box while keeping its proportions.
  const w = svg.getAttribute("width");
  const h = svg.getAttribute("height");
  if (w && h) {
    svg.setAttribute("viewBox", `0 0 ${parseFloat(w)} ${parseFloat(h)}`);
    svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
    svg.removeAttribute("width");
    svg.removeAttribute("height");
  }
  return svg.outerHTML;
}
