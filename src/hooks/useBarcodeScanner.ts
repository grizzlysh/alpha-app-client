import { useEffect, useRef } from "react";

interface Options {
  /** Called with the scanned code. */
  onScan: (code: string) => void;
  enabled?: boolean;
  /** Max gap between keystrokes for them to count as one scan. USB scanners type in < 30 ms. */
  maxGapMs?: number;
  minLength?: number;
}

/**
 * Captures USB/Bluetooth (HID keyboard-wedge) barcode scanners anywhere on the
 * page: a burst of fast keystrokes ending in Enter is treated as a scan.
 *
 * Keystrokes typed into a text field are left alone (the field handles its own
 * Enter), so this never steals normal typing — it only catches scans made while
 * focus is elsewhere, e.g. right after clicking a product card.
 */
export function useBarcodeScanner({ onScan, enabled = true, maxGapMs = 50, minLength = 4 }: Options): void {
  const buffer = useRef("");
  const lastTime = useRef(0);
  const onScanRef = useRef(onScan);
  onScanRef.current = onScan;

  useEffect(() => {
    if (!enabled) return;

    function isEditable(el: EventTarget | null): boolean {
      if (!(el instanceof HTMLElement)) return false;
      const tag = el.tagName;
      return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || el.isContentEditable;
    }

    function handleKey(e: KeyboardEvent): void {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (isEditable(e.target)) {
        buffer.current = "";
        return;
      }
      const now = performance.now();
      if (now - lastTime.current > maxGapMs) buffer.current = "";
      lastTime.current = now;

      if (e.key === "Enter") {
        const code = buffer.current;
        buffer.current = "";
        if (code.length >= minLength) {
          e.preventDefault();
          onScanRef.current(code);
        }
        return;
      }
      if (e.key.length === 1) buffer.current += e.key;
    }

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [enabled, maxGapMs, minLength]);
}
