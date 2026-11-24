const ONES = ["", "satu", "dua", "tiga", "empat", "lima", "enam", "tujuh", "delapan", "sembilan", "sepuluh", "sebelas"];

/**
 * A whole number in Indonesian words, as written on order letters:
 * 12 → "dua belas", 150 → "seratus lima puluh", 1000 → "seribu".
 */
export function terbilang(n: number): string {
  const v = Math.floor(Math.abs(n));
  if (v === 0) return "nol";
  const words = (x: number): string => {
    if (x < 12) return ONES[x];
    if (x < 20) return `${ONES[x - 10]} belas`;
    if (x < 100) return `${ONES[Math.floor(x / 10)]} puluh ${words(x % 10)}`;
    if (x < 200) return `seratus ${words(x - 100)}`;
    if (x < 1000) return `${ONES[Math.floor(x / 100)]} ratus ${words(x % 100)}`;
    if (x < 2000) return `seribu ${words(x - 1000)}`;
    if (x < 1_000_000) return `${words(Math.floor(x / 1000))} ribu ${words(x % 1000)}`;
    if (x < 1_000_000_000) return `${words(Math.floor(x / 1_000_000))} juta ${words(x % 1_000_000)}`;
    return `${words(Math.floor(x / 1_000_000_000))} miliar ${words(x % 1_000_000_000)}`;
  };
  return words(v).replace(/\s+/g, " ").trim();
}
