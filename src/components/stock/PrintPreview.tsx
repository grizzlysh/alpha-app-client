import type { JSX } from "react";

import { cn } from "@/utils/cn";

export interface PrintPreviewProps {
  /** The exact HTML that gets printed. */
  html: string;
  title: string;
  zoom: number;
  /** Lay pages out from the left (A4 sheets, A5 cards) instead of centred labels. */
  alignStart?: boolean;
  className?: string;
}

/** Renders a print document in a sandboxed frame, as it will come out of the printer. */
export function PrintPreview({ html, title, zoom, alignStart = false, className }: PrintPreviewProps): JSX.Element {
  const doc = `<!doctype html><html><head><meta charset="utf-8"><style>html,body{background:#e9e9e9;margin:0}.pv{zoom:${zoom};padding:10px;display:flex;flex-wrap:wrap;gap:8px;justify-content:${alignStart ? "flex-start" : "center"}}.label{box-shadow:0 1px 4px rgba(0,0,0,.25)}.sheet,.card{background:#fff;padding:6mm 7mm;box-shadow:0 1px 4px rgba(0,0,0,.25)}</style></head><body><div class="pv">${html}</div></body></html>`;
  return <iframe title={title} sandbox="" srcDoc={doc} className={cn("w-full rounded-lg bg-white", className)} />;
}
