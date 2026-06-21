import type { JSX } from "react";
import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { ScanBarcode } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Translations } from "@/configs/i18n";

export interface BarcodeScannerModalProps {
  t: Translations;
  onClose: () => void;
  onScan: (code: string) => void;
}

const SCANNER_ELEMENT_ID = "pos-barcode-scanner";
const CAMERA_START_TIMEOUT_MS = 8000;

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("Camera start timed out")), ms);
    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (error) => {
        clearTimeout(timer);
        reject(error);
      }
    );
  });
}

export function BarcodeScannerModal({ t, onClose, onScan }: BarcodeScannerModalProps): JSX.Element {
  const [error, setError] = useState<string | null>(null);
  const onScanRef = useRef(onScan);
  onScanRef.current = onScan;

  useEffect(() => {
    let isActive = true;
    let scanner: Html5Qrcode | null = null;
    let rafId: number | null = null;
    let startPromise: Promise<void> | null = null;

    const config = { fps: 10, qrbox: { width: 250, height: 150 } };
    const handleDecode = (decodedText: string): void => {
      if (!isActive) return;
      isActive = false;
      onScanRef.current(decodedText);
    };

    async function startScanning(instance: Html5Qrcode): Promise<void> {
      setError(null);

      try {
        await withTimeout(
          instance.start({ facingMode: "environment" }, config, handleDecode, undefined),
          CAMERA_START_TIMEOUT_MS
        );
        if (isActive) setError(null);
        return;
      } catch {
        // No rear-facing camera (e.g. laptops), permission denied, or the
        // request hung (e.g. camera already in use elsewhere) — fall back
        // to the first available camera instead of leaving this hanging.
        // Stop the first attempt cleanly before retrying on the same
        // instance, in case it eventually resolves in the background.
        await instance.stop().catch(() => {});
      }

      try {
        const cameras = await withTimeout(Html5Qrcode.getCameras(), CAMERA_START_TIMEOUT_MS);
        if (!isActive || cameras.length === 0) {
          if (isActive) setError(t.posScanCameraError);
          return;
        }
        await withTimeout(
          instance.start(cameras[0].id, config, handleDecode, undefined),
          CAMERA_START_TIMEOUT_MS
        );
        if (isActive) setError(null);
      } catch {
        if (isActive) setError(t.posScanCameraError);
      }
    }

    function tryInit(): void {
      if (!isActive) return;
      // The Dialog content mounts via a Radix portal on a deferred layout
      // effect, so the target element may not exist on this exact tick yet.
      if (!document.getElementById(SCANNER_ELEMENT_ID)) {
        rafId = requestAnimationFrame(tryInit);
        return;
      }
      scanner = new Html5Qrcode(SCANNER_ELEMENT_ID);
      startPromise = startScanning(scanner);
    }

    tryInit();

    return () => {
      isActive = false;
      if (rafId !== null) cancelAnimationFrame(rafId);
      // Wait for any in-flight start() to settle before stopping — calling
      // stop() while the camera is still initializing leaves the stream
      // running with no further code left to close it (causes a stuck
      // black video element behind the dialog after close).
      (startPromise ?? Promise.resolve()).finally(() => {
        if (scanner?.isScanning) {
          scanner.stop().then(() => scanner?.clear()).catch(() => {});
        }
      });
    };
  }, [t.posScanCameraError]);

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-sm p-0">
        <DialogHeader className="flex flex-row items-center gap-3 space-y-0 border-b border-border px-6 py-4">
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10">
            <ScanBarcode className="h-4 w-4 text-primary" />
          </div>
          <DialogTitle className="text-base">{t.posScanModalTitle}</DialogTitle>
        </DialogHeader>

        <div className="space-y-3 px-6 py-5">
          <div id={SCANNER_ELEMENT_ID} className="h-72 w-full overflow-hidden rounded-xl bg-black [&_video]:h-full [&_video]:w-full [&_video]:object-cover" />
          {error ? (
            <p className="text-center text-sm text-destructive">{error}</p>
          ) : (
            <p className="text-center text-xs text-muted-foreground">{t.posScanInstructions}</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
