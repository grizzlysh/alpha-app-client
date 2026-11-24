import type { JSX } from "react";

import type { Translations } from "@/configs/i18n";
import type { AuditLog } from "@/types/auditLog";
import { formatAuditValue, humanizeField } from "./auditLabels";

interface AuditLogDetailsProps {
  log: AuditLog;
  t: Translations;
}

/** What changed (old → new) and any extra facts the entry carries. */
export function AuditLogDetails({ log, t }: AuditLogDetailsProps): JSX.Element {
  const changes = Object.entries(log.changes ?? {});
  const meta = Object.entries(log.metadata ?? {}).filter(([, v]) => v !== null && v !== undefined && v !== "");
  const added = Array.isArray(log.metadata?.added) ? (log.metadata.added as string[]) : null;
  const removed = Array.isArray(log.metadata?.removed) ? (log.metadata.removed as string[]) : null;
  const plainMeta = added || removed ? meta.filter(([k]) => k !== "added" && k !== "removed") : meta;

  return (
    <div className="space-y-2 text-xs">
      {changes.length > 0 && (
        <dl className="space-y-1">
          {changes.map(([field, c]) => (
            <div key={field} className="flex flex-wrap items-baseline gap-x-2">
              <dt className="font-medium capitalize text-muted-foreground">{humanizeField(field)}</dt>
              <dd className="text-foreground">
                <span className="text-destructive line-through decoration-destructive/40">{formatAuditValue(c.from, t.auditEmptyValue)}</span>
                <span className="mx-1.5 text-muted-foreground">→</span>
                <span className="font-medium text-success">{formatAuditValue(c.to, t.auditEmptyValue)}</span>
              </dd>
            </div>
          ))}
        </dl>
      )}
      {added && added.length > 0 && (
        <p><span className="font-medium text-success">{t.auditAdded}:</span> <span className="text-foreground">{added.join(", ")}</span></p>
      )}
      {removed && removed.length > 0 && (
        <p><span className="font-medium text-destructive">{t.auditRemoved}:</span> <span className="text-foreground">{removed.join(", ")}</span></p>
      )}
      {plainMeta.length > 0 && (
        <dl className="flex flex-wrap gap-x-4 gap-y-1">
          {plainMeta.map(([k, v]) => (
            <div key={k} className="flex gap-1">
              <dt className="capitalize text-muted-foreground">{humanizeField(k)}:</dt>
              <dd className="text-foreground">{formatAuditValue(v, t.auditEmptyValue)}</dd>
            </div>
          ))}
        </dl>
      )}
      {log.ipAddress && <p className="text-muted-foreground">IP {log.ipAddress}</p>}
    </div>
  );
}
